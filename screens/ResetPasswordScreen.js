import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from "react-native";
import Toast from "react-native-toast-message";
import axios from "axios";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const ResetPasswordScreen = ({ route, navigation }) => {
  const { email, role, otpExpiresIn } = route.params;
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(otpExpiresIn || 600);
  const [resending, setResending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
  };

  const validatePassword = (password) => {
    const errors = {};
    if (password.length < 8) {
      errors.length = "Password must be at least 8 characters.";
    }
    if (!/[A-Z]/.test(password)) {
      errors.uppercase = "Password must contain at least one uppercase letter.";
    }
    if (!/[0-9]/.test(password)) {
      errors.number = "Password must contain at least one number.";
    }
    return errors;
  };

  const handleResetPassword = async () => {
    const newErrors = {};

    if (!otp) {
      newErrors.otp = "OTP is required.";
    }
    if (!newPassword) {
      newErrors.newPassword = "Password is required.";
    } else {
      const passwordErrors = validatePassword(newPassword);
      if (Object.keys(passwordErrors).length > 0) {
        newErrors.newPassword = Object.values(passwordErrors).join(" ");
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setError(newErrors);
      return;
    }

    setError({});
    setLoading(true);

    try {
      const response = await axios.post("https://service-booking-backend-eb9i.onrender.com/api/auth/reset-password", {
        email,
        otp,
        newPassword,
      });

      Toast.show({
        type: "success",
        text1: "Success",
        text2: response.data.message,
      });

      navigation.reset({
        index: 0,
        routes: [{ name: "Login", params: { role } }],
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to reset password. Please try again.";
      Toast.show({
        type: "error",
        text1: "Error",
        text2: errorMessage,
      });
      setError({ general: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResending(true);
    try {
      const response = await axios.post("http://192.168.8.138:5001/api/auth/forgot-password", { email });
      setTimeLeft(600);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "A new OTP has been sent to your email.",
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to resend OTP. Please try again.";
      Toast.show({
        type: "error",
        text1: "Error",
        text2: errorMessage,
      });
    } finally {
      setResending(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Toast />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>Enter the OTP sent to your email and create a new password</Text>
        </View>

        <View style={styles.timerContainer}>
          {timeLeft > 0 ? (
            <Text style={styles.timer}>
              <Icon name="clock-outline" size={16} color="#4A5568" /> {' '}
              Expires in: <Text style={styles.timerHighlight}>{formatTime(timeLeft)}</Text>
            </Text>
          ) : (
            <TouchableOpacity
              style={[styles.resendButton, resending && styles.disabledButton]}
              onPress={handleResendOTP}
              disabled={resending}
            >
              <Icon name="email-sync" size={18} color="#1a237e" />
              <Text style={styles.resendButtonText}>{resending ? " Resending..." : " Resend OTP"}</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Verification Code</Text>
            <View style={styles.inputWrapper}>
              <Icon name="shield-key" size={20} color="#718096" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter 6-digit OTP"
                placeholderTextColor="#A0AEC0"
                value={otp}
                onChangeText={(text) => {
                  setOtp(text);
                  setError((prev) => ({ ...prev, otp: "" }));
                }}
                keyboardType="number-pad"
                autoCapitalize="none"
                maxLength={6}
              />
            </View>
            {error.otp && <Text style={styles.errorText}>{error.otp}</Text>}
          </View>

          <View style={styles.inputContainer}>
  <Text style={styles.inputLabel}>New Password</Text>
  <View style={styles.inputWrapper}>
    <Icon name="lock-outline" size={20} color="#718096" style={styles.inputIcon} />
    <TextInput
      style={[styles.input, { paddingRight: 50 }]}
      placeholder="Enter new password"
      placeholderTextColor="#A0AEC0"
      value={newPassword}
      onChangeText={(text) => {
        setNewPassword(text);
        setError((prev) => ({ ...prev, newPassword: "" }));
      }}
      secureTextEntry={!showPassword}  // Corrected logic
      autoCapitalize="none"
    />
    <TouchableOpacity
      style={styles.eyeIcon}
      onPress={() => setShowPassword(!showPassword)}
    >
      <Icon
        name={showPassword ? "eye-outline" : "eye-off-outline"}  // Fixed icon names
        size={22}
        color="#718096"
      />
    </TouchableOpacity>
  </View>
  {error.newPassword && <Text style={styles.errorText}>{error.newPassword}</Text>}
</View>

          {error.general && <Text style={styles.errorText}>{error.general}</Text>}

          <TouchableOpacity
            style={[styles.button, loading && styles.disabledButton]}
            onPress={handleResetPassword}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Icon name="lock-reset" size={20} color="#FFFFFF" />
                <Text style={styles.buttonText}> Reset Password</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
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
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'Roboto',
    fontWeight: "700",
    color: "#1a237e",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#718096",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 24,
  },
  timerContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  timer: {
    fontSize: 15,
    color: "#4A5568",
    fontWeight: "500",
    alignItems: "center",
  },
  timerHighlight: {
    color: "#1a237e",
    fontWeight: "700",
  },
  formContainer: {
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    color: "#1A202C",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    marginLeft: 8,
  },
  inputWrapper: {
    position: "relative",
  },
  inputIcon: {
    position: "absolute",
    left: 16,
    top: 16,
    zIndex: 1,
  },
  eyeIcon: {
    position: "absolute",
    right: 16,
    top: 14,
    padding: 8,
  },
  input: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
    paddingLeft: 48,
    fontSize: 16,
    color: "#1A202C",
    height: 56,
    elevation: 2,
    shadowColor: "#1A202C",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    backgroundColor: "#1a237e",
    height: 56,
    borderRadius: 12,
    marginTop: 32,
    elevation: 4,
    shadowColor: "#1a237e",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  resendButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8EAF6",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  resendButtonText: {
    color: "#1a237e",
    fontSize: 14,
    fontWeight: "600",
  },
  disabledButton: {
    backgroundColor: "#C5CAE9",
    opacity: 0.7,
  },
  errorText: {
    color: "#E53E3E",
    fontSize: 13,
    marginTop: 4,
    marginLeft: 8,
    fontWeight: "500",
  },
});

export default ResetPasswordScreen;