import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SplashScreen from "expo-splash-screen";

const { width, height } = Dimensions.get('window');

const LandingScreen = ({ navigation }) => {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const logoMoveY = useRef(new Animated.Value(50)).current;
  const taglineFade = useRef(new Animated.Value(0)).current;
  const glowOpacity = useRef(new Animated.Value(0.4)).current;
  const ripple1 = useRef(new Animated.Value(0.6)).current;
  const ripple2 = useRef(new Animated.Value(0.6)).current;
  const ripple3 = useRef(new Animated.Value(0.6)).current;
  
  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
  }, []);
  
  useEffect(() => {
    const prepare = async () => {
      try {
        // Delay hiding splash screen
        setTimeout(async () => {
          await SplashScreen.hideAsync();
        }, 500);
        
        // Create pulsing glow animation that repeats
        Animated.loop(
          Animated.sequence([
            Animated.timing(glowOpacity, {
              toValue: 0.8,
              duration: 1500,
              useNativeDriver: true,
            }),
            Animated.timing(glowOpacity, {
              toValue: 0.4,
              duration: 1500,
              useNativeDriver: true,
            }),
          ])
        ).start();
        
        // Create expanding ripple animations that repeat
        Animated.loop(
          Animated.sequence([
            Animated.timing(ripple1, {
              toValue: 1.2,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(ripple1, {
              toValue: 0.6,
              duration: 2000,
              useNativeDriver: true,
            }),
          ])
        ).start();
        
        setTimeout(() => {
          Animated.loop(
            Animated.sequence([
              Animated.timing(ripple2, {
                toValue: 1.2,
                duration: 2000,
                useNativeDriver: true,
              }),
              Animated.timing(ripple2, {
                toValue: 0.6,
                duration: 2000,
                useNativeDriver: true,
              }),
            ])
          ).start();
        }, 700);
        
        setTimeout(() => {
          Animated.loop(
            Animated.sequence([
              Animated.timing(ripple3, {
                toValue: 1.2,
                duration: 2000,
                useNativeDriver: true,
              }),
              Animated.timing(ripple3, {
                toValue: 0.6,
                duration: 2000,
                useNativeDriver: true,
              }),
            ])
          ).start();
        }, 1400);
        
        // Main content animations
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.spring(logoMoveY, {
            toValue: 0,
            friction: 6,
            tension: 40,
            useNativeDriver: true,
          }),
          Animated.timing(taglineFade, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ]).start();
        
        // Increased waiting time - now 5 seconds
        const timer = setTimeout(async () => {
          const authToken = await AsyncStorage.getItem("authToken");
          navigation.replace(authToken ? "Home" : "Welcome");
          await SplashScreen.hideAsync();
        }, 5000);
        
        return () => clearTimeout(timer);
      } catch (error) {
        console.error("Error during splash preparation:", error);
        navigation.replace("Welcome");
        await SplashScreen.hideAsync();
      }
    };
    
    prepare();
  }, [navigation, fadeAnim, logoMoveY, taglineFade, glowOpacity, ripple1, ripple2, ripple3]);
  
  return (
    <View style={styles.container}>
      {/* Background gradient overlay */}
      <View style={styles.gradientOverlay} />
      
      {/* Animated ripple effects */}
      <Animated.View 
        style={[
          styles.ripple, 
          { transform: [{ scale: ripple1 }], opacity: glowOpacity }
        ]}
      />
      <Animated.View 
        style={[
          styles.ripple, 
          { transform: [{ scale: ripple2 }], opacity: glowOpacity }
        ]}
      />
      <Animated.View 
        style={[
          styles.ripple, 
          { transform: [{ scale: ripple3 }], opacity: glowOpacity }
        ]}
      />
      
      {/* Main content container */}
      <View style={styles.content}>
        {/* Logo with glow effect */}
        <Animated.View 
          style={[
            styles.logoWrapper,
            {
              opacity: fadeAnim,
              transform: [{ translateY: logoMoveY }]
            }
          ]}
        >
          {/* Glow background */}
          <Animated.View 
            style={[
              styles.logoGlow,
              { opacity: glowOpacity }
            ]} 
          />
          
          {/* Logo circle */}
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>O</Text>
          </View>
        </Animated.View>
        
        {/* Brand name */}
        <Animated.Text 
          style={[
            styles.brandName,
            {
              opacity: fadeAnim,
              transform: [{ translateY: logoMoveY }]
            }
          ]}
        >
          OPALEKA
        </Animated.Text>
        
   
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0C0032", // Rich deep purple
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  gradientOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
    borderWidth: 0,
    borderRadius: 0,
    borderColor: "transparent",
    
    // This creates a subtle vignette effect
    borderTopWidth: height * 0.3,
    borderBottomWidth: height * 0.3,
    borderTopColor: "rgba(12, 0, 50, 0.7)",
    borderBottomColor: "rgba(12, 0, 50, 0.7)",
  },
  ripple: {
    position: "absolute",
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#5643fd",
  },
  content: {
    alignItems: "center",
  },
  logoWrapper: {
    width: 160,
    height: 160,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  logoGlow: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "#5643fd",
    opacity: 0.6,
  },
  logoCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#190061", // Darker purple
    borderWidth: 4,
    borderColor: "#7d67ff", // Bright purple
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    fontSize: 100,
    fontWeight: "900",
    color: "#ffffff",
    includeFontPadding: false,
    textAlign: "center",
    textAlignVertical: "center",
    lineHeight: 120,
  },
  brandName: {
    fontSize: 44,
    fontWeight: "800",
    letterSpacing: 5,
    color: "#ffffff",
    marginBottom: 16,
  },
  tagline: {
    fontSize: 18,
    fontWeight: "500",
    color: "#a68eff", // Light purple
    letterSpacing: 2,
  },
});

export default LandingScreen;