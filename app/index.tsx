import React from "react";
import { View, StyleSheet } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import TopAppBar from "./TaskManager/TopAppBar";
import CarouselHero from "./TaskManager/CarouselHero";
import TaskList from "./TaskManager/TaskList";
import GestureBar from "./TaskManager/GestureBar";
import SectionHeader from "./TaskManager/SectionHeader";

const TaskManager: React.FC = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <TopAppBar />
        <CarouselHero />
        <SectionHeader />
        <View style={styles.taskListContainer}>
          <TaskList />
        </View>
        <GestureBar />
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5", // Fuchsia-50 color
  },
  taskListContainer: {
    flex: 1, // This will make the TaskList take up all available space
  },
});

export default TaskManager;