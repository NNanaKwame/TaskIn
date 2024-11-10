import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import notifee, { 
  TimestampTrigger, 
  TriggerType, 
  AndroidImportance 
} from '@notifee/react-native';
import FAB from "./FAB"; // FAB component for adding tasks

// Define the Task interface
interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate: Date | null;
  notificationId?: string;
}

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    // Initialize the Notifee notification channel
    async function createNotificationChannel() {
      await notifee.createChannel({
        id: 'tasks',
        name: 'Task Notifications',
        importance: AndroidImportance.HIGH,
      });
    }
    createNotificationChannel();

    // Sample tasks for testing
    const initializeTasks = [
      {
        id: '1',
        title: 'Sample Task 1',
        description: 'Description for Task 1.',
        completed: false,
        dueDate: new Date(Date.now() + 60 * 1000), // 1 minute from now
      },
    ];
    setTasks(initializeTasks);
    initializeTasks.forEach(task => scheduleNotification(task));
  }, []);

  // Function to schedule notifications
  const scheduleNotification = async (task: Task) => {
    if (task.dueDate && task.dueDate > new Date()) {
      const trigger: TimestampTrigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: task.dueDate.getTime(),
      };

      const notificationId = await notifee.createTriggerNotification(
        {
          title: `Task Due: ${task.title}`,
          body: `Don't forget to complete: ${task.description}`,
          android: {
            channelId: 'tasks',
            importance: AndroidImportance.HIGH,
          },
        },
        trigger
      );

      setTasks(prevTasks => 
        prevTasks.map(t => (t.id === task.id ? { ...t, notificationId } : t))
      );
    }
  };

  // Handle adding a new task with a scheduled notification
  const handleAddTask = (newTask: { title: string; description: string; dueDate: Date | null; }) => {
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      dueDate: newTask.dueDate,
      completed: false,
    };
    setTasks(prevTasks => [...prevTasks, task]);
    scheduleNotification(task);
  };

  // Mark task as completed and cancel notification if it exists
  const handleTaskCompletion = async (task: Task) => {
    if (task.notificationId) {
      await notifee.cancelNotification(task.notificationId);
    }
    setTasks(prevTasks => 
      prevTasks.map(t => (t.id === task.id ? { ...t, completed: true } : t))
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <FlatList
        data={tasks}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleTaskCompletion(item)}
            style={[styles.taskContainer, item.completed && styles.completedTask]}
          >
            <Text style={styles.taskTitle}>{item.title}</Text>
            <Text style={styles.taskDescription}>{item.description}</Text>
            {item.dueDate && (
              <Text style={styles.taskDueDate}>
                Due: {item.dueDate.toLocaleString()}
              </Text>
            )}
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
      />
      <FAB onAddTask={handleAddTask} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  taskContainer: {
    padding: 15,
    margin: 10,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  completedTask: {
    backgroundColor: '#e0e0e0',
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  taskDescription: {
    fontSize: 16,
    color: '#666',
  },
  taskDueDate: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
});

export default TaskList;
