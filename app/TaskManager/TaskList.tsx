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
  Button,
} from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import FAB from "./FAB";

// Configure notifications behavior globally
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

// Main TaskList Component
const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
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

  // Add a new task
  const handleAddTask = async (newTask: {
    title: string;
    description: string;
    dueDate: Date | null;
  }) => {
    try {
      const task: Task = {
        id: Date.now().toString(),
        title: newTask.title,
        description: newTask.description,
        dueDate: newTask.dueDate,
        completed: false,
      };

      if (task.dueDate) {
        task.notificationId = await scheduleNotification(task);
      }

      setTasks(currentTasks => [...currentTasks, task]);
    } catch (error) {
      console.error('Error adding task:', error);
      Alert.alert('Error', 'Failed to add task. Please try again.');
    }
  };

  const deleteTask = (id: string) => {
    setTasks(currentTasks => currentTasks.filter(task => task.id !== id));
    // Cancel the notification if it exists
    const task = tasks.find(t => t.id === id);
    if (task && task.notificationId) {
      cancelNotification(task.notificationId);
    }
  };
  // Toggle task completion
  const toggleTask = async (id: string) => {
    try {
      setTasks(currentTasks =>
        currentTasks.map((task) => {
          if (task.id === id) {
            const newCompleted = !task.completed;

            // Cancel notification if task is completed
            if (newCompleted && task.notificationId) {
              cancelNotification(task.notificationId);
            }

            // Clear existing timeout if any
            if (deleteTimeouts.current[id]) {
              clearTimeout(deleteTimeouts.current[id]);
            }

            // Set new timeout if task is completed
            if (newCompleted) {
              deleteTimeouts.current[id] = setTimeout(() => {
                setTasks((tasks) => tasks.filter((t) => t.id !== id));
                delete deleteTimeouts.current[id];
              }, 3000);
            }

            return { ...task, completed: newCompleted };
          }
          return task;
        })
      );
    } catch (error) {
      console.error('Error toggling task:', error);
      Alert.alert('Error', 'Failed to update task. Please try again.');
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
        <FlatList
          data={tasks}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
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
});

export default TaskList;