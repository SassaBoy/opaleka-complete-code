import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Modal,
  TextInput,
  Platform,
  Switch,
} from "react-native";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from '@react-native-community/datetimepicker';
import PasswordFields from './PasswordFields';  // Create this in a new file
import ServicesSection from './ServicesSection';  // Create this in a new file

const UserAccount = ({ route }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [bottomSidebarVisible, setBottomSidebarVisible] = useState(false);
  const [editableFields, setEditableFields] = useState({});
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [activeTimeField, setActiveTimeField] = useState(null);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [passwordFields, setPasswordFields] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [availableServices] = useState([
    { name: 'Cleaning', category: 'Home' },
    { name: 'Plumbing', category: 'Home' },
    { name: 'Electrical', category: 'Home' },
    // Add more services as needed
  ]);

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await fetch(
        "https://service-booking-backend-eb9i.onrender.com/api/auth/get-user",
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          setUserDetails(data.user);
          
          // Initialize all fields with proper defaults
          const defaultFields = {
            name: data.user.name,
            email: data.user.email,
            phone: data.user.phone || "",
            businessAddress: "",
            town: "",
            yearsOfExperience: "",
            services: [],
            operatingHours: {
              Monday: { start: null, end: null, isClosed: false },
              Tuesday: { start: null, end: null, isClosed: false },
              Wednesday: { start: null, end: null, isClosed: false },
              Thursday: { start: null, end: null, isClosed: false },
              Friday: { start: null, end: null, isClosed: false },
              Saturday: { start: null, end: null, isClosed: false },
              Sunday: { start: null, end: null, isClosed: false }
            },
            socialLinks: {
              facebook: "",
              twitter: "",
              instagram: "",
              linkedin: ""
            }
          };
  
       // Merge with existing profile data if available
if (data.user.completeProfile) {
  defaultFields.businessAddress = data.user.completeProfile.businessAddress || "";
  defaultFields.town = data.user.completeProfile.town || "";
  defaultFields.yearsOfExperience = data.user.completeProfile.yearsOfExperience || "";
  defaultFields.services = data.user.completeProfile.services?.map(s => ({
    name: s.name,
    category: s.category,
    price: s.price.toString(),
    priceType: s.priceType
  })) || [];
  defaultFields.operatingHours = data.user.completeProfile.operatingHours || defaultFields.operatingHours;
  defaultFields.socialLinks = data.user.completeProfile.socialLinks || defaultFields.socialLinks;
}
  
          setEditableFields(defaultFields);
        }
      }
    } catch (error) {
      console.error("Fetch error:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to load profile data"
      });
    } finally {
      setLoading(false);
    }
  };
  const uploadProfilePicture = async (uri) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) throw new Error("Authentication token is missing.");
  
      const formData = new FormData();
      formData.append("profileImage", {
        uri: Platform.OS === "android" ? uri : uri.replace("file://", ""),
        name: `profile_${Date.now()}.jpg`,
        type: "image/jpeg",
      });
  
      const response = await fetch(
        `https://service-booking-backend-eb9i.onrender.com/api/auth/update-profile-picture/${userDetails.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
  
      if (!response.ok) {
        throw new Error(`Failed with status ${response.status}`);
      }
  
      const data = await response.json();
      Toast.show({
        type: "success",
        text1: "Profile Updated",
        text2: "Your profile picture has been updated.",
      });
      setUserDetails((prev) => ({ ...prev, profileImage: data.profileImage }));
      setBottomSidebarVisible(false)
    } catch (error) {
      console.error("Error uploading profile picture:", error.message || error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message || "Failed to upload profile picture.",
      });
    }
  };
  
  

  const pickImageFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Toast.show({
        type: "error",
        text1: "Permission needed",
        text2: "Please grant camera roll permissions to upload photos.",
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      await uploadProfilePicture(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Toast.show({
        type: "error",
        text1: "Permission needed",
        text2: "Please grant camera permissions to take photos.",
      });
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      await uploadProfilePicture(result.assets[0].uri);
    }
  };

  const handleTimeChange = (event, selectedDate) => {
    setShowTimePicker(false);
    if (selectedDate && activeTimeField) {
      const timeString = selectedDate.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: false 
      });
      const [day, field] = activeTimeField.split('.');
      
      setEditableFields(prev => ({
        ...prev,
        operatingHours: {
          ...prev.operatingHours,
          [day]: {
            ...prev.operatingHours[day],
            [field]: timeString
          }
        }
      }));
    }
  };

  const toggleDayClosed = (day) => {
    setEditableFields(prev => ({
      ...prev,
      operatingHours: {
        ...prev.operatingHours,
        [day]: {
          ...prev.operatingHours[day],
          isClosed: !prev.operatingHours[day].isClosed
        }
      }
    }));
  };

  const addService = () => {
    setEditableFields(prev => ({
      ...prev,
      services: [
        ...prev.services,
        {
          name: availableServices[0].name,
          category: availableServices[0].category,
          price: "0"
        }
      ]
    }));
  };

  const updateService = (index, field, value) => {
    setEditableFields(prev => ({
      ...prev,
      services: prev.services.map((service, i) => 
        i === index ? { ...service, [field]: value } : service
      )
    }));
  };

  const deleteService = (index) => {
    setEditableFields(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }));
  };

  
  const renderBasicInfo = () => {
    const basicFields = [
      { key: "name", label: "Name" },
      { key: "email", label: "Email" },
      { key: "phone", label: "Phone" },
    ];
  
    return (
      <>
        {basicFields.map(({ key, label }) => (
          <View key={key} style={styles.field}>
            <Text style={styles.fieldLabel}>{label}</Text>
            {editing ? (
              <TextInput
                style={[
                  styles.input,
                  editableFields.errors?.[key] && styles.errorInput, // Apply error styling
                ]}
                value={editableFields[key]}
                onChangeText={(text) =>
                  setEditableFields((prev) => ({
                    ...prev,
                    [key]: text,
                    errors: { ...prev.errors, [key]: "" }, // Clear error on change
                  }))
                }
                keyboardType={
                  key === "email" ? "email-address" : key === "phone" ? "phone-pad" : "default"
                }
              />
            ) : (
              <Text style={styles.fieldValue}>{editableFields[key]}</Text>
            )}
            {editableFields.errors?.[key] && (
              <Text style={styles.errorText}>{editableFields.errors[key]}</Text>
            )}
          </View>
        ))}
        {editing && (
          <TouchableOpacity
            style={styles.passwordButton}
            onPress={() => setShowPasswordFields(!showPasswordFields)}
          >
            <Text style={styles.passwordButtonText}>
              {showPasswordFields ? "Hide Password Fields" : "Change Password"}
            </Text>
          </TouchableOpacity>
        )}
        {editing && showPasswordFields && (
          <PasswordFields
            passwordFields={passwordFields}
            setPasswordFields={setPasswordFields}
            onValidationChange={setIsPasswordValid}
          />
        )}
      </>
    );
  };
  
  
  const renderProviderInfo = () => {
    if (!userDetails?.completeProfile || userDetails.role !== 'Provider') return null;
  
    return (
      <>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Business Information</Text>
          {['businessAddress', 'town', 'yearsOfExperience'].map((key) => (
            <View key={key} style={styles.field}>
              <Text style={styles.fieldLabel}>
                {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
              </Text>
              {editing ? (
                <TextInput
                  style={[
                    styles.input,
                    editableFields.errors?.[key] && styles.errorInput, // Error styling
                  ]}
                  value={editableFields[key]}
                  onChangeText={(text) =>
                    setEditableFields((prev) => ({
                      ...prev,
                      [key]: text,
                      errors: { ...prev.errors, [key]: '' }, // Clear error on change
                    }))
                  }
                />
              ) : (
                <Text style={styles.fieldValue}>{editableFields[key]}</Text>
              )}
              {editableFields.errors?.[key] && (
                <Text style={styles.errorText}>{editableFields.errors[key]}</Text>
              )}
            </View>
          ))}
        </View>
  
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Services Offered</Text>
            {editing && (
              <TouchableOpacity style={styles.addButton} onPress={addService}>
                <MaterialIcons name="add" size={24} color="#00AEEF" />
              </TouchableOpacity>
            )}
          </View>
          <ServicesSection
            services={editableFields.services || []}
            availableServices={availableServices}
            onUpdate={(index, updatedService) => {
              const newServices = [...editableFields.services];
              newServices[index] = updatedService;
              setEditableFields((prev) => ({
                ...prev,
                services: newServices,
                errors: { ...prev.errors, services: '' }, // Clear error on update
              }));
            }}
            onDelete={(index) => {
              const updatedServices = editableFields.services.filter((_, i) => i !== index);
              setEditableFields((prev) => ({
                ...prev,
                services: updatedServices,
                errors: { ...prev.errors, services: '' }, // Clear error on delete
              }));
            }}
            onAdd={() => {
              setEditableFields((prev) => ({
                ...prev,
                services: [
                  ...prev.services,
                  {
                    name: availableServices[0].name,
                    category: availableServices[0].category,
                    price: '0',
                  },
                ],
                errors: { ...prev.errors, services: '' }, // Clear error on add
              }));
            }}
          />
          {editableFields.errors?.services && (
            <Text style={styles.errorText}>{editableFields.errors.services}</Text>
          )}
        </View>
  
        <View style={styles.section}>
  <Text style={styles.sectionTitle}>Operating Hours</Text>
  {Object.entries(editableFields.operatingHours || {}).map(([day, hours]) => (
    <View key={day} style={styles.hourRow}>
      <Text style={styles.dayName}>{day}</Text>
      {editing ? (
        <View style={styles.hoursInputContainer}>
          <Switch
            value={!hours.isClosed}
            onValueChange={() => toggleDayClosed(day)}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={hours.isClosed ? "#f4f3f4" : "#f4f3f4"}
          />
          {!hours.isClosed && (
            <>
              <TouchableOpacity
                style={styles.timeInput}
                onPress={() => {
                  setActiveTimeField(`${day}.start`);
                  setShowTimePicker(true);
                }}
              >
                <Text style={styles.timeText}>
                  {hours.start || 'Set Start'}
                </Text>
              </TouchableOpacity>
              <Text style={styles.timeSeparator}>-</Text>
              <TouchableOpacity
                style={styles.timeInput}
                onPress={() => {
                  setActiveTimeField(`${day}.end`);
                  setShowTimePicker(true);
                }}
              >
                <Text style={styles.timeText}>
                  {hours.end || 'Set End'}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      ) : (
        <Text style={styles.hours}>
          {hours.isClosed ? 'Closed' : `${hours.start || '--:--'} to ${hours.end || '--:--'}`}
        </Text>
      )}
    </View>
  ))}
</View>
  
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Social Media</Text>
          {Object.entries(editableFields.socialLinks || {}).map(([platform, link]) => (
            <View key={platform} style={styles.socialLink}>
              <MaterialIcons name="link" size={24} color="#1a237e" />
              {editing ? (
                <TextInput
                  style={styles.socialLinkInput}
                  value={link}
                  onChangeText={(text) =>
                    setEditableFields((prev) => ({
                      ...prev,
                      socialLinks: {
                        ...prev.socialLinks,
                        [platform]: text,
                      },
                    }))
                  }
                  placeholder={`Enter ${platform} link`}
                />
              ) : (
                <Text style={styles.socialLinkText}>
                  {platform}: {link || ''}
                </Text>
              )}
            </View>
          ))}
        </View>
      </>
    );
  };
  
  const saveChanges = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) throw new Error("Authentication token is missing");
  
      let errors = {};
  
      // Validate basic fields
      if (!editableFields.name) errors.name = "Name cannot be empty.";
      if (!editableFields.email) {
        errors.email = "Email cannot be empty.";
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(editableFields.email)) {
          errors.email = "Invalid email format.";
        }
      }
  
      if (!editableFields.phone) {
        errors.phone = "Phone number cannot be empty.";
      } else {
        const validNamibianPrefixes = [
          "061", "062", "063", "064", "065", "066", "067", "060", "081", "083", "084", "085",
        ];
        const prefix = editableFields.phone.substring(0, 3);
        if (!validNamibianPrefixes.includes(prefix) || editableFields.phone.length < 10) {
          errors.phone = "Invalid Namibian phone number.";
        }

        
      }
  
      // Validate provider-specific fields
      if (userDetails.role === "Provider") {
        if (!editableFields.businessAddress) {
          errors.businessAddress = "Business address cannot be empty.";
        }
        if (!editableFields.town) {
          errors.town = "Town cannot be empty.";
        }
        if (!editableFields.services || editableFields.services.length === 0) {
          errors.services = "At least one service must be provided.";
        }
        if (
          !editableFields.operatingHours ||
          Object.keys(editableFields.operatingHours).length === 0
        ) {
          errors.operatingHours = "Operating hours cannot be empty.";
        }
      }
  
      // If there are errors, set them and stop execution
      if (Object.keys(errors).length > 0) {
        setEditableFields((prev) => ({
          ...prev,
          errors,
        }));
        return;
      }
  
      let updateData = {
        name: editableFields.name,
        email: editableFields.email,
        phone: editableFields.phone,
      };
  
      if (showPasswordFields) {
        if (!isPasswordValid) {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: "Please fix password validation errors before saving.",
          });
          return;
        }
        if (passwordFields.newPassword) {
          updateData.oldPassword = passwordFields.oldPassword;
          updateData.newPassword = passwordFields.newPassword;
        }
      }
  
      if (userDetails.role === "Provider") {
        updateData.completeProfile = {
          businessAddress: editableFields.businessAddress,
          town: editableFields.town,
          yearsOfExperience: editableFields.yearsOfExperience,
          services: editableFields.services,
          operatingHours: editableFields.operatingHours,
          socialLinks: editableFields.socialLinks, // Can remain null
        };
      }
  
      const response = await fetch(
        `https://service-booking-backend-eb9i.onrender.com/api/auth/update-user/${userDetails.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updateData),
        }
      );
  
      const data = await response.json();
      if (!data.success) {
        // Handle email-specific error
        if (data.message && data.message.toLowerCase().includes("email")) {
          setEditableFields((prev) => ({
            ...prev,
            errors: { ...prev.errors, email: data.message },
          }));
        } else {
          throw new Error(data.message || "Failed to update user details");
        }
        return;
      }
      if (data.message?.toLowerCase().includes("current password")) {
        setPasswordFields((prev) => ({
          ...prev,
          error: "Current password is incorrect.",
        }));
        return;
      }
      
      setEditing(false);
      setShowPasswordFields(false);
      setPasswordFields({ oldPassword: "", newPassword: "", confirmPassword: "" });
  
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Profile updated successfully.",
      });
  
      fetchUserDetails();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message || "Failed to save changes.",
      });
    }
  };
  
  const renderBottomSidebar = () => (
    <Modal
      visible={bottomSidebarVisible}
      animationType="slide"
      transparent
      onRequestClose={() => setBottomSidebarVisible(false)}
    >
      <View style={styles.bottomSidebarOverlay}>
        <View style={styles.bottomSidebar}>
          <Text style={styles.bottomSidebarTitle}>Update Profile Picture</Text>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={pickImageFromGallery}
          >
            <MaterialIcons name="photo-library" size={24} color="#1a237e" />
            <Text style={styles.optionText}>Choose from Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={takePhoto}
          >
            <MaterialIcons name="camera" size={24} color="#1a237e" />
            <Text style={styles.optionText}>Take a Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.optionButton, styles.cancelButton]}
            onPress={() => setBottomSidebarVisible(false)}
          >
            <MaterialIcons name="close" size={24} color="red" />
            <Text style={[styles.optionText, styles.cancelText]}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00AEEF" />
        </View>
      ) : !userDetails ? (
        <View style={styles.loadingContainer}>
          <Text>No user details found</Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollView}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.profileImageContainer}
              onPress={() => setBottomSidebarVisible(true)}
            >
