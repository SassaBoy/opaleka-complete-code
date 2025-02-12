import React from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const PasswordFields = ({
  passwordFields,
  setPasswordFields,
  onValidationChange,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const validatePasswords = () => {
    const errors = {};
    if (!passwordFields.oldPassword) {
      errors.oldPassword = "Current password is required.";
    }
    if (!passwordFields.newPassword) {
      errors.newPassword = "New password cannot be empty.";
    }
    if (passwordFields.newPassword !== passwordFields.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }
    onValidationChange(Object.keys(errors).length === 0);
    return errors;
  };

  React.useEffect(() => {
    validatePasswords();
  }, [passwordFields]);

  return (
    <View style={styles.container}>
      {["oldPassword", "newPassword", "confirmPassword"].map((field, index) => (
        <View key={field} style={styles.field}>
          <Text style={styles.label}>
            {field === "oldPassword"
              ? "Current Password"
              : field === "newPassword"
              ? "New Password"
              : "Confirm Password"}
          </Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.input,
                field === "oldPassword" && passwordFields.error && styles.errorInput,
              ]}
              secureTextEntry={!isPasswordVisible}
              value={passwordFields[field]}
              onChangeText={(text) =>
                setPasswordFields((prev) => ({
                  ...prev,
                  [field]: text,
                  error: "", // Clear error on input change
                }))
              }
            />
            <TouchableOpacity
              onPress={togglePasswordVisibility}
              style={styles.eyeIcon}
            >
              <MaterialIcons
                name={isPasswordVisible ? "visibility" : "visibility-off"}
                size={20}
                color="#666"
              />
            </TouchableOpacity>
          </View>
          {field === "oldPassword" && passwordFields.error && (
            <Text style={styles.errorText}>{passwordFields.error}</Text>
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
  },
  eyeIcon: {
    marginLeft: 8,
  },
  errorInput: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
});

export default PasswordFields;
