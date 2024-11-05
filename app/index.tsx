import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import StatusBar from "./TaskManager/StatusBar";
import TopAppBar from "./TaskManager/TopAppBar";
import CarouselHero from "./TaskManager/CarouselHero";
import SectionHeader from "./TaskManager/SectionHeader";
import TaskList from "./TaskManager/TaskList";
import GestureBar from "./TaskManager/GestureBar";
import FAB from "./TaskManager/FAB";

const TaskManager: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <StatusBar />
      <TopAppBar />
      <CarouselHero />
      <SectionHeader />
      <TaskList />
      <GestureBar />
      <FAB />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffff", // Fuchsia-50 color
  },
});

export default TaskManager;
