import React, { useState, useEffect } from "react";
import { Platform } from "react-native";


import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Modal,
  Dimensions,
  RefreshControl,
  LogBox,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { LinearGradient } from 'expo-linear-gradient';
import Swiper from "react-native-swiper";
const { width } = Dimensions.get('window');
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import * as ImagePicker from "expo-image-picker";
import QuickTips from "./QuickTips";
import axios from "axios";
const HomeScreen = ({ navigation, route }) => {
  const [userDetails, setUserDetails] = useState(null); // Store user details
  const [location, setLocation] = useState("Namibia"); // Default location
  const [averageRating, setAverageRating] = useState(0); // Initialize with a default value

  const trialDaysLeft = 5;

  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [bottomSidebarVisible, setBottomSidebarVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [categories, setCategories] = useState([])
  const [services, setServices] = useState([]); // Store fetched services
  const [filteredServices, setFilteredServices] = useState([]); // Store filtered services
  const [earningsModalVisible, setEarningsModalVisible] = useState(false);
  const [pendingBookingsCount, setPendingBookingsCount] = useState(0);
  const [imageError, setImageError] = useState(false);


  LogBox.ignoreAllLogs();


  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("authToken");
      // Set both states to null/false simultaneously to prevent flash
      setIsLoggedIn(false);
      setUserDetails(null);
      navigation.navigate("Home", {
        role: "Client",
      });
    } catch (error) {
      console.error("Error during logout:", error);
      Toast.show({
        type: "error",
        text1: "Logout Failed",
        text2: "Something went wrong. Please try again.",
      });
    }
  };

  const fetchPendingBookingsCount = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await fetch(
        `https://service-booking-backend-eb9i.onrender.com/api/book/provider/bookings/pending`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      if (response.ok) {
        const data = await response.json();
        setPendingBookingsCount(data.bookings?.length || 0); // Update count
      } else {
        console.error("Failed to fetch pending bookings count:", response.status);
      }
    } catch (error) {
      console.error("Error fetching pending bookings count:", error.message);
    }
  };
  
  const handleLoginRedirect = () => {
    navigation.navigate("Welcome"); 
  };

  const sidebarLinks = [];

  if (isLoggedIn) {
    if (userDetails?.role === "Provider") {
      sidebarLinks.push({
        icon: "credit-card",
        title: "Payment Method",
        onPress: () => {
          setSidebarVisible(false);
          navigation.navigate("PaymentMethodScreen");
        },
      });
    }
  
    if (userDetails?.role === "Client") {
      sidebarLinks.push({
        icon: "history",
        title: "History",
        onPress: () => {
          setSidebarVisible(false);
          navigation.navigate("History");
        },
      });
    }
  
    sidebarLinks.push(
      {
        icon: "help-outline",
        title: "Support",
        onPress: () => {
          setSidebarVisible(false);
          navigation.navigate("Support");
        },
      },
      {
        icon: "settings",
        title: "Settings",
        onPress: () => {
          setSidebarVisible(false);
          navigation.navigate("Settings");
        },
      },
      {
        icon: "notifications",
        title: "Notifications",
        onPress: () => {
          setSidebarVisible(false);
          navigation.navigate("NotificationsPage");
        },
        badge: unreadNotifications > 0 ? unreadNotifications : null,
      },
      {
        icon: "logout",
        title: "Log Out",
        onPress: () => {
          setSidebarVisible(false);
          handleLogout();
        },
      }
    );
  } else {
    sidebarLinks.push(
      {
        icon: "help-outline",
        title: "Support",
        onPress: () => {
          setSidebarVisible(false);
          navigation.navigate("Support");
        },
      },
      {
        icon: "login",
        title: "Login",
        onPress: () => {
          setSidebarVisible(false);
          handleLoginRedirect();
        },
      }
    );
  }
  

    const fetchCategories = async () => {
      try {
        const response = await fetch(`https://service-booking-backend-eb9i.onrender.com/api/auth/services`); // Fetch all services
        const data = await response.json();
        if (data.success && data.services) {
          // Group services by category
          const groupedCategories = data.services.reduce((acc, service) => {
            if (!acc[service.category]) {
              acc[service.category] = {
                category: service.category,
                color: service.color,
                icon: service.icon,
                services: [],
              };
            }
            acc[service.category].services.push(service);
            return acc;
          }, {});
    
          setCategories(Object.values(groupedCategories)); // Convert object to array
        } else {
          console.error("Failed to fetch categories:", data.message);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    
    const fetchCategories1 = async () => {
      try {
        const response = await fetch(`https://service-booking-backend-eb9i.onrender.com/api/auth/services`); // Fetch all services
        const data = await response.json();
        if (data.success && data.services) {
          setServices(data.services); // Store all services
          setFilteredServices(data.services); // Initialize filtered services
        } else {
          console.error("Failed to fetch services:", data.message);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    
    
    // Fetch categories on component mount
    useEffect(() => {
      fetchCategories();
      fetchCategories1();
      fetchPendingBookingsCount();
      handleRefresh();
      
    }, []);


    

  const adverts = [
    {
      id: 1,
      image: "https://th.bing.com/th/id/OIP.ottWEsnX5Vn6Fi0BkqgXRgHaDB?w=1349&h=550&rs=1&pid=ImgDetMain",
      title: "Special Discount on Cleaning Services!",
      description: "Get 20% off on all cleaning services this month.",
    },
    {
      id: 2,
      image: "https://www.belocooling.com/assets/sub-banner/banner-plumbing.2405211059550.jpg",
      title: "Plumbing Emergency? We've Got You Covered!",
      description: "Fast and reliable plumbing services available 24/7.",
    },
    {
      id: 3,
      image: "https://th.bing.com/th/id/OIP.0dRTQ7150YkOkFH89Y8CVQAAAA?w=474&h=170&rs=1&pid=ImgDetMain",
      title: "Enhance Your Skills with Our Tutoring Services!",
      description: "Affordable tutoring for all age groups.",
    },
  ];

  const quickActions = [
    {
      title: "Balance: NAD 200.00",
      icon: "account-balance-wallet",
      colors: ['#009688', '#00796B'], // Sophisticated teal gradient (modern financial feel)
      onPress: null,
      isDisabled: true,
    },
    {
      title: "View Bookings",
      icon: "people",
      colors: ['#673AB7', '#512DA8'], // Royal purple gradient (associated with premium services)
      onPress: () => navigation.navigate("ViewBookingsPage"),
    },
    {
      title: "View Reviews",
      icon: "star",
      colors: ['#FFC107', '#FFA000'], // Warm amber gradient (evokes star ratings/gold)
      onPress: () => navigation.navigate("ReviewsPage"),
    },
    {
      title: "Settings",
      icon: "settings",
      colors: ['#607D8B', '#455A64'], // Professional slate blue (neutral tech association)
      onPress: () => navigation.navigate("Settings")
    }
];
  
  
  const fetchUserDetails = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        setIsLoggedIn(false);
        setUserDetails(null);
        setLoading(false);
        return;
      }
  
      const response = await fetch(
        `https://service-booking-backend-eb9i.onrender.com/api/auth/user-details`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.status === 401) {
        await AsyncStorage.removeItem("authToken");
        setIsLoggedIn(false);
        setUserDetails(null);
        return;
      }
  
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          setIsLoggedIn(true);
          setUserDetails(data.user);
        }
      }
    } catch (error) {
      console.log("Error fetching user details:", error.message);
    } finally {
      setLoading(false);
    }
  };
  
  
  const fetchNotificationCount = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token || !isLoggedIn) return; // Ensure user is logged in
  
      const response = await fetch(
        `https://service-booking-backend-eb9i.onrender.com/api/auth/notifications/unread-count`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.ok) {
        const data = await response.json();
        setUnreadNotifications(data.unreadCount);
      } else {
        console.error("Failed to fetch unread notification count:", response.status);
      }
    } catch (error) {
      console.error("Error fetching unread notification count:", error);
    }
  };
  
  useEffect(() => {
    const checkPendingReviews = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
  
        if (!token) return;
  
        const response = await axios.get(
          "https://service-booking-backend-eb9i.onrender.com/api/reviews/bookings/pending-rating",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        if (response.data.success && response.data.data.length > 0) {
          const firstBooking = response.data.data[0];
  
          navigation.navigate("RateServiceProviderPage", {
            bookingId: firstBooking._id,
            providerName: firstBooking.providerId?.name || "Unknown Provider",
            avatar: firstBooking.providerId?.profileImage 
  ? `https://service-booking-backend-eb9i.onrender.com/${firstBooking.providerId.profileImage.replace(/\\/g, "/")}` 
  : "https://service-booking-backend-eb9i.onrender.com/uploads/default-profile.png",

            serviceName: firstBooking.serviceName,
            totalPrice: firstBooking.price || "N/A",
          });
        }
      } catch (error) {
        console.error("Error checking pending reviews:", error);
      }
    };
  
    fetchNotificationCount();
    fetchUserDetails();
    fetchCurrentLocation();
    checkPendingReviews();
  }, []);
  

  useEffect(() => {
    const fetchAverageRating = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) return;
  
        const response = await axios.get(
          "https://service-booking-backend-eb9i.onrender.com/api/reviews/my-reviews",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
  
        if (response.data.success) {
          setAverageRating(response.data.data.averageRating || 0);
        } else {
          console.error("Failed to fetch average rating:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching average rating:", error);
      }
    };
  
    fetchAverageRating();
  }, []);
  
