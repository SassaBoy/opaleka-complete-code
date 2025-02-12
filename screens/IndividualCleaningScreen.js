import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import axios from 'axios';
import jwtDecode from "jwt-decode";

const PRIMARY_COLOR = '#1a237e';
const ICON_COLOR = '#1a237e';

const IndividualCleaningScreen = ({ navigation, route }) => {
  const { name, email, serviceName } = route.params || {};

  const [serviceDetails, setServiceDetails] = useState(null);
  const [selectedFrequency, setSelectedFrequency] = useState('Every Week');
  const [selectedService, setSelectedService] = useState(null);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState('');

  useEffect(() => {
    fetchServiceDetails();
  }, []);

  const fetchServiceDetails = async () => {
    try {
      const response = await axios.get(
        `http://192.168.8.138:5001/api/auth/provider-service`,
        {
          params: { name, email, serviceName },
        }
      );

      if (response.data.success) {
        setServiceDetails(response.data.data);
      } else {
        Alert.alert('Error', response.data.message || 'Failed to fetch service details.');
      }
    } catch (error) {
      console.error('Error fetching service details:', error.message);
      Alert.alert('Error', 'Could not fetch service details. Please try again later.');
    }
  };


  const handleBookService = async () => {
    setLoading(true); // Show loader while booking
    try {
      // Retrieve `authToken` from AsyncStorage
      const token = await AsyncStorage.getItem("authToken");
  
      // Ensure the token exists
      if (!token) {
        Alert.alert("Authentication Error", "You need to log in to book a service.");
        return navigation.navigate("Login");
      }
  
      // Fetch user details from the API
      let userId;
      try {
        const response = await fetch("http://192.168.8.138:5001/api/auth/user-details", {
          headers: {
            Authorization: `Bearer ${token}`, // Include authToken in the headers
          },
        });
  
        if (response.status === 401) {
          Alert.alert("Authentication Error", "Session expired. Please log in again.");
          await AsyncStorage.removeItem("authToken"); // Clear invalid token
          return navigation.navigate("Login");
        }
  
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.user) {
            userId = data.user.id; // Extract the userId
            console.log("Fetched userId from API:", userId);
          } else {
            throw new Error(data.message || "Failed to fetch user details.");
          }
        } else {
          throw new Error("Failed to fetch user details. Please try again.");
        }
      } catch (fetchError) {
        console.error("Error fetching user details:", fetchError.message);
        Alert.alert("Error", "Unable to retrieve user details. Please log in again.");
        return navigation.navigate("Login");
      }
  
      // Ensure `userId` exists
      if (!userId) {
        Alert.alert("Error", "User ID is missing. Please log in again.");
        return navigation.navigate("Login");
      }
  
      // Validate selected service details
      if (!date || !time || selectedService === null) {
        Alert.alert("Incomplete Details", "Please select a service, date, and time.");
        return;
      }
  
      // Get the selected service option
      const selectedOption = calculateOptions()[selectedService];
  
      // Ensure providerId exists in service details
      if (!serviceDetails?.providerId) {
        Alert.alert("Service Provider Error", "Provider details are missing. Please try again later.");
        return;
      }
  
      const bookingData = {
        userId,
        serviceName: selectedOption.name,
        date: date.toISOString(),
        time: time.toISOString(),
        price: selectedOption.price,
        providerId: serviceDetails.providerId,
        address, // Include the address field
      };
      
  
      console.log("Booking Data Sent:", bookingData);
  
      // Make the booking request
      const response = await axios.post(
        "http://192.168.8.138:5001/api/book/book-service",
        bookingData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include authToken in the headers
          },
        }
      );
  
      // Handle response from the backend
      if (response.data.success) {
        Alert.alert("Booking Confirmed", "Your booking was successful!");
        navigation.navigate("ThankYou", {
          date: date.toISOString(),
          time: time.toISOString(),
          selectedService: selectedOption.name,
          price: selectedOption.price,
          providerDetails: serviceDetails, // Pass provider details for ThankYou screen
        });
      } else {
        Alert.alert("Error", response.data.message || "Failed to book the service.");
      }
    } catch (error) {
      console.error("Error booking service:", error.message);
      if (error.response) {
        console.error("Backend Response:", error.response.data);
      }
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    }
  };
  
  
  
  const handleFrequencyChange = (frequency) => {
    setSelectedFrequency(frequency);
    setSelectedService(null); // Reset selected service when frequency changes
  };

  const handleServiceSelect = (index) => {
    setSelectedService(index);
  };

  const handleDateConfirm = (selectedDate) => {
    setDate(selectedDate);
    setDatePickerVisibility(false);
  };

  const handleTimeConfirm = (selectedTime) => {
    setTime(selectedTime);
    setTimePickerVisibility(false);
  };

  const calculateOptions = () => {
    if (!serviceDetails) return [];
    const { price, priceType } = serviceDetails;
    const options = [];
  
    if (priceType === 'hourly') {
      if (selectedFrequency === 'One Time') {
        options.push({
          name: `${serviceName} - One Time (Hourly Rate)`,
          price,
        });
      } else {
        options.push(
          { name: `1 Hour of ${serviceName} ${selectedFrequency.toLowerCase()}`, price: price },
          { name: `2 Hours of ${serviceName} ${selectedFrequency.toLowerCase()}`, price: price * 2 },
          { name: `3 Hours of ${serviceName} ${selectedFrequency.toLowerCase()}`, price: price * 3 },
          { name: `5 Hours of ${serviceName} ${selectedFrequency.toLowerCase()}`, price: price * 5 }
        );
      }
    } else {
      options.push({
        name: `${serviceName} ${selectedFrequency.toLowerCase()}`,
        price,
      });
    }
  
    return options;
  };
  
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{
            uri: serviceDetails?.imageUrl || 'https://via.placeholder.com/300',
          }}
          style={styles.headerImage}
        />
        <View style={styles.curvedBackground} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{serviceName}</Text>
        <View style={styles.ratingContainer}>
  <Text style={styles.rating}>{route.params?.averageRating || 0}</Text>
  <Ionicons name="star" size={24} color="gold" />
  <Text style={styles.reviewCount}>
    {route.params?.reviewCount || 0} {route.params?.reviewCount === 1 ? "review" : "reviews"}
  </Text>
