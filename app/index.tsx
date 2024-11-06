import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import StatusBar from "./TaskManager/StatusBar";
import TopAppBar from "./TaskManager/TopAppBar";
import CarouselHero from "./TaskManager/CarouselHero";
import TaskList from "./TaskManager/TaskList";
import GestureBar from "./TaskManager/GestureBar";

const TaskManager: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <StatusBar />
      <TopAppBar />
      <CarouselHero />
      <TaskList />
      <GestureBar />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffff", // Fuchsia-50 color
  },
});

export default TaskManager;