useEffect(() => {
  if (isLoggedIn) {
    const interval = setInterval(() => {
      fetchNotificationCount(); // Poll the server for notification count
    }, 10000); // Fetch notifications every 10 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }
}, [isLoggedIn]); // Add isLoggedIn as a dependency


const handleSearch = (query) => {
  setSearchQuery(query); // Update the search query
  if (query.trim() === "") {
    setFilteredServices([]); // Clear filtered services if no input
    return;
  }
  const filtered = services.filter((service) =>
    `${service.name.toLowerCase()} (${service.category.toLowerCase()})`.includes(query.toLowerCase())
  );
  setFilteredServices(filtered); // Update filtered services
};


const handleRefresh = async () => {
  setRefreshing(true);
  try {
    await fetchUserDetails();
    await fetchCategories1();
    await fetchPendingBookingsCount();
    if (!isLoggedIn) {
      setUserDetails(null);
    }
    
  } catch (error) {
    console.error("Error during refresh:", error);
  } finally {
    setRefreshing(false);
  }
};


  

const getProfileImageUrl = (profileImage) => {
  if (!profileImage) {
    return "https://service-booking-backend-eb9i.onrender.com/uploads/default-profile.png";
  }

  const cleanPath = profileImage.replace(/\\/g, "/");

  if (cleanPath.startsWith("http")) {
    return cleanPath;
  }

  const imagePath = cleanPath.startsWith("uploads/")
    ? cleanPath.substring(7)
    : cleanPath;

  return `https://service-booking-backend-eb9i.onrender.com/uploads/${imagePath}`;
};

  const fetchCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.warn("Location permission denied");
        return;
      }
  
      const currentPosition = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = currentPosition.coords;
      const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
  
      // Extract city and country separately
      const city = geocode[0]?.city || "Unknown City";
      const country = geocode[0]?.country || "Unknown Country";
      const fullLocation = `${city}, ${country}`;
  
      // ✅ Keep full location in state
      setLocation(fullLocation);
  
      // ✅ Store only the city in AsyncStorage
      console.log("🔹 Storing only city in AsyncStorage:", city);
      await AsyncStorage.setItem("userLocation", city);
  
      // ✅ Verify storage
      const savedLocation = await AsyncStorage.getItem("userLocation");
      console.log("✅ Retrieved from AsyncStorage:", savedLocation);
    } catch (error) {
      console.error("Error fetching location:", error);
      setLocation("Unknown City, Unknown Country"); // Fallback value
    }
  };
  
  
  const renderView = () => {
    if (loading) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Loading...</Text>
        </View>
      );
    }
  
    // If logged in and role is Provider, show provider view
    if (isLoggedIn && userDetails?.role === "Provider") {
      return renderProviderView();
    }
  
    // In all other cases (not logged in, or logged in as client), show client view
    return renderClientView();
  };
  
  const pickImageFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });
  
      console.log("Image Picker Result:", result);
      if (!result.canceled && result.assets && result.assets[0]?.uri) {
        uploadProfilePicture(result.assets[0].uri); // Pass the correct URI
      } else {
        console.error("Image selection canceled or invalid result.");
      }
    } catch (error) {
      console.error("Error picking image from gallery:", error);
    }
  };
  
  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });
  
      console.log("Camera Result:", result);
      if (!result.canceled && result.assets && result.assets[0]?.uri) {
        uploadProfilePicture(result.assets[0].uri); // Pass the correct URI
      } else {
        console.error("Photo capture canceled or invalid result.");
      }
    } catch (error) {
      console.error("Error taking photo:", error);
    }
  };
 

  const uploadProfilePicture = async (uri) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) throw new Error("Authentication token is missing.");
  
      if (!userDetails || !userDetails.id) throw new Error("User details are missing or invalid.");
  
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
  
      // Check response type and status
      const rawText = await response.text();
      console.log("Raw Response Text:", rawText);
  
      if (!response.ok) throw new Error(`Server Error: ${response.status}`);
  
      const data = JSON.parse(rawText); // Parse only if JSON
      console.log("Parsed Backend Response:", data);
  
      Toast.show({
        type: "success",
        text1: "Profile Updated",
        text2: "Your profile picture has been updated.",
      });
      
      setUserDetails((prev) => ({
        ...prev,
        profileImage: data.profileImage,
      }));
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
  
  
  const renderSidebar = () => (
  <LinearGradient
    colors={['#1a237e', '#0d144b']}
    style={styles.sidebar}
  >
    <TouchableOpacity
      style={styles.closeSidebarButton}
      onPress={() => setSidebarVisible(false)}
    >
      <Icon name="close" size={24} color="#fff" />
    </TouchableOpacity>
    <View style={styles.sidebarHeader}>
      {/* Profile Image */}
      <TouchableOpacity
        onPress={() => {
          if (isLoggedIn) {
            setSidebarVisible(false); // Close the current sidebar
            setBottomSidebarVisible(true); // Open the bottom sidebar for profile image update
          }
        }}
        disabled={!isLoggedIn} // Disable click when logged out
      >
<Image
  source={{
    uri: userDetails?.profileImage
      ? `https://service-booking-backend-eb9i.onrender.com/${userDetails.profileImage}`
      : "https://service-booking-backend-eb9i.onrender.com/uploads/default-profile.png",
  }}
  style={styles.profileImage1}
/>


      </TouchableOpacity>

      {/* Username */}
      <TouchableOpacity
        onPress={() => {
          if (isLoggedIn) {
            setSidebarVisible(false); // Close the sidebar
            navigation.navigate("UserAccount", {
              userId: userDetails?.id,
              role: userDetails?.role,
            });
          }
        }}
        disabled={!isLoggedIn} // Disable click when logged out
      >
        <Text style={styles.sidebarName}>
          {userDetails?.name || "Opaleka"}
        </Text>
      </TouchableOpacity>
      <Text style={styles.sidebarRole}>
        {isLoggedIn ? userDetails?.role : "Guest"}
      </Text>
    </View>

    {/* Sidebar Links */}
    {sidebarLinks.map((link, index) => (
      <TouchableOpacity
        key={index}
        style={styles.sidebarLink}
        onPress={link.onPress}
      >
        <Icon name={link.icon} size={24} color="#fff" />
        <Text style={styles.sidebarLinkText}>{link.title}</Text>
        {link.badge && (
  <View style={styles.notificationBadge}>
    <Text style={styles.notificationBadgeText}>{link.badge}</Text>
  </View>
)}

      </TouchableOpacity>
    ))}
  </LinearGradient>
);