</View>


        <Text style={styles.question}>
          How often would you like {serviceName.toLowerCase()}?
        </Text>
        <View style={styles.frequencyContainer}>
          {['Every Week', 'Bi-Weekly', 'One Time'].map((frequency) => (
            <TouchableOpacity
              key={frequency}
              style={[
                styles.frequencyButton,
                selectedFrequency === frequency
                  ? styles.frequencyButtonSelected
                  : styles.frequencyButtonUnselected,
              ]}
              onPress={() => handleFrequencyChange(frequency)}
            >
              <Text
                style={[
                  styles.frequencyButtonText,
                  selectedFrequency === frequency
                    ? styles.frequencyButtonTextSelected
                    : styles.frequencyButtonTextUnselected,
                ]}
              >
                {frequency}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.sectionTitle}>Suggested services</Text>
        <View style={styles.serviceContainer}>
          {calculateOptions().map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.serviceItem,
                selectedService === index && styles.serviceItemSelected,
              ]}
              onPress={() => handleServiceSelect(index)}
            >
              <Text
                style={[
                  styles.serviceTitle,
                  selectedService === index
                    ? styles.serviceTitleSelected
                    : styles.serviceTitleUnselected,
                ]}
              >
                {option.name}
              </Text>
              <Text
                style={[
                  styles.servicePrice,
                  selectedService === index
                    ? styles.servicePriceSelected
                    : styles.servicePriceUnselected,
                ]}
              >
                N${option.price}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.sectionTitle}>Select Date & Time</Text>
        <View style={styles.pickerContainer}>
          <TouchableOpacity
            onPress={() => setDatePickerVisibility(true)}
            style={styles.pickerField}
          >
            <Ionicons name="calendar" size={24} color={ICON_COLOR} />
            <Text style={styles.pickerText}>
              {date ? new Date(date).toLocaleDateString() : 'Select Date'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setTimePickerVisibility(true)}
            style={styles.pickerField}
          >
            <Ionicons name="time" size={24} color={ICON_COLOR} />
            <Text style={styles.pickerText}>
              {time ? new Date(time).toLocaleTimeString() : 'Select Time'}
            </Text>

       

          </TouchableOpacity>
          
        </View>
        <Text style={styles.sectionTitle}>Enter Your Address</Text>
