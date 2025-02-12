import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import Icon from "react-native-vector-icons/MaterialIcons";
import Toast from "react-native-toast-message";
import axios from "axios";
import { useRoute } from "@react-navigation/native";

const MAX_FILE_SIZE_MB = 5;

const UploadDocumentsScreen = ({ navigation }) => {
  const route = useRoute();
  const { email } = route.params;
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf"],
        copyToCacheDirectory: false,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const file = result.assets[0];
        const fileSizeMB = file.size / (1024 * 1024);

        if (fileSizeMB > MAX_FILE_SIZE_MB) {
          Toast.show({
            type: "error",
            text1: "File is too large",
            text2: `Maximum file size is ${MAX_FILE_SIZE_MB}MB`,
          });
          return;
        }

        setSelectedFile(file);
       
      }
    } catch (error) {
      console.error("Document picking error:", error);
      Toast.show({
        type: "error",
        text1: "Error selecting document",
        text2: "Please try again",
      });
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      Toast.show({
        type: "error",
        text1: "No file selected",
        text2: "Please select a document first",
      });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("idDocument", {
        uri: selectedFile.uri,
        type: selectedFile.mimeType,
        name: selectedFile.name,
      });

      const response = await axios.post(
        "http://192.168.8.138:5001/api/auth/upload-documents",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        Toast.show({
          type: "success",
          text1: "Upload successful",
          text2: "Your document has been uploaded",
        });
        navigation.navigate("ThankYou1");
      }
    } catch (error) {
      console.error("Upload error:", error);
      Toast.show({
        type: "error",
        text1: "Upload failed",
        text2: "Please try again",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Keeping the existing header */}
        <View style={styles.header}>
          <Icon name="folder-open" size={40} color="#1a237e" />
          <Text style={styles.title}>Upload Your ID</Text>
          <Text style={styles.subtitle}>
            Please upload your ID Document for verification.
          </Text>
          <Text style={styles.sizeLimit}>
            Maximum file size: {MAX_FILE_SIZE_MB} MB (PDF only)
          </Text>
        </View>

        {/* New upload section */}
        <View style={styles.uploadSection}>
          {!selectedFile ? (
            <TouchableOpacity
              style={styles.uploadBox}
              onPress={pickDocument}
              disabled={isUploading}
            >
              <Icon name="upload-file" size={48} color="#1a237e" />
              <Text style={styles.uploadText}>Tap to select a document</Text>
              <Text style={styles.uploadSubtext}>PDF files only</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.selectedFileBox}>
              <View style={styles.fileInfo}>
                <Icon name="description" size={24} color="#1a237e" />
                <Text style={styles.fileName} numberOfLines={1}>
                  {selectedFile.name}
                </Text>
              </View>
              <View style={styles.fileActions}>
                <TouchableOpacity
                  style={styles.changeButton}
                  onPress={pickDocument}
                  disabled={isUploading}
                >
                  <Text style={styles.changeButtonText}>Change</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => setSelectedFile(null)}
                  disabled={isUploading}
                >
                  <Icon name="close" size={24} color="#e53935" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.submitButton,
            (!selectedFile || isUploading) && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={!selectedFile || isUploading}
        >
          {isUploading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.submitButtonText}>
              {selectedFile ? "Upload Document" : "Select a document first"}
            </Text>
          )}
        </TouchableOpacity>
      </View>
      <Toast />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f9ff",
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginTop: 40,
    marginBottom: 30,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1a237e",
    marginVertical: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    lineHeight: 22,
  },
  sizeLimit: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
  },
  uploadSection: {
    flex: 1,
    justifyContent: "center",
    paddingVertical: 20,
  },
  uploadBox: {
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: "#1a237e",
    borderStyle: "dashed",
    borderRadius: 12,
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  uploadText: {
    fontSize: 18,
    color: "#1a237e",
    fontWeight: "600",
    marginTop: 16,
  },
  uploadSubtext: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
  },
  selectedFileBox: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  fileInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  fileName: {
    marginLeft: 12,
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  fileActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  changeButton: {
    backgroundColor: "#1a237e",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    marginRight: 12,
  },
  changeButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  removeButton: {
    padding: 4,
  },
  submitButton: {
    backgroundColor: "#1a237e",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  submitButtonDisabled: {
    backgroundColor: "#9fa8da",
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default UploadDocumentsScreen;