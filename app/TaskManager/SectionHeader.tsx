
import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const SectionHeader: React.FC = () => {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.title}>
        <Text style={styles.titleText}>Tasks</Text>
      </View>
      <View style={styles.iconButton}>
        <View style={styles.container}>
          <View style={styles.stateLayer}>
            <Image
              source={{
                uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/d85cc389d575d1c745432ced908ae74c42a36354e058c8c03f0993604723707f?placeholderIfAbsent=true&apiKey=1d7b459d4c7e4fba8311362669096c23",
              }}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    backgroundColor: "#f5f5f5",
    width: "100%",
    minHeight: 48,
    zIndex: 0,
  },
  title: {
    flex: 1,
    justifyContent: "center",
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
    color: "#3A3A3A",
  },
  iconButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 48,
    minHeight: 48,
  },
  container: {
    overflow: "hidden",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    maxWidth: 40,
    borderRadius: 100,
  },
  stateLayer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
    width: 40,
  },
  image: {
    width: 24,
    height: 24,
  },
});

export default SectionHeader;
