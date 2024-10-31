import React from "react";
import { View, StyleSheet } from "react-native";
import TaskItem from "./TaskItem";

const taskData = [
  {
    id: 1,
    image:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/b19d4fe6175b8438089dba53dda9a44cadbd8aa00714d3c2cb512fe2df5049ca?placeholderIfAbsent=true&apiKey=1d7b459d4c7e4fba8311362669096c23",
  },
  {
    id: 2,
    image:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/b19d4fe6175b8438089dba53dda9a44cadbd8aa00714d3c2cb512fe2df5049ca?placeholderIfAbsent=true&apiKey=1d7b459d4c7e4fba8311362669096c23",
  },
  {
    id: 3,
    image:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/b19d4fe6175b8438089dba53dda9a44cadbd8aa00714d3c2cb512fe2df5049ca?placeholderIfAbsent=true&apiKey=1d7b459d4c7e4fba8311362669096c23",
  },
  {
    id: 4,
    image:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/d2a6fd98911f4ea73f88386471410563161d9a2d0303774a6bbc315335c156d2?placeholderIfAbsent=true&apiKey=1d7b459d4c7e4fba8311362669096c23",
  },
  {
    id: 5,
    image:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/d0e37ba2ded065a03333b7687016dd51c35b3ac8450d1bc94a72eadb783deb98?placeholderIfAbsent=true&apiKey=1d7b459d4c7e4fba8311362669096c23",
  },
];

const TaskList: React.FC = () => {
  return (
    <View style={styles.list}>
      {taskData.map((task) => (
        <TaskItem key={task.id} image={task.image} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    flexDirection: "column",
    paddingBottom: 16,
    width: "100%",
  },
});

export default TaskList;
