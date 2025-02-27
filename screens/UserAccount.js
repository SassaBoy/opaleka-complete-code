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
  FlatList,
  Alert
} from "react-native";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from '@react-native-community/datetimepicker';
import PasswordFields from './PasswordFields';  // Create this in a new file
import ServicesSection from './ServicesSection';  // Create this in a new file
import ServicesSection101 from "./ServicesSection101";
import ImageGallery from "./ImageGallery";

const UserAccount = ({ route, navigation }) => {
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
  const [editingIndex, setEditingIndex] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [deletedImages, setDeletedImages] = useState([]); // Store deleted images

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
    const checkAuthToken = async () => {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        navigation.replace("Home");

      } else {
        fetchUserDetails();
      }
    };
  
    // Run initially and every time the screen is focused
    const unsubscribe = navigation.addListener("focus", checkAuthToken);
  
    return unsubscribe;
  }, [navigation]);
  
  
  const fetchUserDetails = async () => {
    try {
        const token = await AsyncStorage.getItem("authToken");
        const response = await fetch(
            "http://192.168.8.138:5001/api/auth/get-user",
            { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.ok) {
            const data = await response.json();
            if (data.success && data.user) {
                setUserDetails(data.user);

                const defaultFields = {
                    name: data.user.name,
                    email: data.user.email,
                    phone: data.user.phone || "",
                    businessAddress: "",
                    town: "",
                    yearsOfExperience: "",
                    services: [], // ✅ Initialize empty services array
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
                    },
                    images: [] // ✅ Ensure images array is always defined
                };

                if (data.user.completeProfile) {
                    defaultFields.businessAddress = data.user.completeProfile.businessAddress || "";
                    defaultFields.town = data.user.completeProfile.town || "";
                    defaultFields.yearsOfExperience = data.user.completeProfile.yearsOfExperience || "";

                    // ✅ Merge existing services if available
                    defaultFields.services = Array.isArray(data.user.completeProfile.services)
                        ? data.user.completeProfile.services.map(s => ({
                              id: s._id || null,  // Ensure service ID is retained
                              name: s.name,
                              category: s.category,
                              price: s.price?.toString() || "0",
                              priceType: s.priceType?.toString() || "hour"
                          }))
                        : [];

                    defaultFields.operatingHours = data.user.completeProfile.operatingHours || defaultFields.operatingHours;
                    defaultFields.socialLinks = data.user.completeProfile.socialLinks || defaultFields.socialLinks;

                    defaultFields.images = data.user.completeProfile.images?.map(img =>
                        img.startsWith("http") ? img : `http://192.168.8.138:5001/${img.replace(/\\/g, "/")}`
                    ) || [];
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



const confirmDeleteService = (serviceId, index) => {
  Alert.alert(
    "Delete Service",
    "Are you sure you want to remove this service?",
    [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", onPress: () => deleteService(serviceId, index), style: "destructive" },
    ]
  );
};

const addServiceToProvider = async (service) => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    if (!token) throw new Error("Authentication token is missing.");

    const response = await fetch(
      "http://192.168.8.138:5001/api/auth/add-service",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: userDetails.id,
          name: service.name,
          category: service.category,
          price: parseFloat(service.price) || 0,
          priceType: service.priceType || "hour",
        }),
      }
    );

    const data = await response.json();
    if (!data.success) throw new Error(data.message || "Failed to add service");

    // Update UI
    setEditableFields((prev) => ({
      ...prev,
      services: [...(prev.services || []), service], // ✅ Appends the new service without replacing existing ones
    }));
    
    

    Toast.show({
      type: "success",
      text1: "Service Added",
      text2: `Service '${service.name}' added successfully.`,
    });
  } catch (error) {
    console.error("Error adding service:", error);
    Toast.show({
      type: "error",
      text1: "Error",
      text2: error.message || "Failed to add service.",
    });
  }
};

const addPredefinedService = () => {
  const defaultService = {
    name: availableServices[0].name,
    category: availableServices[0].category,
    price: "0",
    priceType: "hour",
  };

  // Use spread operator to create a new array with all existing services plus the new one
  setEditableFields((prev) => ({
    ...prev,
    services: [...(prev.services || []), service], // ✅ Appends the new service without replacing existing ones
  }));
  
};

