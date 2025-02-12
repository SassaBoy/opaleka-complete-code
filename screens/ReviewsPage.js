import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const ReviewsPage = ({ navigation }) => {
  const [reviewsData, setReviewsData] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        console.log("Token fetched:", token);
  
        if (!token) {
          Alert.alert("Error", "Authentication failed. Please log in again.");
          navigation.navigate("Login");
          return;
        }
  
        const response = await axios.get(
          "http://192.168.8.138:5001/api/reviews/my-reviews",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        console.log("Reviews Response:", response.data);
  
        if (response.data.success) {
          setReviewsData(response.data.data.reviews || []);
          setAverageRating(response.data.data.averageRating || 0);
        } else {
          Alert.alert("Error", response.data.message || "Failed to fetch reviews.");
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
        Alert.alert("Error", "An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchReviews();
  }, []);
  
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const stars = [];

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Icon key={`star-${i}`} name="star" size={14} color="#FFD700" style={styles.starIcon} />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Icon key={`star-${i}`} name="star-half" size={14} color="#FFD700" style={styles.starIcon} />
        );
      } else {
        stars.push(
          <Icon key={`star-${i}`} name="star-outline" size={14} color="#FFD700" style={styles.starIcon} />
        );
      }
    }
    return stars;
  };

  const renderReviewItem = ({ item }) => (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <View style={styles.reviewerInfo}>
        <Image
  source={{
    uri: item.userId.profileImage
      ? `http://192.168.8.138:5001/${item.userId.profileImage.replace(/\\/g, "/")}`
      : "http://192.168.8.138:5001/uploads/default-profile.png",
  }}
  style={styles.avatar}
/>


          <View style={styles.reviewerDetails}>
            <Text style={styles.reviewerName}>{item.userId.name || "Anonymous"}</Text>
            <View style={styles.ratingContainer}>
              <View style={styles.starsContainer}>{renderStars(item.rating)}</View>
              <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
            </View>
          </View>
        </View>
      </View>

      <Text style={styles.feedbackText}>{item.review}</Text>

      <View style={styles.reviewFooter}>
        <Text style={styles.dateText}>{new Date(item.createdAt).toLocaleDateString()}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reviews</Text>
        <View style={styles.averageRating}>
          <Text style={styles.averageRatingText}>
            Avg. Rating: {averageRating} ★
          </Text>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#1a237e" style={styles.loadingIndicator} />
      ) : (
        <FlatList
          data={reviewsData}
          keyExtractor={(item) => item._id}
          renderItem={renderReviewItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<Text style={styles.emptyText}>No reviews available.</Text>}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6fa", // Slightly softer background
  },
  header: {
    backgroundColor: "#1a237e",
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    elevation: 4,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    flex: 1,
    fontSize: 28,
    fontWeight: "700",
    color: "#ffffff",
  },
  averageRating: {
    backgroundColor: "#ffffff20",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  averageRatingText: {
    fontSize: 14,
    color: "#ffffff",
  },
  listContainer: {
    padding: 16,
    paddingTop: 8,
  },
  reviewCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16, // Slightly larger border radius
    marginBottom: 16, // More space between cards
    padding: 16,
    shadowColor: "#000", // Added shadow for depth
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3, // for Android
  },
  reviewerInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12, // Added margin for better spacing
  },
  avatar: {
    width: 56, // Slightly larger avatar
    height: 56,
    borderRadius: 28,
    marginRight: 16,
    borderWidth: 2, // Added border
    borderColor: "#e0e0e0",
  },
  reviewerName: {
    fontSize: 18, // Increased font size
    fontWeight: "700", // Bolder font weight
    color: "#1a237e",
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f4ff", // Light background for rating
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  starsContainer: {
    flexDirection: "row",
    marginRight: 8,
  },
  starIcon: {
    marginRight: 2,
  },
  ratingText: {
    fontSize: 14,
    color: "#1a237e",
    fontWeight: "600",
  },
  feedbackText: {
    fontSize: 15,
    color: "#333", // Darker text for better readability
    lineHeight: 22,
    marginBottom: 12,
    backgroundColor: "#f9f9fc", // Very light background
    padding: 12,
    borderRadius: 8,
  },
  reviewFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  dateText: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
  },
  loadingIndicator: {
    marginTop: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
    fontStyle: "italic",
  },
});
export default ReviewsPage;
