import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const StatusBar: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>9:30</Text>
      </View>
      <Image
        source={{
          uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/8c6fbff6eb7871fbda66d86c517469cd83b2e0a5582d38d4a6c9c8cbf87a9de0?placeholderIfAbsent=true&apiKey=1d7b459d4c7e4fba8311362669096c23",
        }}
        style={styles.icon}
      />
      <Image
        source={{
          uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/596f03ddd92a57478ccf57b7ecc89b6ccd056bf32196d03c1e64ce4229222e84?placeholderIfAbsent=true&apiKey=1d7b459d4c7e4fba8311362669096c23",
        }}
        style={styles.statusIcon}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 10,
    width: "100%",
    minHeight: 52,
    zIndex: 0,
    display: "none", // Hide on small screens
  },
  timeContainer: {
    zIndex: 0,
  },
  timeText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1F2937", // Zinc-900 color
  },
  icon: {
    width: 46,
    height: undefined,
    aspectRatio: 2.7,
    zIndex: 0,
  },
  statusIcon: {
    position: "absolute",
    bottom: 10,
    left: "50%",
    zIndex: 0,
    width: 24,
    height: 24,
    marginLeft: -12, // Half of width to center it
    aspectRatio: 1,
  },
});

export default StatusBar;
