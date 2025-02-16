import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
  Dimensions,
  StatusBar,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import axios from "axios";

const SCREEN_WIDTH = Dimensions.get("window").width;
const PRIMARY_COLOR = "#1a237e";

const ServiceProviderProfilePage = ({ route, navigation }) => {
  const { name, email, serviceName, reviewCount, averageRating } = route.params || {};

  // Debugging to verify params - remove in production
  console.log("Received params:", { name, email, serviceName });

  const [provider, setProvider] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [routes] = useState([
    { key: "first", title: "Services" },
    { key: "second", title: "Reviews" },
    { key: "third", title: "Hours" },
    { key: "fourth", title: "Details" },
  ]);

  useEffect(() => {
    fetchProviderDetails();
  }, []);

  // Remove this effect in production
  useEffect(() => {
    console.log("Provider state updated:", provider);
  }, [provider]);
  
  const fetchProviderDetails = async () => {
    try {
      if (!name || !email) {
        setLoading(false);
        Alert.alert("Error", "Missing provider information");
        return;
      }
      
      console.log(`Fetching provider details for name: ${name}, email: ${email}`);
      const response = await axios.get(
        `https://service-booking-backend-eb9i.onrender.com/api/auth/providers/details?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`
      );
  
      if (response.data?.success) {
        const providerData = response.data.data;
  
        // Extract rating and review count from route params
        setProvider({
          ...providerData,
          reviews: route.params?.reviewCount || 0,
          rating: route.params?.averageRating || "0.0",
        });
      } else {
        console.warn("No provider details found.");
        Alert.alert("Not Found", "Provider details could not be found");
      }
    } catch (error) {
      console.error("Error fetching provider details:", error.message);
      Alert.alert("Error", "Failed to fetch provider details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  
  const getIconUri = (platform) => {
    switch (platform.toLowerCase()) {
      case "facebook":
        return "https://cdn-icons-png.flaticon.com/512/733/733547.png";
      case "instagram":
        return "https://cdn-icons-png.flaticon.com/512/733/733558.png";
      case "twitter":
        return "https://cdn-icons-png.flaticon.com/512/733/733579.png";
      case "linkedin":
        return "https://cdn-icons-png.flaticon.com/512/733/733561.png";
      case "tiktok":
        return "https://cdn-icons-png.flaticon.com/512/3046/3046120.png";
      case "website":
        return "https://cdn-icons-png.flaticon.com/512/841/841364.png";
      default:
        return "https://cdn-icons-png.flaticon.com/512/709/709722.png";
    }
  };

  const handleSocialLinkPress = async (url) => {
    if (!url) return;
    
    try {
      // Normalize the URL to include "https://" if missing
      const normalizedUrl = url.startsWith("http://") || url.startsWith("https://")
        ? url
        : `https://${url}`;
  
      // Check if the URL can be opened
      const supported = await Linking.canOpenURL(normalizedUrl);
  
      if (supported) {
        await Linking.openURL(normalizedUrl);
      } else {
        Alert.alert("Invalid URL", "Sorry, this link cannot be opened.");
      }
    } catch (error) {
      console.error("Error opening URL:", error.message);
      Alert.alert("Error", "An error occurred while trying to open the link.");
    }
  };
  
  const renderStars = (rating) => (
    <View style={styles.starsContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Text
          key={star}
          style={[
            styles.star,
            { color: star <= rating ? "#FFD700" : "#E0E0E0" },
          ]}
        >
          ★
        </Text>
      ))}
    </View>
  );

  const FirstRoute = () => (
    <ScrollView style={styles.tabContent}>
      {provider?.services && provider.services.length > 0 ? (
        provider.services.map((service, index) => (
          <View key={index} style={styles.serviceCard}>
            <View style={styles.serviceItem}>
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceName}>{service.name || "Unnamed Service"}</Text>
                <Text style={styles.servicePrice}>
                  NAD{service.price || "0"} ({service.priceType || "per service"})
                </Text>
              </View>
              <TouchableOpacity
                style={styles.bookServiceButton}
                onPress={() =>
                  navigation.navigate("BookingPage", {
                    serviceName: service.name || "Service",
                    name,
                    email,
                    reviewCount: provider?.reviews || 0,
                    averageRating: provider?.rating || "0.0",
                  })
                }
              >
                <Text style={styles.bookServiceText}>Book</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      ) : (
        <Text style={styles.emptyText}>No services available.</Text>
      )}
    </ScrollView>
  );
  
  const SecondRoute = () => (
    <ScrollView style={styles.tabContent}>
      {provider?.reviews && Array.isArray(provider.reviews) && provider.reviews.length > 0 ? (
        provider.reviews.map((review, index) => (
          <View key={index} style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <Image
                source={{
                  uri: review?.userId?.profileImage
                    ? `https://service-booking-backend-eb9i.onrender.com/${review.userId.profileImage.replace(/\\/g, "/")}`
                    : "https://service-booking-backend-eb9i.onrender.com/uploads/default-profile.png",
                }}
                style={styles.reviewerAvatar}
                defaultSource={require('../assets/default-profile.png')}
              />
              <View style={styles.reviewerInfo}>
                <Text style={styles.reviewUser}>{review?.userId?.name || "Anonymous"}</Text>
                <Text style={styles.reviewDate}>
                  {review?.createdAt ? new Date(review.createdAt).toLocaleDateString() : "Unknown date"}
                </Text>
                <View style={styles.starsContainer}>
                  {[...Array(5)].map((_, i) => (
                    <Text
                      key={i}
                      style={[
                        styles.star,
                        { color: i < (review?.rating || 0) ? "#FFD700" : "#E0E0E0" },
                      ]}
                    >
                      ★
                    </Text>
                  ))}
                </View>
              </View>
            </View>
            <Text style={styles.reviewText}>{review?.review || "No comment"}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.emptyText}>No reviews available yet.</Text>
      )}
    </ScrollView>
  );
  
  const ThirdRoute = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.hoursCard}>
        {provider?.operatingHours && typeof provider.operatingHours === 'object' ? 
          Object.entries(provider.operatingHours).map(([day, hours]) => (
            <View key={day} style={styles.hoursRow}>
              <Text style={styles.day}>{day}</Text>
              <Text style={styles.hours}>
                {hours?.isClosed
                  ? "Closed"
                  : hours?.start && hours?.end
                    ? `${hours.start} - ${hours.end}`
                    : "Hours not specified"}
              </Text>
            </View>
          )) : 
          <Text style={styles.emptyText}>Operating hours not available.</Text>
        }
      </View>
    </ScrollView>
  );

  const DetailsRoute = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.detailsCard}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Business Name</Text>
          <Text style={styles.detailText}>{provider?.businessName || "N/A"}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Town</Text>
          <Text style={styles.detailText}>{provider?.town || "N/A"}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Description</Text>
          <Text style={styles.detailText}>{provider?.description || "No description available."}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Years of Experience</Text>
          <Text style={styles.detailText}>{provider?.yearsOfExperience || "Not specified"}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Address</Text>
          <Text style={styles.detailText}>{provider?.address || "No address provided"}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Phone</Text>
          <Text style={styles.detailText}>{provider?.phone || "No phone provided"}</Text>
        </View>
        
        <View style={styles.socialLinksContainer}>
          {provider?.socialLinks && typeof provider.socialLinks === 'object' ?
            Object.entries(provider.socialLinks).map(([platform, url], index) =>
              url ? (
                <TouchableOpacity
                  key={index}
                  style={styles.socialIcon}
                  onPress={() => handleSocialLinkPress(url)}
                >
                  <Image
                    source={{
                      uri: getIconUri(platform),
                    }}
                    style={styles.socialIconImage}
                  />
                </TouchableOpacity>
              ) : null
            ) :
            <Text style={styles.emptyText}>No social links available.</Text>
          }
        </View>
      </View>
    </ScrollView>
  );
  
  const renderTabBar = (props) => (
    <TabBar
      {...props}
      style={styles.tabBar}
      indicatorStyle={styles.tabIndicator}
      labelStyle={styles.tabLabel}
      activeColor="#1a237e"
      inactiveColor="#9E9E9E"
    />
  );

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
    third: ThirdRoute,
    fourth: DetailsRoute,
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
      </View>
    );
  }

  // Safety check if provider is null
  if (!provider) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Could not load provider information. Please try again later.
        </Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => {
            setLoading(true);
            fetchProviderDetails();
          }}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a237e" />
      <View style={styles.header}>
        {provider?.images && provider.images.length > 0 ? (
          <Carousel
            loop
            width={SCREEN_WIDTH}
            height={300}
            data={provider.images}
            renderItem={({ item }) => (
              <Image
                source={{
                  uri: typeof item === 'string' && item ? (
                    item.startsWith("http")
                      ? item
                      : `https://service-booking-backend-eb9i.onrender.com/${item}`
                  ) : "https://service-booking-backend-eb9i.onrender.com/uploads/default-profile.png"
                }}
                style={styles.carouselImage}
                resizeMode="cover"
                defaultSource={require('../assets/default-profile.png')}
              />
            )}
            autoPlay
            autoPlayInterval={3000}
          />
        ) : (
          <Image
            source={require('../assets/default-profile.png')}
            style={styles.carouselImage}
            resizeMode="cover"
          />
        )}
        <View style={styles.headerOverlay}>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>★ {provider?.rating || "0.0"}</Text>
            <Text style={styles.reviewCount}>
              {provider?.reviews || 0} {provider?.reviews === 1 ? "review" : "reviews"}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.businessInfo}>
        <View style={styles.titleRow}>
          <Text style={styles.businessName}>{provider?.name || "Service Provider"}</Text>
          {provider?.verified && (
            <Image
              source={{
                uri: "https://www.pngmart.com/files/12/Instagram-Verified-Badge-PNG-Image.png",
              }}
              style={styles.verifiedBadge}
            />
          )}
        </View>
        <Text style={styles.address}>{provider?.businessName || "Business name not available"}</Text>
      </View>

      <TabView
        navigationState={{
          index: tabIndex,
          routes,
        }}
        renderScene={renderScene}
        onIndexChange={setTabIndex}
        initialLayout={{ width: SCREEN_WIDTH }}
        renderTabBar={renderTabBar}
        style={styles.tabView}
      />

      <TouchableOpacity
        style={styles.bookButton}
        onPress={() =>
          navigation.navigate("BookingPage", {
            serviceName: serviceName || (provider?.services && provider.services.length > 0 ? provider.services[0].name : "Service"),
            name,
            email,
            reviewCount: provider?.reviews || 0,
            averageRating: provider?.rating || "0.0",
          })
        }
      >
        <Text style={styles.bookButtonText}>Book Appointment</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FF',
  },
  header: {
    position: 'relative',
    height: 300,
    backgroundColor: PRIMARY_COLOR,
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(26, 35, 126, 0.3)',
  },
  carouselImage: {
    width: SCREEN_WIDTH,
    height: 300,
  },
  ratingContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 4,
  },
  rating: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
  },
  reviewCount: {
    color: '#ffffff',
    fontSize: 14,
    marginTop: 4,
  },
  businessInfo: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  businessName: {
    fontSize: 24,
    fontWeight: '700',
    color: PRIMARY_COLOR,
  },
  verifiedBadge: {
    width: 20,
    height: 20,
    marginLeft: 8,
  },
  address: {
    fontSize: 14,
    color: '#757575',
    lineHeight: 20,
  },
  tabBar: {
    backgroundColor: '#ffffff',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    height: 48,
  },
  tabIndicator: {
    backgroundColor: PRIMARY_COLOR,
    height: 3,
    borderRadius: 3,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    margin: 0,
    padding: 0,
  },
  tabView: {
    flex: 1,
    backgroundColor: '#F8F9FF',
  },
  tabContent: {
    padding: 16,
    flexGrow: 1,
  },
  serviceCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: PRIMARY_COLOR,
    marginBottom: 12,
  },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#212121',
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: '700',
    color: PRIMARY_COLOR,
    marginTop: 4,
  },
  bookServiceButton: {
    backgroundColor: PRIMARY_COLOR,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    elevation: 2,
  },
  bookServiceText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  reviewCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  reviewerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  reviewerInfo: {
    flex: 1,
  },
  reviewUser: {
    fontSize: 16,
    fontWeight: "600",
    color: "#212121",
  },
  reviewDate: {
    fontSize: 14,
    color: "#757575",
    marginTop: 2,
  },
  starsContainer: {
    flexDirection: "row",
    marginTop: 4,
  },
  star: {
    fontSize: 18,
    marginRight: 2,
  },
  reviewText: {
    fontSize: 14,
    color: "#424242",
    lineHeight: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#757575",
    textAlign: "center",
    marginTop: 24,
    marginBottom: 24,
  },
  hoursCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  day: {
    fontSize: 14,
    color: '#212121',
    fontWeight: '500',
  },
  hours: {
    fontSize: 14,
    color: PRIMARY_COLOR,
    fontWeight: '600',
  },
  detailsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  detailRow: {
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 13,
    color: '#757575',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailText: {
    fontSize: 14,
    color: '#212121',
    lineHeight: 20,
  },
  socialLinksContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  socialIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FF',
    marginHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  socialIconImage: {
    width: 24,
    height: 24,
  },
  bookButton: {
    backgroundColor: PRIMARY_COLOR,
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  bookButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: PRIMARY_COLOR,
  },
  activeTabLabel: {
    color: PRIMARY_COLOR,
    fontWeight: '700',
  },
  inactiveTabLabel: {
    color: '#757575',
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F8F9FF',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: PRIMARY_COLOR,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FF',
  },
});

export default ServiceProviderProfilePage;