<View style={styles.pickerContainer}>
  <View style={styles.addressField}>
    <Ionicons name="location" size={24} color={ICON_COLOR} />
    <TextInput
      style={styles.addressInput}
      placeholder="Enter your address"
      placeholderTextColor="#888"
      value={address}
      onChangeText={setAddress}
    />
  </View>
</View>
        {loading && (
  <View style={styles.loadingOverlay}>
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#1a237e" />
      <Text style={styles.loadingText}>Processing your booking...</Text>
    </View>
  </View>
)}

<TouchableOpacity 
  style={[
    styles.checkButton, 
    (!date || !time || selectedService === null || address.trim() === '') && { backgroundColor: '#ccc' }
  ]} 
  onPress={handleBookService} 
  disabled={loading || !date || !time || selectedService === null || address.trim() === ''}
>
  <Text style={styles.checkButtonText}>Book</Text>
</TouchableOpacity>




        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleDateConfirm}
          onCancel={() => setDatePickerVisibility(false)}
        />
        <DateTimePickerModal
          isVisible={isTimePickerVisible}
          mode="time"
          onConfirm={handleTimeConfirm}
          onCancel={() => setTimePickerVisibility(false)}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FB',
  },
  header: {
    position: 'relative',
    height: 250,
  },
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  curvedBackground: {
    position: 'absolute',
    bottom: -25, // Lowered the curve to slice below the image
    width: '100%',
    height: 50,
    backgroundColor: '#F7F9FB',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    zIndex: 1,
  },
  content: {
    padding: 20,
    zIndex: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4F4F4F',
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  rating: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4F4F4F',
    marginRight: 5,
  },
  reviewCount: {
    fontSize: 16,
    color: '#4F4F4F',
    marginLeft: 5,
  },
  question: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4F4F4F',
    marginBottom: 20,
    textAlign: 'center',
  },
  frequencyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  frequencyButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  frequencyButtonSelected: {
    backgroundColor: '#1a237e',
    borderColor: '#1a237e',
  },
  frequencyButtonUnselected: {
    backgroundColor: '#f0f0f0',
  },
  frequencyButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  frequencyButtonTextSelected: {
    color: '#fff',
  },
  frequencyButtonTextUnselected: {
    color: '#000',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4F4F4F',
    marginBottom: 20,
  },
  serviceContainer: {
    marginBottom: 30,
  },
  serviceItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 10,
    borderRadius: 10,
    paddingLeft: 20,
  },
  serviceItemSelected: {
    backgroundColor: '#1a237e',
  },
  serviceTitle: {
    fontSize: 18,
  },
  serviceTitleSelected: {
    color: '#fff',
  },
  serviceTitleUnselected: {
    color: '#4F4F4F',
  },
  servicePrice: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  servicePriceSelected: {
    color: '#fff',
  },
  servicePriceUnselected: {
    color: '#1a237e',
  },
  serviceDiscount: {
    fontSize: 14,
  },
  serviceDiscountSelected: {
    color: '#fff',
  },
  serviceDiscountUnselected: {
    color: 'green',
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  pickerField: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  pickerText: {
    fontSize: 16,
    color: '#4F4F4F',
    marginLeft: 10,
    width: '80%',
  },
  checkButton: {
    backgroundColor: '#1a237e',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  checkButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(26, 35, 126, 0.95)", // Using your PRIMARY_COLOR with opacity
    zIndex: 999,
  },
  
  loadingContainer: {
    backgroundColor: "white",
    padding: 30,
    borderRadius: 16,
    alignItems: "center",
    width: '80%',
    maxWidth: 300,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#1a237e",
    fontWeight: "500",
    textAlign: "center",
    letterSpacing: 0.5,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
  },
});

export default IndividualCleaningScreen;
