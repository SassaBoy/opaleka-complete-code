import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
  Image,
} from "react-native";
import Toast from "react-native-toast-message";
import { Picker } from "@react-native-picker/picker";
import ModalDateTimePicker from "react-native-modal-datetime-picker";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import ServicesSection101 from "./ServicesSection101";

const CompleteProfileScreen = ({ route, navigation }) => {
  const { email } = route.params;

  const [businessAddress, setBusinessAddress] = useState("");
  const [description, setDescription] = useState("");
  const [services, setServices] = useState([]);
  const [operatingHours, setOperatingHours] = useState({});
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [town, setTown] = useState("");
  const [newService, setNewService] = useState({
    name: "",
    category: "",
    price: "",
    priceType: "",
    description: "", // Add description field
  });
  
  const [socialLinks, setSocialLinks] = useState({
    website: "",
    facebook: "",
    instagram: "",
    linkedin: "",
    twitter: "",
    tiktok: "",
  });
  const [images, setImages] = useState([]);
const [loading, setLoading] = useState(false); // Add loading state

  const [timePicker, setTimePicker] = useState({
    isVisible: false,
    day: "",
    field: "",
  });

  const namibianTowns = [
    "Windhoek",
    "Swakopmund",
    "Walvis Bay",
    "Ondangwa",
    "Rundu",
    "Gobabis",
    "Lüderitz",
    "Otjiwarongo",
    "Oshakati",
    "Katima Mulilo",
    "Rehoboth",
    "Tsumeb",
    "Mariental",
    "Keetmanshoop",
    "Okahandja",
  ];

  const isFormValid = () => {
    return businessAddress && town && yearsOfExperience && services.length > 0;
  };

  const addService = (service) => {
    if (!service.category || !service.name || !service.price || !service.priceType) {
      Alert.alert("Error", "Please fill all fields to add a service.");
      return;
    }
  
    if (services.find((s) => s.name === service.name && s.category === service.category)) {
      Alert.alert("Error", "Service already added in this category.");
      return;
    }
  
    setServices([...services, service]);
    setNewService({ name: "", price: "", priceType: "" });
    setCategory(""); // Reset the category selection
  };
  

  const updateOperatingHours = (day, field, value) => {
    setOperatingHours((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
        isClosed: prev[day]?.isClosed || false, // Ensure `isClosed` is always defined
      },
    }));
  };
  

  const handleTimePickerConfirm = (value) => {
    const { day, field } = timePicker;
    updateOperatingHours(day, field, value.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    setTimePicker({ isVisible: false, day: "", field: "" });
  };

  

  const toggleDayClosed = (day) => {
    setOperatingHours((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        isClosed: !prev[day]?.isClosed,
        start: null,
        end: null,
      },
    }));
  };
  const handleSubmit = async () => {
    if (!isFormValid()) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }
  
    setLoading(true); // Start loading
  
    const profileData = new FormData();
  
    // Append basic fields
    profileData.append("email", email);
    profileData.append("businessAddress", businessAddress);
    profileData.append("yearsOfExperience", yearsOfExperience);
    profileData.append("town", town);
    profileData.append("services", JSON.stringify(services));
    profileData.append("operatingHours", JSON.stringify(operatingHours));
    profileData.append("socialLinks", JSON.stringify(socialLinks));
    profileData.append("description", description);
  
    // Append images
    images.forEach((image, index) => {
      profileData.append("images", {
        uri: image.uri,
        type: "image/jpeg",
        name: `image_${index}.jpg`,
      });
    });
  
    try {
      // Make API call to complete profile
      const response = await axios.post(
        "https://service-booking-backend-eb9i.onrender.com/api/auth/complete-profile",
        profileData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      // If there are custom services, post them separately
      const customServices = services.filter((service) => service.isCustom);
      if (customServices.length > 0) {
        await Promise.all(
          customServices.map((service) =>
            axios.post("https://service-booking-backend-eb9i.onrender.com/api/auth/custom-service", {
              name: service.name,
              category: service.category,
              description: service.description,
            })
          )
        );
      }
  
      // Show success toast
      Toast.show({
        type: "success",
        text1: "Profile Completed",
        text2: "Your account has been successfully created!",
      });
  
      // Navigate to the next screen after a short delay
      setTimeout(() => {
        navigation.navigate("UploadDocuments", { email, profileData: response.data.profile });
      }, 1000); // Add a small delay for better user experience
  
    } catch (error) {
      console.error("Error completing profile:", error.message);
  
      // Show error alert with a fallback message
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to complete profile. Please try again."
      );
  
    } finally {
      setLoading(false); // Stop loading
    }
  };
  
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
    });
    if (!result.canceled) {
      setImages((prev) => [...prev, ...result.assets]);
    }
  };

  const handleServiceSearch = (query) => {
    setSearchQuery(query);
    const filtered = availableServices.filter((service) => {
      const searchString = `${service.name} (${service.category})`.toLowerCase();
      return searchString.includes(query.toLowerCase());
    });
    setFilteredServices(filtered);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Toast />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Icon name="business" size={40} color="#1a237e" />
          <Text style={styles.title}>Complete Your Profile</Text>
        </View>

        <Text style={styles.sectionTitle}>Business Details</Text>
        <View style={styles.inputContainer}>
          <Icon name="location-on" size={20} color="#7F8C8D" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Business Address"
            value={businessAddress}
            onChangeText={setBusinessAddress}
          />
        </View>
        <View style={styles.dropdownContainer}>
          <Picker selectedValue={town} onValueChange={setTown}>
            <Picker.Item label="Select Your Town/City" value="" />
            {namibianTowns.map((townName, index) => (
              <Picker.Item key={index} label={townName} value={townName} />
            ))}
          </Picker>
        </View>
        <View style={[styles.inputContainer, { height: 120, alignItems: "center", paddingTop: 8 }]}>
  <Icon name="info" size={20} color="#7F8C8D" style={[styles.icon, { marginTop: -55 }]} />
  <TextInput
    style={[styles.input, { height: 100, textAlignVertical: "top", paddingTop: 8 }]}
    placeholder="Briefly describe your business (max 100 words)"
    value={description}
    onChangeText={(text) => {
      if (text.split(" ").length <= 50) {
        setDescription(text);
      }
    }}
    multiline
  />
</View>


        <View style={styles.inputContainer}>
          <Icon name="history" size={20} color="#7F8C8D" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Years of Experience"
            value={yearsOfExperience}
            onChangeText={setYearsOfExperience}
            keyboardType="numeric"
          />
        </View>

    
        <Text style={styles.sectionTitle}>Services Offered</Text>
<ServicesSection101 onServicesChange={setServices} />




        <Text style={styles.sectionTitle}>Operating Hours</Text>
        {[...Array(7)].map((_, i) => {
          const day = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][i];
          const isClosed = operatingHours[day]?.isClosed || false;

          return (
            <View key={day} style={styles.hoursRow}>
              <Text style={styles.dayText}>{day}</Text>
              <Switch
                value={isClosed}
                onValueChange={() => toggleDayClosed(day)}
              />
              {!isClosed ? (
                <>
                  <TouchableOpacity
                    style={styles.timeButton}
                    onPress={() => setTimePicker({ isVisible: true, day, field: "start" })}
                  >
                    <Text style={styles.timeButtonText}>
                      {operatingHours[day]?.start || "Start Time"}
                    </Text>
                  </TouchableOpacity>
                  <Text style={styles.toText}>to</Text>
                  <TouchableOpacity
                    style={styles.timeButton}
                    onPress={() => setTimePicker({ isVisible: true, day, field: "end" })}
                  >
                    <Text style={styles.timeButtonText}>
                      {operatingHours[day]?.end || "End Time"}
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                <Text style={styles.closedText}>Closed</Text>
              )}
            </View>
          );
        })}

        <ModalDateTimePicker
          isVisible={timePicker.isVisible}
          mode="time"
          onConfirm={handleTimePickerConfirm}
          onCancel={() => setTimePicker({ isVisible: false, day: "", field: "" })}
        />

        <Text style={styles.sectionTitle}>Social Media Links</Text>
        {["Website", "Facebook", "Instagram", "LinkedIn", "Twitter", "TikTok"].map((platform) => (
          <View key={platform} style={styles.inputContainer}>
            <Icon
              name={platform === "Website" ? "web" : "link"}
              size={20}
              color="#7F8C8D"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder={`Enter your ${platform} link`}
              value={socialLinks[platform.toLowerCase()]}
              onChangeText={(text) =>
                setSocialLinks((prev) => ({
                  ...prev,
                  [platform.toLowerCase()]: text,
                }))
              }
            />
          </View>
        ))}

        <Text style={styles.sectionTitle}>Upload Images</Text>
        <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
          <Text style={styles.uploadButtonText}>Pick Images</Text>
        </TouchableOpacity>
        <ScrollView horizontal>
          {images.map((image, index) => (
            <Image
              key={index}
              source={{ uri: image.uri }}
              style={styles.imagePreview}
            />
          ))}
        </ScrollView>

        <TouchableOpacity
  style={[
    styles.button,
    !isFormValid() && styles.disabledButton,
    loading && { backgroundColor: "#9ea1c7", flexDirection: "row", justifyContent: "center", alignItems: "center" }
  ]}
  onPress={handleSubmit}
  disabled={!isFormValid() || loading}
>
  {loading ? (
    <>
      <Icon name="autorenew" size={20} color="#fff" style={{ marginRight: 10 }} />
      <Text style={styles.buttonText}>Submitting...</Text>
    </>
  ) : (
    <Text style={styles.buttonText}>Complete Profile</Text>
  )}
</TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9ff',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a237e',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a237e',
    marginTop: 20,
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 56,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  icon: {
    marginRight: 12,
    color: '#1a237e',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  dropdownContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 10,
    height: 56,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  hoursRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  dayText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  timeButton: {
    backgroundColor: '#f8f9ff',
    padding: 10,
    borderRadius: 8,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  timeButtonText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  toText: {
    fontSize: 16,
    color: '#666',
    marginHorizontal: 5,
  },
  closedText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E53935',
    marginLeft: 10,
  },
  button: {
    backgroundColor: '#1a237e',
    padding: 16,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledButton: {
    backgroundColor: '#9fa8da',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  servicesDropdown: {
    maxHeight: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    marginBottom: 16,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  uploadButton: {
    backgroundColor: '#1a237e',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  uploadButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  }
});

export default CompleteProfileScreen;
