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
} from 'react-native';
import FAB from "./FAB";

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

interface TimeoutRefs {
  [key: string]: NodeJS.Timeout;
}

interface CheckBoxProps {
  checked: boolean;
  onPress: () => void;
}

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

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'List item',
      description: 'Supporting line text lorem ipsum dolor sit amet, consectetur.',
      completed: false,
    },
    {
      id: '2',
      title: 'List item',
      description: 'Supporting line text lorem ipsum dolor sit amet, consectetur.',
      completed: false,
    },
    {
      id: '3',
      title: 'List item',
      description: 'Supporting line text lorem ipsum dolor sit amet, consectetur.',
      completed: false,
    },
    {
      id: '4',
      title: 'List item',
      description: 'Supporting line text lorem ipsum dolor sit amet, consectetur.',
      completed: false,
    },
    {
      id: '5',
      title: 'List item',
      description: 'Supporting line text lorem ipsum dolor sit amet, consectetur.',
      completed: false,
    },
  ]);

  const handleAddTask = (newTask: { title: string; description: string }) => {
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      completed: false,
    };
    setTasks(currentTasks => [...currentTasks, task]);
  };

  const deleteTimeouts = useRef<TimeoutRefs>({});

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === id) {
          const newCompleted = !task.completed;
          
          // Clear existing timeout if any
          if (deleteTimeouts.current[id]) {
            clearTimeout(deleteTimeouts.current[id]);
          }

          // Set new timeout if task is completed
          if (newCompleted) {
            deleteTimeouts.current[id] = setTimeout(() => {
              setTasks((currentTasks) => 
                currentTasks.filter((t) => t.id !== id)
              );
              delete deleteTimeouts.current[id];
            }, 3000); // 30 seconds = 30000
          }

          return { ...task, completed: newCompleted };
        }
        return task;
      })
    );
  };

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      Object.values(deleteTimeouts.current).forEach(timeout => {
        clearTimeout(timeout);
      });
    };
  }, []);

  // const ListHeader = () => (
  //   <Text style={styles.header}>Tasks</Text>
  // );

  const renderItem = ({ item }: { item: Task }) => {
    const animatedStyle = {
      opacity: item.completed ? 0.6 : 1,
    };

    return (
      <Animated.View style={[styles.taskContainer, animatedStyle]}>
        <View style={styles.taskContent}>
          <View style={styles.iconContainer}>
            <View style={styles.triangle} />
            <View style={styles.square} />
          </View>
          <View style={styles.textContainer}>
            <Text style={[
              styles.title,
              item.completed && styles.completedText
            ]}>
              {item.title}
            </Text>
            <Text style={[
              styles.description,
              item.completed && styles.completedText
            ]}>
              {item.description}
            </Text>
          </View>
          <CheckBox
            checked={item.completed}
            onPress={() => toggleTask(item.id)}
          />
        </View>
        <View style={styles.separator} />
      </Animated.View>
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
          // ListHeaderComponent={ListHeader}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      </SafeAreaView>
      <FAB onAddTask={handleAddTask} />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    position: 'relative', // Ensures proper stacking context
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
    color: "#232F34",
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
});

export default TaskList;