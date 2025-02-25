import React, { useEffect, useRef } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
} from "react-native";

const { width } = Dimensions.get("window");

const ThankYou1Screen = ({ navigation }) => {
  // Animation references
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const checkmarkAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(checkmarkAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Redirect to Home after 10 seconds
    const timer = setTimeout(() => {
      navigation.navigate("Home");
    }, 5000);

    return () => clearTimeout(timer); // Cleanup on unmount
  }, [navigation]);

  const checkmarkScale = checkmarkAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 1.2, 1],
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a237e" />
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.card}>
          <Animated.View
            style={[
              styles.iconContainer,
              {
                transform: [{ scale: checkmarkScale }],
              },
            ]}
          >
            <View style={styles.checkmarkCircle}>
              <Text style={styles.checkmark}>✓</Text>
            </View>
          </Animated.View>

          <Text style={styles.title}>Application Submitted!</Text>
          <View style={styles.divider} />
          <Text style={styles.subtitle}>
            Your application has been successfully submitted and is now under review.
          </Text>

          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              • Our team is reviewing your application.
            </Text>
            <Text style={styles.infoText}>
              • You will receive an email once your application is processed.
            </Text>
            <Text style={styles.infoText}>
              • This usually takes 24 hours.
            </Text>
          </View>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#1a237e",
  },
  content: {
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 24,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  iconContainer: {
    marginBottom: 24,
  },
  checkmarkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#1a237e",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#1a237e",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  checkmark: {
    color: "#ffffff",
    fontSize: 40,
    fontWeight: "bold",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1a237e",
    marginBottom: 16,
    textAlign: "center",
  },
  divider: {
    height: 1,
    width: "80%",
    backgroundColor: "#E0E0E0",
    marginVertical: 16,
  },
  subtitle: {
    fontSize: 16,
    color: "#424242",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 24,
  },
  infoContainer: {
    width: "100%",
    backgroundColor: "#F5F6FA",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  infoText: {
    fontSize: 14,
    color: "#616161",
    marginBottom: 8,
    lineHeight: 20,
  },
});

export default ThankYou1Screen;
