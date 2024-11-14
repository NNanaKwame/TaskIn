import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { ScrollView } from 'react-native-gesture-handler';

interface Task {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    due_date: string;
}

const Task: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTask, setNewTask] = useState({ title: '', description: '', due_date: '' });

    // Fetch all tasks
    const fetchTasks = async () => {
        try {
            const response = await axios.get('http://10.0.2.2:5000/tasks'); // Replace with your backend URL
            setTasks(response.data);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    // Add a new task
    const addTask = async () => {
        try {
            await axios.post('http://10.0.2.2:5000/tasks', newTask); // Replace with your backend URL
            setNewTask({ title: '', description: '', due_date: '' }); // Reset form
            fetchTasks(); // Refresh task list
        } catch (error) {
            console.error("Error adding task:", error);
        }
    };

    // Mark task as completed
    const completeTask = async (id: number) => {
        try {
            await axios.put(`http://10.0.2.2:5000/tasks/${id}/complete`); // Replace with your backend URL
            fetchTasks(); // Refresh task list
        } catch (error) {
            console.error("Error completing task:", error);
        }
    };

    // Delete a task
    const deleteTask = async (id: number) => {
        try {
            await axios.delete(`http://10.0.2.2:5000/tasks/${id}`); // Replace with your backend URL
            fetchTasks(); // Refresh task list
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    // Run fetchTasks on component mount
    useEffect(() => {
        fetchTasks();
    }, []);

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Task List</Text>

            {/* Form to Add New Task */}
            <View style={styles.form}>
                <TextInput
                    style={styles.input}
                    placeholder="Task Title"
                    value={newTask.title}
                    onChangeText={(text) => setNewTask({ ...newTask, title: text })}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Task Description"
                    value={newTask.description}
                    onChangeText={(text) => setNewTask({ ...newTask, description: text })}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Due Date (YYYY-MM-DD)"
                    value={newTask.due_date}
                    onChangeText={(text) => setNewTask({ ...newTask, due_date: text })}
                />
                <Button title="Add Task" onPress={addTask} />
            </View>

            {/* Display List of Tasks */}
            <FlatList
                data={tasks}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.taskItem}>
                        <Text style={styles.taskTitle}>{item.title}</Text>
                        <Text>{item.description}</Text>
                        <Text>Due: {item.due_date}</Text>
                        {/* <Text>Status: {item.completed ? "Completed" : "Not Completed"}</Text> */}

                        {/* <TouchableOpacity
                            style={styles.completeButton}
                            onPress={() => completeTask(item.id)}
                            disabled={item.completed}
                        >
                            <Text style={styles.buttonText}>{item.completed ? "Completed" : "Mark as Completed"}</Text>
                        </TouchableOpacity> */}

                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() => deleteTask(item.id)}
                        >
                            <Text style={styles.buttonText}>Delete Task</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    form: {
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    taskItem: {
        padding: 15,
        backgroundColor: '#fff',
        marginBottom: 10,
        borderRadius: 5,
    },
    taskTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    completeButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    deleteButton: {
        backgroundColor: '#f44336',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
    },
});

export default Task;
