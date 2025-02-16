import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import axios from "axios";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = ({ route, navigation }) => {
  const role = route?.params?.role || "User";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const redirectTo = route?.params?.redirectTo || "Home";
  const redirectParams = route?.params?.params || {};
  
  const handleLogin = async () => {
    setError({}); // Clear any previous errors
  
    if (!email) {
      setError((prev) => ({ ...prev, email: "Email is required." }));
      return;
    }
    if (!password) {
      setError((prev) => ({ ...prev, password: "Password is required." }));
      return;
    }
  

  
    try {
      // Make the API request to login
      const response = await axios.post("https://service-booking-backend-eb9i.onrender.com/api/auth/login", {
        email,
        password,
      });
  
      const { token, user } = response.data;
      setIsLoggedIn(true);  // Add this
      setUserDetails(user); // Add this
      // Store token in AsyncStorage
      await AsyncStorage.setItem("authToken", token);
  
  
      // Navigate to the appropriate page
      if (redirectTo) {
        navigation.reset({
          index: 0,
          routes: [{ name: redirectTo, params: redirectParams }],
        });
      } else {
     // In your login success handler
      navigation.navigate("Home", { refresh: Date.now() });
      }

    } catch (error) {
      // Log technical details in the terminal
      console.debug("Login error (for debugging only):", error.response?.data?.message || error.message || error);

  
      // Determine user-friendly error message
      let errorMessage = "Something went wrong. Please try again.";
      if (error.response) {
        if (error.response.status === 400) {
          errorMessage = "Invalid credentials. Please check your email and password.";
        } else if (error.response.status === 404) {
          errorMessage = "Account not found. Please sign up first.";
        } else if (error.response.status === 500) {
          errorMessage = "Server error. Please try again later.";
        }
      } else if (error.message.includes("Network")) {
        errorMessage = "Network error. Please check your internet connection.";
      }

  
      // Set specific error messages for inputs if needed
      if (errorMessage.toLowerCase().includes("email")) {
        setError((prev) => ({ ...prev, email: errorMessage }));
      } else if (errorMessage.toLowerCase().includes("password")) {
        setError((prev) => ({ ...prev, password: errorMessage }));
      } else {
        setError((prev) => ({ ...prev, general: errorMessage }));
      }
    } finally {
      setLoading(false); // Reset loading state
    }
  };
  

  return (
    <SafeAreaView style={styles.container}>
      <Toast />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.content}
      >
        <View style={styles.header}>
          <Icon name="login" size={40} color="#1a237e" />
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>Login as {role}</Text>
        </View>

        <View style={styles.form}>
          {/* Email Input */}
          <View style={[styles.inputContainer, focusedInput === "email" && styles.inputFocused]}>
            <Icon
              name="email"
              size={20}
              color={focusedInput === "email" ? "#1a237e" : "#7F8C8D"}
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#95A5A6"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setError((prev) => ({ ...prev, email: "" }));
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              onFocus={() => setFocusedInput("email")}
              onBlur={() => setFocusedInput(null)}
            />
          </View>
          {error.email && <Text style={styles.errorText}>{error.email}</Text>}

          {/* Password Input */}
          <View style={[styles.inputContainer, focusedInput === "password" && styles.inputFocused]}>
            <Icon
              name="lock"
              size={20}
              color={focusedInput === "password" ? "#1a237e" : "#7F8C8D"}
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#95A5A6"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setError((prev) => ({ ...prev, password: "" }));
              }}
              secureTextEntry={!isPasswordVisible}
              autoCapitalize="none"
              onFocus={() => setFocusedInput("password")}
              onBlur={() => setFocusedInput(null)}
            />
            <TouchableOpacity
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              style={styles.eyeIcon}
            >
              <Icon
                name={isPasswordVisible ? "visibility" : "visibility-off"}
                size={20}
                color={focusedInput === "password" ? "#1a237e" : "#7F8C8D"}
              />
            </TouchableOpacity>
          </View>
          {error.password && <Text style={styles.errorText}>{error.password}</Text>}

          {error.general && <Text style={styles.errorText}>{error.general}</Text>}

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.button, loading && { backgroundColor: "#9ea1c7" }]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{loading ? "Logging in..." : "Login"}</Text>
          </TouchableOpacity>

          {/* Forgot Password */}
          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={() => navigation.navigate("RequestPassword")}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Signup Link */}
          <TouchableOpacity
            style={styles.signupLink}
            onPress={() => navigation.navigate("Signup", { role })}
          >
            <Text style={styles.signupText}>
              Don't have an account? <Text style={styles.signupHighlight}>Sign up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2C3E50",
    marginTop: 20,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#7F8C8D",
    marginBottom: 20,
  },
  form: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 56,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  inputFocused: {
    borderWidth: 0,
    shadowColor: "#1a237e",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#2C3E50",
  },
  eyeIcon: {
    padding: 8,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: "#1a237e",
    fontSize: 14,
    fontWeight: "600",
  },
  button: {
    backgroundColor: "#1a237e",
    padding: 16,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 15,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 30,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E0E0E0",
  },
  dividerText: {
    color: "#7F8C8D",
    paddingHorizontal: 16,
    fontSize: 14,
    fontWeight: "600",
  },
  signupLink: {
    alignItems: "center",
  },
  signupText: {
    fontSize: 15,
    color: "#7F8C8D",
  },
  signupHighlight: {
    color: "#1a237e",
    fontWeight: "600",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: -10,
    marginBottom: 10,
  },
});

export default LoginScreen;