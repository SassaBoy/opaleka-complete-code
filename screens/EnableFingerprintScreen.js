import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import * as LocalAuthentication from "expo-local-authentication";

const EnableFingerprintScreen = ({ navigation }) => {
  const [isFingerprintEnabled, setIsFingerprintEnabled] = useState(false);

  const enableFingerprint = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    if (!hasHardware) {
      Alert.alert("Error", "Your device does not support biometric authentication.");
      return;
    }

    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    if (!isEnrolled) {
      Alert.alert("Error", "No biometrics are enrolled on your device.");
      return;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Enable Fingerprint Login",
      cancelLabel: "Cancel",
    });

    if (result.success) {
      setIsFingerprintEnabled(true);
      Alert.alert("Success", "Fingerprint login has been enabled!");
      navigation.navigate("Home"); // Navigate to the home page or dashboard
    } else {
      Alert.alert("Error", "Authentication failed. Try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isFingerprintEnabled
          ? "Fingerprint Login is Enabled"
          : "Enable Fingerprint Login"}
      </Text>
      {!isFingerprintEnabled && (
        <TouchableOpacity style={styles.button} onPress={enableFingerprint}>
          <Text style={styles.buttonText}>Enable Fingerprint Login</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#00AEEF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default EnableFingerprintScreen;
