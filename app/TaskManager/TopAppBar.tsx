import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const TopAppBar: React.FC = () => {
  return (
    <View style={styles.topAppBar}>
      <View style={styles.leadingTrailingIcons}>
        <View style={styles.welcomeTextContainer}>
          <Text style={styles.welcomeText}>Welcome, Gideon</Text>
        </View>
        <Image
          source={{
            uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/e15a1f6732fb9ae045f236ac74067b608dc4d6c84cb2ea2c34457fd06e645b5d?placeholderIfAbsent=true&apiKey=1d7b459d4c7e4fba8311362669096c23",
          }}
          style={styles.image}
        />
      </View>
      <View style={styles.headlineContainer}>
        <Text style={styles.headline}>Task Highlights</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topAppBar: {
    flexDirection: "column",
    paddingBottom: 24,
    width: "100%",
    backgroundColor: "#f5f5f5",
  },
  leadingTrailingIcons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingTop: 8,
    paddingRight: 4,
    paddingLeft: 16,
    width: "100%",
  },
  welcomeTextContainer: {
    flex: 1,
    paddingVertical: 8,
    width: 186,
  },
  welcomeText: {
    fontSize: 24, // Increased font size
    fontWeight: "500", // Medium font weight
    color: "#000",
  },
  image: {
    width: 96,
    aspectRatio: 2,
    resizeMode: "contain",
  },
  headlineContainer: {
    marginTop: 32,
    paddingHorizontal: 16,
    width: "100%",
    alignItems: "center", // Centers the text horizontally
  },
  headline: {
    fontSize: 26, // Increased font size
    fontWeight: "600", // Bold font weight
    color: "#3A3A3A",
    textAlign: "center", // Centers the text within the container
  },
});

export default TopAppBar;
