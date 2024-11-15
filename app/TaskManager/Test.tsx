import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Animated,
    Platform,
    Alert,
    Modal,
} from 'react-native';
import axios from 'axios';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import FAB from "./FAB";

// API base URL
const API_BASE_URL = 'http://10.0.2.2:5000';

// Configure notifications
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

// Types
interface Task {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    dueDate: Date | null;
    notificationId?: string;
}

interface TimeoutRefs {
    [key: string]: NodeJS.Timeout;
}

interface CheckBoxProps {
    checked: boolean;
    onPress: () => void;
}

// Checkbox Component
const CheckBox: React.FC<CheckBoxProps> = ({ checked, onPress }) => {
    const scaleValue = useRef(new Animated.Value(0)).current;
    const fadeValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (checked) {
            Animated.parallel([
                Animated.spring(scaleValue, {
                    toValue: 1,
                    useNativeDriver: true,
                    tension: 50,
                    friction: 3,
                }),
                Animated.timing(fadeValue, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(scaleValue, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeValue, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [checked]);

    return (
        <TouchableOpacity
            onPress={onPress}
            style={styles.checkboxContainer}
            activeOpacity={0.6}
        >
            <View style={styles.checkbox}>
                <Animated.View
                    style={[
                        styles.checkboxInner,
                        {
                            transform: [{ scale: scaleValue }],
                            opacity: fadeValue,
                        },
                    ]}
                />
            </View>
        </TouchableOpacity>
    );
};

const Task: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [expoPushToken, setExpoPushToken] = useState<string | undefined>();
    const notificationListener = useRef<any>();
    const responseListener = useRef<any>();
    const deleteTimeouts = useRef<TimeoutRefs>({});
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    const showTaskDetails = (task: Task) => {
        setSelectedTask(task);
        setModalVisible(true);
    };
    const closeModal = () => {
        setModalVisible(false);
        setSelectedTask(null);
    };

    // Register for notifications and get push token
    useEffect(() => {
        const registerForPushNotificationsAsync = async () => {
            let token;

            if (Platform.OS === 'android') {
                await Notifications.setNotificationChannelAsync('default', {
                    name: 'default',
                    importance: Notifications.AndroidImportance.MAX,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: '#FF231F7C',
                });
            }

            if (Device.isDevice) {
                const { status: existingStatus } = await Notifications.getPermissionsAsync();
                let finalStatus = existingStatus;

                if (existingStatus !== 'granted') {
                    const { status } = await Notifications.requestPermissionsAsync();
                    finalStatus = status;
                }

                if (finalStatus !== 'granted') {
                    Alert.alert(
                        'Permission Required',
                        'Push notifications are required to receive task reminders.',
                        [{ text: 'OK' }]
                    );
                    return;
                }

                token = (await Notifications.getExpoPushTokenAsync()).data;
            }

            return token;
        };

        registerForPushNotificationsAsync()
            .then(token => setExpoPushToken(token))
            .catch(err => console.error('Failed to get push token:', err));

        // Add listeners for handling notifications
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            console.log('Notification received:', notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            const taskId = response.notification.request.content.data.taskId;
            console.log('Notification response received:', taskId);
            // Here you can add navigation logic to the specific task
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

    // Fetch tasks on component mount
    useEffect(() => {
        fetchTasks();
    }, []);

    // Fetch all tasks
    const fetchTasks = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/tasks`);
            const formattedTasks = response.data.map((task: any) => ({
                ...task,
                dueDate: task.due_date ? new Date(task.due_date) : null,
            }));
            setTasks(formattedTasks);
            setError(null);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            setError('Failed to fetch tasks. Please try again.');
            Alert.alert('Error', 'Failed to fetch tasks. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Add a new task
    const handleAddTask = async (newTask: {
        title: string;
        description: string;
        dueDate: Date | null;
    }) => {
        try {
            setLoading(true);
            const taskData = {
                title: newTask.title,
                description: newTask.description,
                due_date: newTask.dueDate?.toISOString(),
            };

            const response = await axios.post(`${API_BASE_URL}/tasks`, taskData);
            const createdTask = response.data;

            // Schedule notification if there's a due date
            if (newTask.dueDate) {
                const notificationId = await scheduleNotification({
                    ...createdTask,
                    dueDate: newTask.dueDate,
                });
                if (notificationId) {
                    // Update the task with notification ID
                    await axios.put(`${API_BASE_URL}/tasks/${createdTask.id}`, {
                        ...createdTask,
                        notification_id: notificationId,
                    });
                }
            }

            await fetchTasks(); // Refresh the task list
            setError(null);
        } catch (error) {
            console.error('Error adding task:', error);
            setError('Failed to add task. Please try again.');
            Alert.alert('Error', 'Failed to add task. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Delete task
    const deleteTask = async (id: string) => {
        try {
            setLoading(true);
            const task = tasks.find(t => t.id === id);
            if (task?.notificationId) {
                await cancelNotification(task.notificationId);
            }
            await axios.delete(`${API_BASE_URL}/tasks/${id}`);
            await fetchTasks(); // Refresh the task list
            setError(null);
        } catch (error) {
            console.error('Error deleting task:', error);
            setError('Failed to delete task. Please try again.');
            Alert.alert('Error', 'Failed to delete task. Please try again.');
        } finally {
            setLoading(false);
        }
    };

// Toggle task completion
const toggleTask = async (id: string) => {
    try {
        setLoading(true);
        const task = tasks.find(t => t.id === id);
        if (!task) return;

        if (task.completed) {
            // If task is already completed, use the regular update endpoint to uncomplete it
            await axios.put(`${API_BASE_URL}/tasks/${id}`, {
                completed: false,
            });
        } else {
            // If task is not completed, use the new complete endpoint
            await axios.post(`${API_BASE_URL}/tasks/${id}/complete`);

            // Handle notification cancellation if task is being completed
            if (task.notificationId) {
                await cancelNotification(task.notificationId);
            }

            // Clear existing timeout if any
            if (deleteTimeouts.current[id]) {
                clearTimeout(deleteTimeouts.current[id]);
            }

            // Set timeout for auto-delete
            deleteTimeouts.current[id] = setTimeout(() => {
                deleteTask(id);
                delete deleteTimeouts.current[id];
            }, 3000);
        }

        await fetchTasks(); // Refresh the task list
        setError(null);
    } catch (error) {
        console.error('Error toggling task:', error);
        setError('Failed to update task. Please try again.');
        Alert.alert('Error', 'Failed to update task. Please try again.');
    } finally {
        setLoading(false);
    }
};

    // Format due date for display
    const formatDueDate = (date: Date | null) => {
        if (!date) return '';
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const timeString = date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });

        if (date.toDateString() === now.toDateString()) {
            return `Due today at ${timeString}`;
        } else if (date.toDateString() === tomorrow.toDateString()) {
            return `Due tomorrow at ${timeString}`;
        } else {
            return `Due ${date.toLocaleDateString()} at ${timeString}`;
        }
    };


    // Schedule a notification for a task
    const scheduleNotification = async (task: Task) => {
        if (!task.dueDate) return;

        try {
            // Calculate notification time (15 minutes before due date)
            const notificationTime = new Date(task.dueDate.getTime() - 15 * 60000);

            // Don't schedule if the time has already passed
            if (notificationTime <= new Date()) return;

            const notificationId = await Notifications.scheduleNotificationAsync({
                content: {
                    title: `Task Due Soon: ${task.title}`,
                    body: task.description,
                    data: { taskId: task.id },
                    sound: true,
                    priority: Notifications.AndroidNotificationPriority.HIGH,
                },
                trigger: {
                    date: notificationTime,
                },
            });

            return notificationId;
        } catch (error) {
            console.error('Error scheduling notification:', error);
            return undefined;
        }
    };

    // Cancel a scheduled notification
    const cancelNotification = async (notificationId?: string) => {
        if (notificationId) {
            try {
                await Notifications.cancelScheduledNotificationAsync(notificationId);
            } catch (error) {
                console.error('Error canceling notification:', error);
            }
        }
    };

    // Cleanup timeouts on unmount
    useEffect(() => {
        return () => {
            Object.values(deleteTimeouts.current).forEach(timeout => {
                clearTimeout(timeout);
            });
        };
    }, []);

    // Render individual task item
    const renderItem = ({ item }: { item: Task }) => {
        const animatedStyle = {
            opacity: item.completed ? 0.6 : 1,
        };

        return (
            <TouchableOpacity onPress={() => showTaskDetails(item)}>
                <Animated.View style={[styles.taskContainer, animatedStyle]}>
                    <View style={styles.taskContent}>
                        <View style={styles.iconContainer}>
                            <View style={styles.triangle} />
                            <View style={styles.square} />
                        </View>
                        <View style={styles.textContainer}>
                            <Text
                                numberOfLines={1}
                                ellipsizeMode="tail"
                                style={[
                                    styles.title,
                                    item.completed && styles.completedText
                                ]}
                            >
                                {item.title}
                            </Text>
                            <Text
                                numberOfLines={2}
                                ellipsizeMode="tail"
                                style={[
                                    styles.description,
                                    item.completed && styles.completedText
                                ]}
                            >
                                {item.description}
                            </Text>
                            {item.dueDate && (
                                <Text
                                    style={[
                                        styles.dueDate,
                                        item.completed && styles.completedText
                                    ]}
                                >
                                    {formatDueDate(item.dueDate)}
                                </Text>
                            )}
                        </View>
                        <CheckBox
                            checked={item.completed}
                            onPress={() => toggleTask(item.id)}
                        />
                    </View>
                    <View style={styles.separator} />
                </Animated.View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.mainContainer}>
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="dark-content" />
                {error && (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                )}
                <FlatList
                    data={tasks}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContainer}
                    refreshing={loading}
                    onRefresh={fetchTasks}
                />
            </SafeAreaView>
            <FAB onAddTask={handleAddTask} />

            {/* Modal for task details */}
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={closeModal}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>{selectedTask?.title}</Text>
                        <Text style={styles.modalDescription}>{selectedTask?.description}</Text>
                        {selectedTask?.dueDate && (
                            <Text style={styles.modalDueDate}>Due: {formatDueDate(selectedTask.dueDate)}</Text>
                        )}
                        <View style={styles.modalButtonContainer}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.deleteButton]}
                                onPress={() => {
                                    if (selectedTask) {
                                        deleteTask(selectedTask.id);
                                        closeModal();
                                    }
                                }}
                            >
                                <Text style={styles.deleteButtonText}>Delete</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.confirmButton]}
                                onPress={closeModal}
                            >
                                <Text style={styles.confirmButtonText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

// Add new styles
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        position: 'relative',
    },
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    listContainer: {
        flexGrow: 1,
        paddingBottom: 80,
    },
    taskContainer: {
        backgroundColor: '#f5f5f5',
    },
    taskContent: {
        flexDirection: 'row',
        padding: 16,
        alignItems: 'center',
    },
    iconContainer: {
        width: 40,
        height: 40,
        backgroundColor: '#e0e0e0',
        borderRadius: 20,
        marginRight: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    triangle: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 6,
        borderRightWidth: 6,
        borderBottomWidth: 12,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: '#909090',
        position: 'absolute',
        top: 8,
    },
    square: {
        width: 12,
        height: 12,
        backgroundColor: '#909090',
        position: 'absolute',
        bottom: 8,
    },
    textContainer: {
        flex: 1,
        marginRight: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 4,
        color: '#ff5733',
    },
    description: {
        fontSize: 14,
        color: '#666666',
        marginBottom: 4,
    },
    dueDate: {
        fontSize: 12,
        fontStyle: 'italic',
        color: '#888888',
    },
    completedText: {
        textDecorationLine: 'line-through',
        opacity: 0.6,
    },
    checkboxContainer: {
        marginLeft: 16,
        padding: 4,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#ff5733',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 2,
    },
    checkboxInner: {
        width: '100%',
        height: '100%',
        backgroundColor: '#ff5733',
        borderRadius: 8,
    },
    separator: {
        height: 1,
        backgroundColor: '#e0e0e0',
        marginLeft: 72,
    },
    modalBackground: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContainer: {
        width: "80%",
        backgroundColor: "#fff",
        borderRadius: 28,
        padding: 24,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "600",
        color: "#333",
        marginBottom: 8,
    },
    modalDescription: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
        marginBottom: 24,
    },
    modalDueDate: {
        fontSize: 14,
        fontStyle: 'italic',
        color: '#888',
        marginBottom: 20,
    },
    modalButtonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginTop: 16,
    },
    modalButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 20,
        marginHorizontal: 8,
        alignItems: "center",
    },
    deleteButton: {
        backgroundColor: "#E0E0E0",
    },
    deleteButtonText: {
        color: "#000",
        fontWeight: "500",
    },
    confirmButton: {
        backgroundColor: "#ff5733",
    },
    confirmButtonText: {
        color: "#fff",
        fontWeight: "500",
    },
    errorContainer: {
        backgroundColor: '#ffebee',
        padding: 8,
        margin: 8,
        borderRadius: 4,
    },
    errorText: {
        color: '#c62828',
        textAlign: 'center',
    },
});


export default Task;