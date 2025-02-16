import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const RateServiceProviderPage = ({ navigation, route }) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  // Extract service provider details from route params
  const {
    providerName = "Service Provider", // Default value if undefined
    avatar = "https://via.placeholder.com/150", // Fallback image
    serviceName = "Service Name",
    bookingId,
    totalPrice = "N/A",
  } = route.params || {};

  // Validate route parameters
  if (!bookingId) {
    navigation.navigate("Home");
    return null;
  }

  const handleRatingPress = (value) => setRating(value);

  const handleSubmit = async () => {
    if (!rating) {
      Alert.alert("Please select a rating.");
      return;
    }
    if (!feedback.trim()) {
      Alert.alert("Please provide your feedback.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        navigation.navigate("Login");
        return;
      }

      const response = await axios.post(
        "https://service-booking-backend-eb9i.onrender.com/api/reviews/submit",
        { bookingId, rating, review: feedback },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        navigation.reset({
          index: 0,
          routes: [{ name: "Home" }],
        }); // Ensure user doesn't get sent back to the review screen
      }
      else {
        Alert.alert("Error", response.data.message || "Failed to submit review.");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "An error occurred while submitting the review."
      );
    }
  };

  const handleNotNow = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
  
      // Check if the token is available
      if (!token) {
        navigation.navigate("Login");
        return;
      }
  
      // Send the request to the server to skip the review
      const response = await axios.post(
        `https://service-booking-backend-eb9i.onrender.com/api/reviews/skip`,
        { bookingId }, // Pass the bookingId to identify the specific booking
        { headers: { Authorization: `Bearer ${token}` } } // Pass the token in the headers
      );
  
      // Handle server response
      if (response.data.success) {
        navigation.navigate("Home"); // Navigate the user back to the Home screen
      } else {
        Alert.alert(
          "Error",
          response.data.message || "Failed to skip the review. Please try again."
        );
      }
    } catch (error) {
      console.error("Error skipping review:", error);
  
      // Handle specific error response from the server
      Alert.alert(
        "Error",
        error.response?.data?.message || "An error occurred while skipping the review. Please try again."
      );
    }
  };
  

  const renderStars = (currentRating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => handleRatingPress(i)}
          activeOpacity={0.8}
        >
          <Icon
            name={i <= currentRating ? "star" : "star-outline"}
            size={32}
            color="#FFD700"
            style={styles.starIcon}
          />
        </TouchableOpacity>
      );
    }
    return stars;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rate Service Provider</Text>
      </View>

      {/* Service Provider Profile Section */}
      <View style={styles.profileSection}>
        <Image
          source={{
            uri: avatar && avatar.startsWith("http")
              ? avatar
              : `https://service-booking-backend-eb9i.onrender.com/${avatar.replace(/\\/g, "/") || "uploads/default-profile.png"}`,
          }}
          style={styles.avatar}
        />

        <View style={styles.providerDetails}>
          <Text style={styles.providerName}>{providerName}</Text>
          <Text style={styles.serviceText}>{serviceName}</Text>
          <Text style={styles.priceText}>NAD {totalPrice}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Your Rating</Text>
        <View style={styles.starsContainer}>{renderStars(rating)}</View>

        <Text style={styles.sectionTitle}>Your Feedback</Text>
        <TextInput
          style={styles.feedbackInput}
          placeholder="Write your feedback..."
          value={feedback}
          onChangeText={setFeedback}
          multiline
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.notNowButton} onPress={handleNotNow}>
          <Text style={styles.notNowButtonText}>Not Now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9ff",
  },
  header: {
    backgroundColor: "#1a237e",
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 16,
    margin: 16,
    borderRadius: 12,
    elevation: 2,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 16,
  },
  providerDetails: {
    flex: 1,
  },
  providerName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a237e",
  },
  serviceText: {
    fontSize: 16,
    color: "#4F4F4F",
    marginVertical: 4,
  },
  priceText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a237e",
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a237e",
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  starIcon: {
    marginHorizontal: 4,
  },
  feedbackInput: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    height: 100,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: "#1a237e",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  submitButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
  notNowButton: {
    backgroundColor: "#e0e0e0",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  notNowButtonText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
  },
});

export default RateServiceProviderPage;