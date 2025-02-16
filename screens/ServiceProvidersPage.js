import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TextInput,
  Animated,
  StatusBar,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

const ServiceProvidersPage = ({ route }) => {
  const { serviceName } = route.params || {};
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [serviceProviders, setServiceProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    fetchProviders();
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Client-side fetch function
const fetchProviders = async () => {
  try {
    setLoading(true);
    
    const userLocation = await AsyncStorage.getItem("userLocation");
    
    const response = await axios.get(
      `https://service-booking-backend-eb9i.onrender.com/api/auth/providers`,
      {
        params: {
          serviceName,
          location: userLocation
        }
      }
    );

    // Handle the response regardless of whether providers were found
    const providers = response.data.providers || [];
    
    // Fetch review details for each provider
    const updatedProviders = await Promise.all(
      providers.map(async (provider) => {
        try {
          const reviewDetailsResponse = await axios.get(
            `https://service-booking-backend-eb9i.onrender.com/api/reviews/provider/${provider.id}/details`
          );
          
          const { reviewCount, averageRating } = reviewDetailsResponse.data.data;
          
          return {
            ...provider,
            averageRating: averageRating.toFixed(1),
            reviewCount
          };
        } catch (error) {
          console.error(`Error fetching reviews for provider ${provider.name}:`, error);
          return {
            ...provider,
            averageRating: "0.0",
            reviewCount: 0
          };
        }
      })
    );

    setServiceProviders(updatedProviders);
    
  } catch (error) {
    console.error("Error fetching providers:", error);
    // Set empty array instead of leaving previous state
    setServiceProviders([]);
  } finally {
    setLoading(false);
  }
};
  
  const filteredProviders = serviceProviders.filter((provider) =>
    provider.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleProviderClick = (provider) => {
    setSelectedId(provider.id);
  
    console.log("Navigating with params:", {
      serviceName,
      name: provider.name,
      email: provider.email,
      reviewCount: provider.reviewCount,
      averageRating: provider.averageRating,
    });
  
    setTimeout(() => {
      navigation.navigate("ServiceProviderProfilePage", {
        serviceName,
        name: provider.name,
        email: provider.email,
        reviewCount: provider.reviewCount,
        averageRating: provider.averageRating,
      });
      setSelectedId(null);
    }, 200);
  };
  
  
  const renderProvider = ({ item }) => (
    <Animated.View
      style={[
        styles.providerCard,
        selectedId === item.id && styles.selectedCard,
      ]}
    >
      <TouchableOpacity
        style={styles.touchable}
        onPress={() => handleProviderClick(item)}
        activeOpacity={0.9}
      >
        <View style={styles.providerContent}>
          <Image
            source={{
              uri: item.profileImage
                ? `https://service-booking-backend-eb9i.onrender.com/${item.profileImage}`
                : "https://via.placeholder.com/150",
            }}
            style={styles.providerImage}
          />
          <View style={styles.providerDetails}>
            <Text style={styles.providerName}>{item.name}</Text>
            <Text style={styles.providerAddress}>
              {item.businessAddress || "Address not provided"}
            </Text>
            <View style={styles.ratingContainer}>
  <Text style={styles.providerRating}>
    ★ {item.averageRating !== "0.0" ? item.averageRating : "No reviews yet"}
  </Text>
  <Text style={styles.reviewCount}>
    ({item.reviewCount || 0} {item.reviewCount === 1 ? "review" : "reviews"})
  </Text>
</View>

            <Text style={styles.providerDescription} numberOfLines={2}>
              {item.description || "No description available for this provider."}
            </Text>
          </View>
        </View>
        <View style={styles.viewDetailsContainer}>
          <Text style={styles.viewDetailsText}>Tap to view details</Text>
          <Icon name="chevron-forward" size={16} color="#1a237e" />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
  
  
  
  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {loading ? "Loading providers..." : "No providers found for this service."}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a237e" />
      <View style={styles.headerContainer}>
        <Text style={styles.pageTitle}>{`${serviceName} Service Providers`}</Text>
        <Text style={styles.header}>Find the perfect service provider</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Icon name="search" size={20} color="#9E9E9E" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search providers..."
            placeholderTextColor="#9E9E9E"
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
          />
        </View>
      </View>

      <FlatList
        data={filteredProviders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderProvider}
        ListEmptyComponent={renderEmpty}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  headerContainer: {
    backgroundColor: "#1a237e",
    padding: 25,
    paddingTop: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#ffffff",
    marginBottom: 8,
  },
  header: {
    fontSize: 16,
    color: "#E8EAF6",
    fontWeight: "500",
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginTop: -25,
    marginBottom: 10,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 25,
    paddingHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    padding: 15,
    fontSize: 16,
    color: "#1a237e",
  },
  listContainer: {
    padding: 20,
    paddingTop: 10,
  },
  providerCard: {
    marginBottom: 15,
    borderRadius: 16,
    backgroundColor: "#ffffff",
    shadowColor: "#1a237e",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  selectedCard: {
    backgroundColor: "#f5f5f5",
    transform: [{ scale: 0.98 }],
  },
  touchable: {
    borderRadius: 16,
    overflow: "hidden",
  },
  providerContent: {
    flexDirection: "row",
    padding: 15,
  },
  providerImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  providerDetails: {
    flex: 1,
  },
  providerName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a237e",
    marginBottom: 4,
  },
  providerAddress: {
    fontSize: 14,
    color: "#757575",
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  providerRating: {
    fontSize: 14,
    color: "#FFA000",
    fontWeight: "600",
    marginRight: 4,
  },
  reviewCount: {
    fontSize: 14,
    color: "#9E9E9E",
  },
  providerDescription: {
    fontSize: 14,
    color: "#616161",
    lineHeight: 20,
  },
  viewDetailsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  viewDetailsText: {
    fontSize: 14,
    color: "#1a237e",
    marginRight: 4,
  },
  separator: {
    height: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: "#757575",
  },
});

export default ServiceProvidersPage;
