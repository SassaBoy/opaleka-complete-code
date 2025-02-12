import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SplashScreen from "expo-splash-screen";

const LandingScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Fade-in animation
  const scaleAnim = useRef(new Animated.Value(0.5)).current; // Scaling animation

  useEffect(() => {
    const prepare = async () => {
      try {
        // Prevent the splash screen from auto-hiding
        await SplashScreen.preventAutoHideAsync();

        // Run fade-in and scaling animations simultaneously
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 2000, // 2 seconds fade-in effect
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 4, // Smooth bounce effect
            useNativeDriver: true,
          }),
        ]).start();

        // Simulate a 3-second delay, then check for authToken
        const timer = setTimeout(async () => {
          const authToken = await AsyncStorage.getItem("authToken"); // Check for token
          navigation.replace(authToken ? "Home" : "Welcome"); // Navigate accordingly
          await SplashScreen.hideAsync(); // Hide the splash screen after navigation
        }, 3000);

        return () => clearTimeout(timer); // Cleanup timer on unmount
      } catch (error) {
        console.error("Error during splash preparation:", error);
        navigation.replace("Welcome"); // Fallback to WelcomeScreen
        await SplashScreen.hideAsync(); // Ensure the splash screen is hidden
      }
    };

    prepare();
  }, [navigation, fadeAnim, scaleAnim]);

  return (
    <View style={styles.container}>
      <Animated.Text
        style={[
          styles.logoText,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }], // Combine fade and scale animations
          },
        ]}
      >
        Opaleka
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a237e", // Primary color background
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    fontSize: 64, // Larger for better visual impact
    fontWeight: "bold",
    color: "#ffffff", // White for contrast
    letterSpacing: 6, // Increased spacing for elegance
    textTransform: "uppercase", // Consistent branding
    textShadowColor: "rgba(0, 0, 0, 0.4)", // Subtle shadow for depth
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 5,
    fontStyle: "italic",
  },
});

export default LandingScreen;
