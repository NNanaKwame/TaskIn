import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

interface TaskItemProps {
  image: string;
}

const TaskItem: React.FC<TaskItemProps> = ({ image }) => {
  return (
    <View style={styles.listItem}>
      <View style={styles.stateLayerOverlay} />
      <View style={styles.stateLayer}>
        <View style={styles.leadingElement}>
          <View style={styles.imageThumbnail}>
            <Image
              source={{ uri: image }}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
        </View>
        <View style={styles.content}>
          <View style={styles.headline}>
            <Text style={styles.headlineText}>List item</Text>
          </View>
          <View style={styles.supportingText}>
            <Text style={styles.supportingTextText}>
              Supporting line text lorem ipsum dolor sit amet, consectetur.
            </Text>
          </View>
        </View>
        <View style={styles.trailingElement}>
          <View style={styles.checkboxes}>
            <View style={styles.stateLayerButton}>
              <View style={styles.checkSmall} />
            </View>
          </View>
        </View>
      </View>
      <View style={styles.divider}>
        <View style={styles.dividerLine} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  listItem: {
    flexDirection: "column",
    width: "100%",
    backgroundColor: "#f5f5f5",
    minHeight: 88,
    position: "relative",
  },
  stateLayerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
    width: "100%",
    minHeight: 89,
  },
  stateLayer: {
    flexDirection: "row",
    gap: 16,
    alignItems: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: "100%",
  },
  leadingElement: {
    overflow: "hidden",
    flexDirection: "column",
    width: 56,
  },
  imageThumbnail: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
    width: 56,
  },
  image: {
    width: 56,
    height: 56,
    borderRadius: 16,
  },
  content: {
    overflow: "hidden",
    flexDirection: "column",
    flex: 1,
    minWidth: 240,
  },
  headline: {
    marginBottom: 4,
  },
  headlineText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#18181b",
  },
  supportingText: {
    marginTop: 4,
  },
  supportingTextText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#52525b",
  },
  trailingElement: {
    flexDirection: "row",
    alignItems: "flex-start",
    minHeight: 64,
  },
  checkboxes: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 4,
  },
  stateLayerButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderRadius: 100,
  },
  checkSmall: {
    width: 24,
    minHeight: 24,
  },
  divider: {
    justifyContent: "center",
    width: "100%",
    transform: [{ rotate: "0.0000000087rad" }],
  },
  dividerLine: {
    width: "100%",
    backgroundColor: "#d6d3d1",
    height: 1,
  },
});

export default TaskItem;
