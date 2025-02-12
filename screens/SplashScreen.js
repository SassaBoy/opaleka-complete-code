import React, { useEffect } from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace("Home"); // Navigate after splash
    }, 3000); // Adjust delay as needed
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require("./assets/opalekalogo1-removebg.png")}
        style={styles.logo}
      />
      <Text style={styles.title}>Opaleka</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a237e",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 150, // Set custom width
    height: 150, // Set custom height
    resizeMode: "contain",
    fontSize: 64,
  },
  title: {
    fontSize: 24,
    color: "#fff",
    marginTop: 20,
  },
});

export default SplashScreen;