const renderEarningsModal = () => (
  <Modal
    visible={earningsModalVisible}
    animationType="slide"
    transparent
    onRequestClose={() => setEarningsModalVisible(false)}
  >
    <View style={styles.bottomSidebarOverlay}>
      <View style={styles.bottomSidebar}>
        <Text style={styles.bottomSidebarTitle}>Start Earning with Opaleka</Text>
        <Text style={styles.modalContent}>
  <View style={styles.stepContainer}>
    <View style={styles.numberIndicator}>
      <Text style={styles.numberText}>1</Text>
    </View>
    <Text>Complete your profile with accurate details.{"\n"}</Text>
  </View>
  <View style={styles.stepContainer}>
    <View style={styles.numberIndicator}>
      <Text style={styles.numberText}>2</Text>
    </View>
    <Text>Set your availability and services.{"\n"}</Text>
  </View>
  <View style={styles.stepContainer}>
    <View style={styles.numberIndicator}>
      <Text style={styles.numberText}>3</Text>
    </View>
    <Text>Respond promptly to client requests.{"\n"}</Text>
  </View>
  <View style={styles.stepContainer}>
    <View style={styles.numberIndicator}>
      <Text style={styles.numberText}>4</Text>
    </View>
    <Text>Provide excellent services to earn positive reviews and more bookings.</Text>
  </View>
</Text>
      
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => setEarningsModalVisible(false)}
        >
          <Icon name="check-circle" size={24} color="#1a237e" />
          <Text style={styles.optionText}>Got it</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

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
            <Icon name="photo-library" size={24} color="#1a237e" />
            <Text style={styles.optionText}>Choose from Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={takePhoto}
          >
            <Icon name="camera" size={24} color="#1a237e" />
            <Text style={styles.optionText}>Take a Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => setBottomSidebarVisible(false)}
          >
            <Icon name="close" size={24} color="red" />
            <Text style={styles.optionText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
  
  const renderClientView = () => (
    <ScrollView style={styles.mainContent} 
    refreshControl={
      <RefreshControl
        refreshing={refreshing}
        onRefresh={handleRefresh}
        colors={["#00AEEF"]} // Customize indicator color
      />
    }
    >
      {trialDaysLeft > 0 && (
        <LinearGradient
          colors={['#1a237e', '#0d144b']}
          style={styles.trialBanner}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <View style={styles.trialContent}>
            <Icon name="star" size={24} color="#FFD700" />
            <Text style={styles.trialText}>
              You can start earning
            </Text>
          </View>
          <TouchableOpacity
            style={styles.upgradeButton}
            onPress={() => setEarningsModalVisible(true)}

          >
            <Text style={styles.upgradeText}>Check How</Text>
          </TouchableOpacity>
        </LinearGradient>
      )}
<View style={styles.searchContainer}>
  <View style={styles.searchBar}>
    <Icon name="search" size={24} color="#666" />
    <TextInput
      style={styles.searchInput}
      placeholder="Search for a service"
      placeholderTextColor="#666"
      value={searchQuery}
      onChangeText={handleSearch}
    />
  </View>
  {searchQuery.trim() !== "" && (
    <View style={styles.searchResultsContainer}>
      {filteredServices.length > 0 ? (
        <ScrollView style={styles.servicesDropdown}>
          {filteredServices.map((service) => (
      <TouchableOpacity 
      key={service._id} 
      style={styles.serviceOption}
      onPress={() => {
        navigation.navigate("LoadingScreen", {
          service
        });
        setSearchQuery(""); // Clear search after selection
      }}
    >
      <Text style={styles.serviceText}>
        {service.name} ({service.category})
      </Text>
    </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <Text style={styles.noResultsText}>No matches found</Text>
      )}
    </View>
  )}
</View>



      <Text style={styles.sectionTitle}>Categories</Text>
      <ScrollView
  horizontal
  showsHorizontalScrollIndicator={false}
  style={styles.categoriesScroll}
>
  {categories.map((category, index) => (
    <TouchableOpacity
      key={category._id || index} // Use _id if available, fallback to index
      style={[
        styles.categoryCard,
        selectedCategory === category.category && styles.selectedCategory,
      ]}
      onPress={async () => {
        setSelectedCategory(category.category);
        try {
          const response = await fetch(
            `https://service-booking-backend-eb9i.onrender.com/api/auth/services?category=${encodeURIComponent(category.category)}` // Fetch services by category name
          );
          const data = await response.json();
          if (data.success && data.services) {
            navigation.navigate("ServicesPage", {
              categoryName: category.category,
              services: data.services,
            });
          } else {
            console.error("Failed to fetch services:", data.message);
          }
        } catch (error) {
          console.error("Error fetching services:", error);
        }
        
      }}
    >
      <View>
        <LinearGradient
          colors={[category.color, shadeColor(category.color, -20)]}
          style={styles.categoryGradient}
        >
          <Icon name={category.icon} size={32} color="#fff" />
        </LinearGradient>
        <Text style={styles.categoryName}>{category.category}</Text>
      </View>
    </TouchableOpacity>
  ))}
</ScrollView>



      <Text style={styles.sectionTitle}>Highlights</Text>
      <View style={styles.advertContainer}>
        <Swiper
          style={styles.adSwiper}
          autoplay
          autoplayTimeout={5}
          showsPagination
          dotStyle={styles.dot}
          activeDotStyle={styles.activeDot}
          paginationStyle={styles.pagination}
        >
          {adverts.map((ad) => (
            <View key={ad.id} style={styles.adCard}>
              <Image source={{ uri: ad.image }} style={styles.adImage} />
              <View style={styles.adContent}>
                <Text style={styles.adTitle}>{ad.title}</Text>
                <Text style={styles.adDescription}>{ad.description}</Text>
              </View>
            </View>
          ))}
        </Swiper>
      </View>
    </ScrollView>
  );

  const renderProviderView = () => (
    <ScrollView style={styles.mainContent}
    refreshControl={
      <RefreshControl
        refreshing={refreshing}
        onRefresh={handleRefresh}
        colors={["#00AEEF"]} // Customize indicator color
      />
    }
    >
      <LinearGradient
        colors={['#1a237e', '#0d144b']}
        style={styles.providerDashboard}
      >
        <View style={styles.dashboardHeader}>
          <View>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={[styles.providerName, { color: '#fff' }]}>{userDetails?.name || "Opaleka"}</Text>
          </View>
          <View style={styles.statsContainer}>
          <View style={styles.statItem}>
  <Text style={styles.statNumber}>{pendingBookingsCount}</Text>
  <Text style={styles.statLabel}>Pending Bookings</Text>
</View>

{averageRating !== undefined && (
  <View style={styles.statItem}>
    <Text style={styles.statNumber}>{averageRating.toFixed(1)}</Text>
    <Text style={styles.statLabel}>Rating</Text>
  </View>
)}


          </View>
        </View>
      </LinearGradient>

      <View style={styles.quickActions}>
        {quickActions.map((action, index) => (
          <TouchableOpacity
            key={index}
            style={styles.actionButton}
            onPress={action.onPress}
          >
            <LinearGradient
              colors={action.colors}
              style={styles.actionGradient}
            >
              <Icon name={action.icon} size={32} color="#fff" />
              <Text style={styles.actionText}>{action.title}</Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>



      <QuickTips />

    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Modal
        visible={sidebarVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setSidebarVisible(false)}
      >
        <View style={styles.modalOverlay}>
          {renderSidebar()}
        </View>
      </Modal>
      {renderBottomSidebar()}
      {renderEarningsModal()}
      <View style={styles.header}>
  <TouchableOpacity
    style={styles.menuButton}
    onPress={() => setSidebarVisible(true)}
  >
    <Icon name="menu" size={28} color="#333" />
  </TouchableOpacity>
  <View style={styles.headerCenter}>
    <Text style={styles.appTitle}>{userDetails?.name || "Opaleka"}</Text>
    <Text style={styles.location}>{location}</Text>
  </View>
  <TouchableOpacity style={styles.profileButton}>
  <Image
    source={{
      uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Flag_of_Namibia.svg/1920px-Flag_of_Namibia.svg.png",
    }}
    style={styles.profileImage}
    onError={(error) => {
      console.log("Image loading error:", error);
    }}
  />
</TouchableOpacity>

</View>


{renderView()}

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  menuButton: {
    padding: 8,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    marginTop: 50,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a237e',
  },
  location: {
    fontSize: 12,
    color: '#666',
  },
  profileButton: {
    padding: 8,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#1a237e',
  },
  profileImage1: {
    width: 100,
    height: 100,
    borderRadius: 50, // Half of width & height to make it a perfect circle
    borderWidth: 2,
    borderColor: '#1a237e',
    overflow: 'hidden', // Ensures it stays within the circle
  },  
  mainContent: {
    flex: 1,
  },
  searchContainer: {
    padding: 16,
    zIndex: 2, // Add this to ensure proper layering
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    borderRadius: 25, // More rounded corners
    height: 50,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  categoriesScroll: {
    paddingLeft: 16,
    marginBottom: 24,
  },
  categoryCard: {
    marginRight: 16,
    alignItems: 'center',
    width: 100,
  },
  selectedCategory: {
    transform: [{ scale: 1.05 }],
  },
  categoryGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  advertContainer: {
    height: 220,
    marginBottom: 24,
  },
  adSwiper: {
    height: 200,
  },
  adCard: {
    marginHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  adImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  adContent: {
    padding: 12,
  },
  adTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  adDescription: {
    fontSize: 14,
    color: '#666',
  },
  dot: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
  activeDot: {
    backgroundColor: '#1a237e',
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 3,
  },
  pagination: {
    bottom: -20,
  },
  // Provider Dashboard Styles
  providerDashboard: {
    padding: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  dashboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: 24,
  },
  statItem: {
    marginLeft: 24,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    marginTop: 10,
    justifyContent: 'space-between', // Add this
  },
  actionButton: {
    width: '48%', // Change from (width - 48) / 2
    height: 120, // Add this
    marginBottom: 20,

  },
  actionGradient: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center', // Add this
    height: '100%', // Add this
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
  },
  upcomingBookings: {
    padding: 16,
  },
  bookingCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bookingTime: {
    width: 80,
    borderRightWidth: 1,
    borderRightColor: '#eee',
    paddingRight: 12,
    justifyContent: 'center',
  },
  timeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a237e',
  },
  bookingDetails: {
    flex: 1,
    marginLeft: 12,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  serviceType: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  // Sidebar Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sidebar: {
    width: '80%',
    height: '100%',
    padding: 24,
  },
  closeSidebarButton: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  sidebarHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  sidebarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#fff',
    marginBottom: 16,
  },
  sidebarName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  sidebarRole: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
  },
  sidebarLink: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  sidebarLinkText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginLeft: 25, // Increased from 20 to 25 for better alignment
    marginBottom: 18,
    letterSpacing: 0.3,
  },
  


  trialBanner: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  bottomSidebarOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Darker overlay for better contrast
    alignItems: "center",
  },

  bottomSidebar: {
    width: "100%",
    maxHeight: "65%", // Slightly increased for better content visibility
    backgroundColor: "#ffffff",
    paddingHorizontal: 28, // Increased padding
    paddingTop: 24,
    paddingBottom: 34,
    borderTopLeftRadius: 32, // More pronounced rounding
    borderTopRightRadius: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 12,
    alignItems: "center",
  },

  bottomSidebarTitle: {
    fontSize: 22, // Increased size for hierarchy
    fontWeight: "800", // Bolder weight
    color: "#1a237e",
    marginBottom: 24, // More spacing
    textAlign: "center",
    letterSpacing: 0.5, // Better text presence
  },

  optionButton: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start", // Better alignment
    paddingVertical: 18, // More padding
    paddingHorizontal: 20,
    marginBottom: 16,
    backgroundColor: "#f8f9fa",
    borderRadius: 16,
    borderWidth: 1, // Added border
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 4,
  },

  optionText: {
    fontSize: 16,
    color: "#2c3e50", // Richer text color
    fontWeight: "600",
    marginLeft: 16,
    lineHeight: 24, // Added line height
  },

  // Added styles for active state
  optionButtonActive: {
    backgroundColor: "#f0f4ff",
    borderColor: "#1a237e",
  },
  modalContent: {
    width: "100%",
    paddingVertical: 16,
  },
  stepContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  numberIndicator: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#1a237e",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginBottom: 15,
  },
  numberText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
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
  
  
  trialContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  trialText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
  },
  upgradeButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  upgradeText: {
    color: '#1a237e',
    fontWeight: '600',
  },
  notificationBadge: {
    backgroundColor: "red", // Badge color
    borderRadius: 10, // Circular shape
    minWidth: 20, // Minimum width for the circle
    height: 20, // Fixed height
    justifyContent: "center", // Center the text
    alignItems: "center", // Center the text
    marginLeft: 8, // Spacing between the badge and the link text/icon
    paddingHorizontal: 5, // Padding for single/double digits
  },
  
  notificationBadgeText: {
    color: "#fff", // Text color
    fontSize: 12, // Text size
    fontWeight: "bold", // Text weight
  },  
  servicesDropdown: {
    marginTop: 8,
    maxHeight: 200, // Limit dropdown height
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    padding: 8,
  },
  serviceOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  serviceText: {
    fontSize: 16,
    color: '#333',
  },
  noResultsText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },

  searchResultsContainer: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    maxHeight: 200, // Limit the height
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  modalContent: {
    fontSize: 16, // Comfortable and readable font size
    color: "#34495E", // Softer dark gray for a modern look
    textAlign: "left", // Align to left for better readability in steps
    lineHeight: 26, // Slightly increased for improved spacing
    marginBottom: 20, // Consistent spacing below the text
    paddingHorizontal: 16, // Add padding for better alignment
    letterSpacing: 0.5, // Slight spacing for readability
    fontWeight: "400", // Regular weight for a clean look
  },
  
  
});

// Helper function to shade colors for gradients
const shadeColor = (color, percent) => {
  let R = parseInt(color.substring(1,3),16);
  let G = parseInt(color.substring(3,5),16);
  let B = parseInt(color.substring(5,7),16);

  R = parseInt(R * (100 + percent) / 100);
  G = parseInt(G * (100 + percent) / 100);
  B = parseInt(B * (100 + percent) / 100);

  R = (R<255)?R:255;
  G = (G<255)?G:255;
  B = (B<255)?B:255;

  const RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
  const GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
  const BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));

  return "#"+RR+GG+BB;
};



export default HomeScreen;