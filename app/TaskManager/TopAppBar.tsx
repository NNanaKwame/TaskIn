import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const TopAppBar: React.FC = () => {
  return (
    <View style={styles.topAppBar}>
      <View style={styles.leadingTrailingIcons}>
        <View style={styles.welcomeText}>
          <Text>Welcome, Gideon</Text>
        </View>
        <Image
          source={{
            uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/e15a1f6732fb9ae045f236ac74067b608dc4d6c84cb2ea2c34457fd06e645b5d?placeholderIfAbsent=true&apiKey=1d7b459d4c7e4fba8311362669096c23",
          }}
          style={styles.image}
        />
      </View>
      <View style={styles.headline}>
        <Text>Task Highlights</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topAppBar: {
    flexDirection: "column",
    paddingBottom: 24, // Equivalent to `pb-6`
    width: "100%",
    backgroundColor: "#FFFF", // Fuchsia-50 color
  },
  leadingTrailingIcons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingTop: 8,  // Equivalent to `pt-2`
    paddingRight: 4, // Equivalent to `pr-1`
    paddingLeft: 16, // Equivalent to `pl-4`
    width: "100%",
    fontSize: 24, // Equivalent to `text-2xl`
    color: "#000", // Black color
  },
  welcomeText: {
    flex: 1,
    paddingVertical: 8, // Equivalent to `py-2`
    width: 186,
  },
  image: {
    width: 96, // Equivalent to `w-24`
    aspectRatio: 2, // Maintains the aspect ratio
    resizeMode: "contain", // Equivalent to `object-contain`
  },
  headline: {
    marginTop: 32, // Equivalent to `mt-8`
    paddingHorizontal: 16, // Equivalent to `px-4`
    width: "100%",
    fontSize: 24, // Equivalent to `text-3xl`
    color: "#3A3A3A", // Zinc-900 color
  },
});

export default TopAppBar;