<Image
  source={{
    uri: userDetails?.profileImage
      ? `https://service-booking-backend-eb9i.onrender.com/${userDetails.profileImage.replace(/\\/g, "/")}`
      : "https://service-booking-backend-eb9i.onrender.com/uploads/default-profile.png",
  }}
  style={styles.profileImage}
  resizeMode="cover"
/>
              <View style={styles.editOverlay}>
                <MaterialIcons name="camera-alt" size={24} color="white" />
              </View>
            </TouchableOpacity>
            <Text style={styles.userName}>{userDetails.name}</Text>
            <View style={styles.roleChip}>
              <Text style={styles.roleText}>{userDetails.role}</Text>
            </View>
          </View>

          <View style={styles.profileStatusContainer}>
  <View style={[
    styles.statusBadge,
    userDetails?.completeProfile ? styles.completeBadge : styles.incompleteBadge
  ]}>
    <MaterialIcons 
      name={userDetails?.completeProfile ? "verified" : "error-outline"} 
      size={16} 
      color={userDetails?.completeProfile ? "#4CAF50" : "#FFC107"} 
    />
    <Text style={[
      styles.statusText,
      { color: userDetails?.completeProfile ? "#4CAF50" : "#FFC107" }
    ]}>
      {userDetails?.completeProfile ? "Complete Profile" : "Incomplete Profile"}
    </Text>
  </View>
