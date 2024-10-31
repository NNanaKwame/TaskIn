import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const CarouselHero: React.FC = () => {
  return (
    <View style={styles.carouselHero}>
      <View style={styles.carousel}>
        <Image
          source={{
            uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/99ba4a45e16db772d8a6d597abd9e9c15f00924be4dbd507c8ed434674c177ae?placeholderIfAbsent=true&apiKey=1d7b459d4c7e4fba8311362669096c23",
          }}
          style={styles.mainImage}
          resizeMode="contain"
        />
        <Image
          source={{
            uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/c11c63e2d20e0816ac45637f919a2f91c24f5fccf72d903274d887da023d19f9?placeholderIfAbsent=true&apiKey=1d7b459d4c7e4fba8311362669096c23",
          }}
          style={styles.thumbnailImage}
          resizeMode="contain"
        />
      </View>
      <View style={styles.action}>
        <View style={styles.button}>
          <View style={styles.stateLayer}>
            <Text style={styles.buttonText}>Show all</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  carouselHero: {
    flexDirection: "column",
    width: "100%",
  },
  carousel: {
    flexDirection: "row",
    overflow: "hidden",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    width: "100%",
    minHeight: 221,
  },
  mainImage: {
    flex: 1,
    width: "100%",
    borderRadius: 24,
    minWidth: 240,
    aspectRatio: 1.54,
  },
  thumbnailImage: {
    width: 56,
    height: 56,
    borderRadius: 24,
    aspectRatio: 0.27,
  },
  action: {
    flexDirection: "column",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    width: "100%",
    textAlign: "center",
    fontSize: 14,
    fontWeight: "500",
    color: "#64748b",
  },
  button: {
    flexDirection: "column",
    justifyContent: "center",
    minHeight: 40,
    borderRadius: 50,
    width: 77,
  },
  stateLayer: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748b",
    textAlign: "center",
  },
});

export default CarouselHero;
