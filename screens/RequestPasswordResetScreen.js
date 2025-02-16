import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Toast from "react-native-toast-message";
import axios from "axios";

const RequestPasswordResetScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRequestReset = async () => {
    setError(""); // Clear previous error

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("https://service-booking-backend-eb9i.onrender.com/api/auth/forgot-password", { email });

      // Show success toast
      Toast.show({
        type: "success",
        text1: "Success",
        text2: response.data.message,
      });

      // Navigate to Reset Password screen with email and role
      navigation.navigate("ResetPassword", { email, role: response.data.role });
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to send OTP. Please try again.";

      // Show error toast
      Toast.show({
        type: "error",
        text1: "Error",
        text2: errorMessage,
      });

      // Set the error below the field
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Toast />
      <View style={styles.content}>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>Enter your email to receive an OTP.</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setError(""); // Clear error as the user types
            }}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.button, loading && styles.disabledButton]}
          onPress={handleRequestReset}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? "Sending..." : "Send OTP"}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#F9FAFB",
      paddingHorizontal: 24,
    },
    content: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: -50,
    },
    title: {
      fontSize: 32,
      fontWeight: "800",
      color: "#1A2C4B",
      marginBottom: 12,
      letterSpacing: 0.5,
    },
    subtitle: {
      fontSize: 16,
      color: "#64748B",
      marginBottom: 32,
      textAlign: "center",
      lineHeight: 24,
      maxWidth: "80%",
    },
    inputContainer: {
      width: "100%",
      marginBottom: 20,
    },
    input: {
      width: "100%",
      backgroundColor: "#FFFFFF",
      borderRadius: 12,
      borderWidth: 1,
      borderColor: "#E2E8F0",
      padding: 16,
      fontSize: 16,
      color: "#1A2C4B",
      height: 56,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 2,
    },
    button: {
      width: "100%",
      backgroundColor: "#1a237e",
      height: 56,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 24,
      shadowColor: "#00AEEF",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
    buttonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "700",
      letterSpacing: 0.5,
    },
    disabledButton: {
      backgroundColor: "#9fa8da",
    },
    errorText: {
      color: "#EF4444",
      fontSize: 14,
      marginTop: 8,
      marginLeft: 4,
      fontWeight: "500",
    },
  });

export default RequestPasswordResetScreen;
