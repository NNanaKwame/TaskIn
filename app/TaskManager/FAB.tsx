import React from "react";
import { View, Image, StyleSheet } from "react-native";

const FAB: React.FC = () => {
  return (
    <View style={styles.fab}>
      <View style={styles.stateLayer}>
        <Image
          source={{
            uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/08f3305b7b1f335d9bc0262e030868090d4b4378edb50db2d9fc9fdbed196fe4?placeholderIfAbsent=true&apiKey=1d7b459d4c7e4fba8311362669096c23",
          }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 40,
    bottom: 44,
    zIndex: 0,
    justifyContent: "center",
    alignItems: "flex-end",
    width: 56,
    height: 56,
    backgroundColor: "#e5e7eb",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  stateLayer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    width: 56,
  },
  image: {
    width: 24,
    height: 24,
  },
});

export default FAB;