// Function to handle adding a custom service
const addCustomService = (name, category, price, priceType) => {
  const newService = {
    name,
    category,
    price: price.toString(),
    priceType,
  };

  // Use spread operator to create a new array with all existing services plus the new one
  setEditableFields((prev) => ({
    ...prev,
    services: [...(prev.services || []), service], // ✅ Appends the new service without replacing existing ones
  }));
  
};
const pickNewBusinessImage = async () => {
  try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
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

      if (!result.canceled && result.assets.length > 0) {
          const localImageUri = result.assets[0].uri;
          console.log("Local Image URI:", localImageUri);

          // ✅ Update UI Immediately with Local Image
          setEditableFields((prev) => ({
              ...prev,
              images: [...(prev.images || []), localImageUri],
          }));

          const token = await AsyncStorage.getItem("authToken");
          if (!token) throw new Error("Authentication token is missing.");

          const formData = new FormData();
          formData.append("image", {
              uri: Platform.OS === "android" ? localImageUri : localImageUri.replace("file://", ""),
              name: `business_${Date.now()}.jpg`,
              type: "image/jpeg",
          });

          const response = await fetch(
            "http://192.168.8.138:5001/api/auth/images/add",
            {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            }
        );
        
        const data = await response.json();
        console.log("Server Response:", data);
        
        if (!data.imagePath || typeof data.imagePath !== "string") {
            throw new Error("Invalid imagePath received from server.");
        }
        
        setEditableFields((prev) => ({
            ...prev,
            images: prev.images.map((img) =>
                img === localImageUri
                    ? `http://192.168.8.138:5001/${data.imagePath.replace(/\\/g, "/")}`
                    : img
            ),
        }));
    

          Toast.show({
              type: "success",
              text1: "Image Uploaded",
              text2: "Business image added successfully.",
          });
      }
  } catch (error) {
      console.error("Error adding image:", error);
      Toast.show({
          type: "error",
          text1: "Error",
          text2: error.message || "Failed to upload image.",
      });
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
        `http://192.168.8.138:5001/api/auth/update-profile-picture/${userDetails.id}`,
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
  const deleteBusinessImage = (index) => {
    // Capture image before state update
    const imageToDelete = editableFields.images[index];
    
    // Optimistic UI update
    setEditableFields(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    
    // Track deleted images correctly
    setDeletedImages(prev => [...prev, imageToDelete]);
  };

  const handleTimePickerConfirm = (value) => {
    const [day, field] = activeTimeField.split(".");
    setEditableFields((prev) => ({
      ...prev,
      operatingHours: {
        ...prev.operatingHours,
        [day]: {
          ...prev.operatingHours[day],
          [field]: value.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isClosed: prev.operatingHours[day]?.isClosed || false, 
        },
      },
    }));
    setShowTimePicker(false);
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
    setEditableFields((prev) => {
      const updatedServices = [...prev.services];
      updatedServices[index] = { ...updatedServices[index], [field]: value }; // ✅ Ensures direct update
      return { ...prev, services: updatedServices };
    });
  };
  
  const deleteService = async (serviceId, index) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) throw new Error("Authentication token is missing.");
  
      setLoading(true); // Start loading
  
      const response = await fetch(
        `http://192.168.8.138:5001/api/auth/delete-service/${serviceId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (!response.ok) {
        throw new Error(`Failed to delete service. Status: ${response.status}`);
      }
  
      const data = await response.json();
  
      if (data.success) {
        // Remove service from UI
        setEditableFields((prev) => ({
          ...prev,
          services: prev.services ? prev.services.filter((_, i) => i !== index) : [],
        }));
        
  
        Toast.show({
          type: "success",
          text1: "Service Deleted",
          text2: "The service has been successfully removed.",
        });
      } else {
        throw new Error(data.message || "Failed to delete service.");
      }
    } catch (error) {
      console.error("Error deleting service:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message || "Failed to delete service.",
      });
    } finally {
      setLoading(false); // Stop loading
    }
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
  <>
    <PasswordFields
      passwordFields={passwordFields}
      setPasswordFields={setPasswordFields}
      onValidationChange={setIsPasswordValid}
    />

    {editableFields.errors?.oldPassword && (
      <Text style={styles.errorText}>{editableFields.errors.oldPassword}</Text>
    )}
    {editableFields.errors?.newPassword && (
      <Text style={styles.errorText}>{editableFields.errors.newPassword}</Text>
    )}
    {editableFields.errors?.confirmPassword && (
      <Text style={styles.errorText}>{editableFields.errors.confirmPassword}</Text>
    )}
  </>
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
        value={editableFields[key]?.toString() || ""} // Ensures number is converted to string
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
  <Text style={styles.sectionTitle}>Services Offered</Text>

  {editing && (
    <View style={styles.editingBanner}>
      <MaterialIcons name="info-outline" size={20} color="#FFC107" />
      <Text style={styles.editingText}>
        You can edit your services here. After making changes, tap the save icon (✔) on the top right to save.
      </Text>
    </View>
  )}

  {editableFields.services.length === 0 ? (
     <Text style={styles.noServicesText}>
     No services listed. Add services to display them here.
   </Text>
  ) : (
    editableFields.services.map((service, index) => (
      <View key={index} style={styles.serviceCard}>
        
        {editing && (
          <TouchableOpacity 
            style={styles.deleteServiceButton} 
            onPress={() => confirmDeleteService(service._id, index)}
            activeOpacity={0.7}
          >
            <MaterialIcons name="delete" size={24} color="white" />
          </TouchableOpacity>
        )}

        <Text style={styles.serviceName}>{service.name}</Text>
        <Text style={styles.serviceDetail}>Category: {service.category}</Text>

        {editing ? (
          <View style={styles.serviceEditRow}>
            <TextInput
              style={styles.priceInput}
              value={editableFields.services[index]?.price?.toString() || ""}
              keyboardType="numeric"
              onChangeText={(text) => updateService(index, "price", text)}
            />

            <Picker
              selectedValue={editableFields.services[index]?.priceType || "hourly"}
              onValueChange={(value) => updateService(index, "priceType", value)}
              style={styles.priceTypePicker}
            >
              <Picker.Item label="Per Hour" value="hourly" />
              <Picker.Item label="One-Time" value="once-off" />
            </Picker>
          </View>
        ) : (
          <Text style={styles.servicePrice}>
            Price: {service.price} {service.priceType}
          </Text>
        )}
      </View>
    ))
  )}

  {editing && (
    <ServicesSection101
      services={editableFields.services || []}
      availableServices={availableServices}
      onServicesChange={(updatedServices) => {
        setEditableFields((prev) => ({
          ...prev,
          services: updatedServices,
          errors: { ...prev.errors, services: "" },
        }));
      }}
    />
  )}
</View>

        <View style={styles.section}>
  <Text style={styles.sectionTitle}>Operating Hours</Text>
  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => {
  const hours = editableFields.operatingHours?.[day] || { isClosed: false, start: "", end: "" };

  return (
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
          {!hours.isClosed ? (
            <>
              <TouchableOpacity
                style={styles.timeInput}
                onPress={() => {
                  setActiveTimeField(`${day}.start`);
                  setShowTimePicker(true);
                }}
              >
                <Text style={styles.timeText}>{hours.start || "Set Start"}</Text>
              </TouchableOpacity>
              <Text style={styles.timeSeparator}>-</Text>
              <TouchableOpacity
                style={styles.timeInput}
                onPress={() => {
                  setActiveTimeField(`${day}.end`);
                  setShowTimePicker(true);
                }}
              >
                <Text style={styles.timeText}>{hours.end || "Set End"}</Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text style={styles.closedText}>Closed</Text>
          )}
        </View>
      ) : (
        <Text style={styles.hours}>
        {hours.isClosed
          ? "Closed"
          : hours.start && hours.end
          ? `${hours.start} to ${hours.end}`
          : "Hours not specified"}
      </Text>
      
      )}
    </View>
  );
})}

</View>
<View style={styles.section}>
  <Text style={styles.sectionTitle}>Business Images</Text>
  <ImageGallery
    images={editableFields.images || []}
    editing={editing}
    onDeleteImage={deleteBusinessImage}
    onAddImage={pickNewBusinessImage}
  />
  
  {!editing && editableFields.images?.length === 0 && (
  <Text style={styles.noImagesText}>
  You have no images yet. To add images, tap the edit icon at the top right corner of the page. This will enable edit mode, allowing you to add images. 
  Once you've added images, tap the edit icon again to save your changes.
</Text>

  )}
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

        // Validate Name, Email, and Phone
        if (!editableFields.name) errors.name = "Name cannot be empty.";
        if (!editableFields.email) {
            errors.email = "Email cannot be empty.";
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(editableFields.email)) {
                errors.email = "Invalid email format.";
            }
        }
        if (!editableFields.phone) errors.phone = "Phone number cannot be empty.";

        // Validate Password Fields if Changing Password
        if (showPasswordFields) {
            if (!passwordFields.oldPassword) {
                errors.oldPassword = "Current password is required.";
            }
            if (!passwordFields.newPassword) {
                errors.newPassword = "New password is required.";
            }
            if (!passwordFields.confirmPassword) {
                errors.confirmPassword = "Confirm password is required.";
            }

            const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
            if (passwordFields.newPassword && !passwordRegex.test(passwordFields.newPassword)) {
                errors.newPassword = "Password must be at least 8 characters, contain an uppercase letter, and a number.";
            }

            if (passwordFields.newPassword !== passwordFields.confirmPassword) {
                errors.confirmPassword = "New password and confirm password do not match.";
            }
        }

        // If validation errors exist, display them
        if (Object.keys(errors).length > 0) {
            setEditableFields((prev) => ({ ...prev, errors }));
            Toast.show({
                type: "error",
                text1: "Validation Error",
                text2: Object.values(errors).join("\n"),
            });
            return;
        }

        // **Step 1: Verify Old Password Before Updating**
        if (showPasswordFields) {
            console.log("Verifying old password...");
            const verifyPasswordResponse = await fetch(
                "http://192.168.8.138:5001/api/auth/verify-password",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        email: editableFields.email,
                        password: passwordFields.oldPassword,
                    }),
                }
            );

            const verifyData = await verifyPasswordResponse.json();
            if (!verifyPasswordResponse.ok || !verifyData.success) {
                console.log("Password verification failed:", verifyData);
                setEditableFields((prev) => ({
                    ...prev,
                    errors: { ...prev.errors, oldPassword: "Incorrect current password." },
                }));
                Toast.show({
                    type: "error",
                    text1: "Incorrect Password",
                    text2: "The current password you entered is incorrect.",
                });
                return;
            }
        }

        // **Step 2: Prepare Update Data**
        const updateData = {
            name: editableFields.name,
            email: editableFields.email,
            phone: editableFields.phone,
            completeProfile: {
                businessAddress: editableFields.businessAddress || "",
                town: editableFields.town || "",
                yearsOfExperience: editableFields.yearsOfExperience || "",
                services: editableFields.services.map(service => ({
                    name: service.name,
                    category: service.category,
                    price: parseFloat(service.price) || 0,
                    priceType: service.priceType || "hourly",
                })),
                operatingHours: editableFields.operatingHours || {},
                socialLinks: editableFields.socialLinks || {},
                images: editableFields.images.map(img =>
                    img.replace(/^https?:\/\/[^/]+\//, "").replace(/\\/g, "/")
                ),
            },
        };

        // **Step 3: Include Password Change if Needed**
        if (showPasswordFields) {
            updateData.passwordChange = {
                oldPassword: passwordFields.oldPassword,
                newPassword: passwordFields.newPassword,
            };
        }

        console.log("Sending update request:", updateData);

        // **Step 4: Send Update Request**
        const response = await fetch(
            `http://192.168.8.138:5001/api/auth/update-user/${userDetails.id}`,
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
        if (!response.ok || !data.success) {
            console.log("Update failed:", data);
            throw new Error(data.message || "Failed to update profile");
        }

        console.log("Update successful:", data);

        // **Reset Password Fields After Successful Update**
        setPasswordFields({
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
        });

        setShowPasswordFields(false);
        setEditing(false);
        fetchUserDetails();

        Toast.show({
            type: "success",
            text1: "Success",
            text2: "Profile updated successfully.",
        });

    } catch (error) {
        console.error("Error saving changes:", error);
        Toast.show({
            type: "error",
            text1: "Error",
            text2: error.message || "Failed to save changes.",
        });
        fetchUserDetails();
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
    uri: userDetails?.profileImage && typeof userDetails.profileImage === "string"
      ? `http://192.168.8.138:5001/${userDetails.profileImage.replace(/\\/g, "/")}`
      : "http://192.168.8.138:5001/uploads/default-profile.png",
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

      {showTimePicker && (
  <DateTimePicker
    mode="time"
    value={selectedTime}
    is24Hour={true}
    display="default"
    onChange={(event, date) => {
      if (date) {
        handleTimePickerConfirm(date);
      }
    }}
  />
)}

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
    fontSize: 30,
    fontWeight: "bold",
    color: "#1a237e",
  },
  editButton: {
    backgroundColor: "#E3F2FD",
    padding: 10,
    borderRadius: 12,
  
  },
  field: {
    marginBottom: 24, // Increased spacing for better readability
    marginLeft: -8, // Moves content slightly to the left for proper alignment
    paddingHorizontal: 4, // Adds slight padding to balance spacing
  },
  
  fieldLabel: {
    fontSize: 16, // Slightly larger for better readability
    color: "#444", // Darker color for better contrast
    marginBottom: 6, // Adjusted margin for better spacing
    fontWeight: "600", // Medium weight for clearer labels
    textTransform: "capitalize", // Ensures consistent text format
  },
  
  fieldValue: {
    fontSize: 18, // Slightly larger for better readability
    color: "#222", // Darker for better contrast
    fontWeight: "600", // Makes it stand out more
    backgroundColor: "#F9F9F9", // Light background for emphasis
    paddingVertical: 8, // Adds padding for better spacing
    paddingHorizontal: 12,
    borderRadius: 8, // Adds slight rounding for a softer look
    overflow: "hidden", // Ensures styling is clean
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
    marginVertical: 16,
    paddingHorizontal: -5, // Moves content slightly to the left
  },
  sectionTitle: {
    fontSize: 20, // Slightly larger for better readability
    fontWeight: "bold", // Stronger emphasis
    marginBottom: 14, // More spacing below
    color: "#1a237e", // Uses your primary color
    textTransform: "uppercase", // Adds a modern touch
    letterSpacing: 0.8, // Improves spacing for better legibility
  },
  
  noImagesText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    paddingVertical: 20,
  },
  serviceCard: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    flexDirection: "column",
    position: "relative",
  },
  
  cardContent: {
    paddingRight: 36, // Space for delete button
  },
  
  deleteServiceButton: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#E53935",
    borderRadius: 24,
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 3,
    zIndex: 2,
  },
  
  deleteButtonIcon: {
    color: "#FFFFFF",
    fontSize: 18,
  },
  
  serviceName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a237e",
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  
  serviceDetail: {
    fontSize: 15,
    color: "#5C5C5C",
    marginTop: 6,
    lineHeight: 20,
  },
  
  servicePrice: {
    fontSize: 16,
    color: "#27AE60",
    fontWeight: "700",
    marginTop: 14,
    backgroundColor: "#E8F5E9",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignSelf: "flex-start",
    overflow: "hidden",
  },
  
  // New styles for improved usability and visual appeal
  serviceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  
  serviceType: {
    fontSize: 13,
    color: "#7986CB",
    fontWeight: "600",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  
  divider: {
    height: 1,
    backgroundColor: "#F5F5F5",
    marginVertical: 12,
  },
  
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },

  dayName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a237e',
    width: 95,  // Increased width for full word visibility
    marginRight: -19,  // Adjusted margin for better spacing
  },

  hours: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  closedText: {
    color: '#dc3545',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 10,
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
    justifyContent: 'space-between', // Ensures even spacing
    gap: 10,  // Increased gap for better spacing
    width: '75%', // Ensures proper alignment inside the container
  },

  timeInput: {
    borderWidth: 1,
    borderColor: '#1a237e',
    borderRadius: 8,
    padding: 5,
    minWidth: 75, // Slightly increased width
    alignItems: 'center',
    marginHorizontal: 5, // Adds spacing to avoid touching the edge
  },
  imageContainer: {
    width: 250,
    height: 200,
    marginRight: 15,
    borderRadius: 10,
    position: 'relative',
},
businessImage: {
    width: 250,
    height: 200,
    borderRadius: 10,
    resizeMode: "cover",
},
deleteIconContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
},
noImagesText: {
  textAlign: 'left',
  color: '#555', // Slightly darker for better readability
  fontSize: 17, // Slightly larger for emphasis
  marginTop: -260,
  fontStyle: 'italic',
  paddingHorizontal: 20, // Ensures it doesn't touch screen edges
  lineHeight: 24, // Improves readability
  fontWeight: '500', // Makes it slightly bolder without being too strong
  backgroundColor: 'rgba(0, 0, 0, 0.05)', // Light background for subtle contrast
  paddingVertical: 12, // Adds breathing space
  borderRadius: 10, // Soft rounded edges for a smooth look
},

editingBanner: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#FFF3E0",
  padding: 10,
  borderRadius: 10,
  marginBottom: 10,
  borderLeftWidth: 4,
  borderLeftColor: "#FFC107",
},

editingText: {
  color: "#333",
  fontSize: 14,
  fontWeight: "500",
  marginLeft: 8,
  flex: 1,
},
noServicesText: {
  textAlign: "center",
  color: "#555",
  fontSize: 16,
  fontStyle: "italic",
  paddingVertical: 20,
  backgroundColor: "rgba(0, 0, 0, 0.05)", // Light background for subtle emphasis
  paddingHorizontal: 16,
  borderRadius: 10,
  fontWeight: "500",
},

});

export default UserAccount;