</View>
          <View style={styles.content}>
            <View style={styles.contentHeader}>
              <Text style={styles.contentTitle}>Profile Details</Text>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => editing ? saveChanges() : setEditing(true)}
              >
                <MaterialIcons
                  name={editing ? "check" : "edit"}
                  size={24}
                  color="#00AEEF"
                />
              </TouchableOpacity>
            </View>

            {renderBasicInfo()}
            {renderProviderInfo()}
          </View>
        </ScrollView>
      )}
      {renderBottomSidebar()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6FA",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: "#1a237e",
    padding: 20,
    paddingBottom: 80,
    alignItems: "center",
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginTop: 20,
    marginBottom: 15,
    elevation: 5,
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "#fff",
  },
  editOverlay: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#00AEEF",
    padding: 8,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "#fff",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 10,
  },
  roleChip: {
    backgroundColor: "#00AEEF",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 8,
  },
  roleText: {
    color: "#fff",
    fontWeight: "bold",
  },
  content: {
    marginTop: -50,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    minHeight: 600,
  },
  contentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  contentTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a237e",
  },
  editButton: {
    backgroundColor: "#E3F2FD",
    padding: 10,
    borderRadius: 12,
  },
  field: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  fieldValue: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#F5F6FA",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1a237e",
    marginBottom: 12,
  },
  serviceCard: {
    backgroundColor: "#F5F6FA",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  serviceDetail: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  servicePrice: {
    fontSize: 16,
    color: "#00AEEF",
    fontWeight: "bold",
    marginTop: 6,
  },
  hourRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  dayName: {
    fontSize: 16,
    color: "#333",
  },
  hours: {
    fontSize: 16,
    color: "#666",
  },
  socialLink: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  socialLinkText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 10,
  },
  hoursInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  timeInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  socialLinkInput: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  socialLinkTextInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
    padding: 8,
  },
  passwordButton: {
    backgroundColor: "#E3F2FD",
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center',
  },
  passwordButtonText: {
    color: "#1a237e",
    fontWeight: "600",
  },
  passwordFields: {
    gap: 10,
    marginTop: 10,
  },
  servicePicker: {
    backgroundColor: "#F5F6FA",
    borderRadius: 8,
    marginBottom: 10,
  },
  priceInput: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  deleteButton: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: "#E3F2FD",
    padding: 8,
    borderRadius: 8,
  },
  socialLinkInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 10,
    marginLeft: 10,
  },
  bottomSidebarOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Slightly darker overlay for emphasis
    alignItems: "center",
  },
  
  bottomSidebar: {
    width: "100%", // Full width for the sidebar
    maxHeight: "60%", // Uses 60% of the screen height for better usability
    backgroundColor: "#ffffff", // Clean white background
    paddingHorizontal: 24, // Ample padding for content spacing
    paddingTop: 20, // Padding at the top
    paddingBottom: 30, // Padding at the bottom
    borderTopLeftRadius: 24, // Larger rounded corners for a modern look
    borderTopRightRadius: 24,
    shadowColor: "#000", // Subtle shadow for a floating effect
    shadowOffset: { width: 0, height: -4 }, // Shadow above the sidebar
    shadowOpacity: 0.1, // Light shadow transparency
    shadowRadius: 6,
    elevation: 10, // Elevated look for Android
    alignItems: "center", // Center aligns the content
  },
  
  bottomSidebarTitle: {
    fontSize: 18, // Larger title for better readability
    fontWeight: "700", // Bold font for emphasis
    color: "#1a237e", // Matches your app's primary color
    marginBottom: 16, // Space between title and the first option
    textAlign: "center",
  },
  
  optionButton: {
    width: "100%", // Full width for buttons
    flexDirection: "row", // Icon and text side by side
    alignItems: "center", // Vertically align icon and text
    paddingVertical: 16, // Ample vertical padding
    paddingHorizontal: 16, // Inner padding for better spacing
    marginBottom: 12, // Space between options
    backgroundColor: "#f8f9fa", // Light background for buttons
    borderRadius: 12, // Rounded corners for buttons
    shadowColor: "#000", // Slight shadow for depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  optionText: {
    fontSize: 16, // Comfortable font size
    color: "#333", // Dark text for readability
    fontWeight: "500", // Medium weight for clear visibility
    marginLeft: 12, // Space between icon and text
  },
  
  cancelButton: {
    marginTop: 20, // Space above the cancel button
    paddingVertical: 12, // Smaller padding for cancel button
    paddingHorizontal: 16,
    backgroundColor: "#ffe5e5", // Light red background for cancellation
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  
  cancelText: {
    fontSize: 16,
    color: "red", // Red text for emphasis
    fontWeight: "500",
    marginLeft: 12,
  },
  errorInput: {
    borderColor: "red",
  },
  
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
  profileStatusContainer: {
    marginTop: 10,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  completeBadge: {
    backgroundColor: '#E8F5E9',
  },
  incompleteBadge: {
    backgroundColor: '#FFF3E0',
  },
  statusText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  timeText: {
    color: '#1a237e',
    fontSize: 14,
  },
  timeSeparator: {
    marginHorizontal: 8,
    color: '#666',
  },
  hourRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  hoursInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  timeInput: {
    borderWidth: 1,
    borderColor: '#1a237e',
    borderRadius: 8,
    padding: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  
});

export default UserAccount;