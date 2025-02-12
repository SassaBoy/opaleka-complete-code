import React, { useState, useCallback, useMemo } from "react";
import { Alert } from "react-native";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Dimensions,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Icon from "react-native-vector-icons/MaterialIcons";
import Toast from "react-native-toast-message";
import axios from "axios";

const { width } = Dimensions.get("window");

const SignupScreen = ({ route, navigation }) => {
  const { role } = route.params;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [businessName, setBusinessName] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [touchedFields, setTouchedFields] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const validNamibianPrefixes = useMemo(() => [
    "061", "062", "063", "064", "065", "066", "067", "060", "081", "083", "084", "085",
  ], []);

  const validateEmail = useCallback((email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, []);

  const validatePassword = useCallback((password) => {
    return password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);
  }, []);

  const validatePhone = useCallback((phone) => {
    if (phone.length < 10) return false;
    const prefix = phone.substring(0, 3);
    return validNamibianPrefixes.includes(prefix);
  }, [validNamibianPrefixes]);

  const handleFieldTouch = (fieldName) => {
    setTouchedFields(prev => ({ ...prev, [fieldName]: true }));
  };

  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!name) newErrors.name = "Name is required.";
    if (!email || !validateEmail(email)) newErrors.email = "Invalid email address.";
    if (!password || !validatePassword(password)) {
      newErrors.password = "Password must be at least 8 characters, contain an uppercase letter, and a number.";
    }
    if (!phone || !validatePhone(phone)) {
      newErrors.phone = "Invalid phone number for Namibia.";
    }
    if (role === "Provider" && !businessName) {
      newErrors.businessName = "Business name is required for providers.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [name, email, password, phone, businessName, role, validateEmail, validatePassword, validatePhone]);

  const isFormValid = useMemo(() => {
    return validateForm();
  }, [validateForm]);

  const shouldShowError = (fieldName) => {
    return (touchedFields[fieldName] || hasSubmitted) && errors[fieldName];
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  

  const handleSignup = async () => {
    setHasSubmitted(true);
    setErrors({});
  
    if (!isFormValid) return;
  
    const formData = new FormData();
  
    formData.append("role", role);
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("phone", phone);
    if (role === "Provider" && businessName) {
      formData.append("businessName", businessName);
    }
  
    if (profileImage) {
      const imageUri = profileImage;
      const filename = imageUri.split("/").pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : "image";
  
      formData.append("profileImage", {
        uri: imageUri,
        name: filename,
        type,
      });
    }
  
    try {
      const response = await axios.post(
        "http://192.168.8.138:5001/api/auth/register/" + role,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      if (response.data.redirect) {
        // Handle incomplete profile or provider details redirection
        Alert.alert(
          "Incomplete Application",
          "You already started the application. Would you like to continue?",
          [
            {
              text: "No",
              onPress: () => navigation.navigate("Home"), // Redirect to the home page
              style: "cancel",
            },
            {
              text: "Yes",
              onPress: () => {
                navigation.navigate(response.data.redirect, {
                  email,
                  userData: response.data.user,
                });
              },
            },
          ],
          { cancelable: false }
        );
        return;
      }
  
      Toast.show({
        type: "success",
        text1: "Success",
        text2: `Signed up successfully as ${role}!`,
      });
  
      if (role === "Provider") {
        navigation.navigate("CompleteProfile", {
          email, // Pass the email to the next screen
          userData: response.data,
        });
      } else {
        navigation.navigate("Login", { role });
      }
    } catch (error) {
      let errorMessage = "Registration failed. Please try again.";
  
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
  
        const newErrors = {};
        if (errorMessage.toLowerCase().includes("email")) {
          newErrors.email = errorMessage;
        }
        if (errorMessage.toLowerCase().includes("password")) {
          newErrors.password = errorMessage;
        }
        if (errorMessage.toLowerCase().includes("phone")) {
          newErrors.phone = errorMessage;
        }
        if (Object.keys(newErrors).length === 0) {
          newErrors.general = errorMessage;
        }
        setErrors(newErrors);
      }
  
      Toast.show({
        type: "error",
        text1: "Registration Error",
        text2: errorMessage,
      });
    }
  };
  

  
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Icon name="person-add" size={40} color="#1a237e" />
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Sign up as {role}</Text>
          </View>
  
          <View style={styles.form}>
            <TouchableOpacity
              style={styles.imagePicker}
              onPress={pickImage}
              activeOpacity={0.8}
            >
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.profileImage} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Icon name="person" size={40} color="#FFF" />
                </View>
              )}
              <Text style={styles.imageText}>
                {profileImage ? "Change Profile Image" : "Upload Profile Image"}
              </Text>
            </TouchableOpacity>
  
            {errors.general && <Text style={styles.errorText}>{errors.general}</Text>}
  
            <View style={styles.inputContainer}>
              <Icon name="person" size={20} color="#7F8C8D" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor="#95A5A6"
                value={name}
                onChangeText={setName}
                onBlur={() => handleFieldTouch('name')}
              />
            </View>
            {shouldShowError('name') && <Text style={styles.errorText}>{errors.name}</Text>}
  
            <View style={styles.inputContainer}>
              <Icon name="email" size={20} color="#7F8C8D" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#95A5A6"
                value={email}
                onChangeText={setEmail}
                onBlur={() => handleFieldTouch('email')}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            {shouldShowError('email') && <Text style={styles.errorText}>{errors.email}</Text>}
  
            <View style={styles.inputContainer}>
              <Icon name="lock" size={20} color="#7F8C8D" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#95A5A6"
                value={password}
                onChangeText={setPassword}
                onBlur={() => handleFieldTouch('password')}
                secureTextEntry={!isPasswordVisible}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                style={styles.eyeIcon}
              >
                <Icon
                  name={isPasswordVisible ? "visibility" : "visibility-off"}
                  size={20}
                  color="#7F8C8D"
                />
              </TouchableOpacity>
            </View>
            {shouldShowError('password') && <Text style={styles.errorText}>{errors.password}</Text>}
  
            <View style={styles.inputContainer}>
              <Icon name="phone" size={20} color="#7F8C8D" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                placeholderTextColor="#95A5A6"
                value={phone}
                onChangeText={setPhone}
                onBlur={() => handleFieldTouch('phone')}
                keyboardType="phone-pad"
              />
            </View>
            {shouldShowError('phone') && <Text style={styles.errorText}>{errors.phone}</Text>}
  
            {role === "Provider" && (
              <View style={styles.inputContainer}>
                <Icon name="business" size={20} color="#7F8C8D" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Business Name"
                  placeholderTextColor="#95A5A6"
                  value={businessName}
                  onChangeText={setBusinessName}
                  onBlur={() => handleFieldTouch('businessName')}
                />
              </View>
            )}
            {shouldShowError('businessName') && <Text style={styles.errorText}>{errors.businessName}</Text>}
  
            <TouchableOpacity
              style={[styles.button, !isFormValid && styles.disabledButton]}
              onPress={handleSignup}
              disabled={!isFormValid}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Create Account</Text>
            </TouchableOpacity>
  
            <TouchableOpacity
              style={styles.loginLink}
              onPress={() => navigation.navigate("Login", { role })}
            >
              <Text style={styles.loginText}>
                Already have an account? <Text style={styles.loginHighlight}>Login</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <Toast />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 10,
    marginTop: 50,
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
  },
  form: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },
  imagePicker: {
    alignItems: "center",
    marginBottom: 30,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 12,
    borderWidth: 3,
    borderColor: "#1a237e",
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#1a237e",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  imageText: {
    fontSize: 14,
    color: "#1a237e",
    fontWeight: "600",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderColor: "#E0E0E0",
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 56,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
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
  button: {
    backgroundColor: "#1a237e",
    padding: 16,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#1a237e",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  disabledButton: {
    backgroundColor: "#9ea1c7",
    shadowOpacity: 0.1,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  loginLink: {
    alignItems: "center",
    marginTop: 20,
  },
  loginText: {
    fontSize: 15,
    color: "#7F8C8D",
  },
  loginHighlight: {
    color: "#9ea1c7",
    fontWeight: "600",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: -12,
    marginBottom: 8,
    marginLeft: 16,
  },
  serverErrorContainer: {
    backgroundColor: "#FFE5E5",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#FFA5A5",
  },
  serverErrorText: {
    color: "#D63031",
    fontSize: 14,
    textAlign: "center",
  },
});

export default SignupScreen;