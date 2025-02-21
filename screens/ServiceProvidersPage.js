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
  ActivityIndicator
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RNPickerSelect from "react-native-picker-select";

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
  const [locationQuery, setLocationQuery] = useState("");
  const [sortByLowest, setSortByLowest] = useState(false);
  const [sortOption, setSortOption] = useState("default"); // "default", "priceLow", "ratingHigh"

  useEffect(() => {
    const initialFetch = async () => {
      const defaultLocation = await AsyncStorage.getItem("userLocation");
      if (!locationQuery) {
        fetchProviders(defaultLocation);
      }
    };
    
    initialFetch();
  
    const interval = setInterval(async () => {
      if (!locationQuery) {
        const defaultLocation = await AsyncStorage.getItem("userLocation");
        fetchProviders(defaultLocation);
      }
    }, 5000);
  
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
  
    return () => clearInterval(interval);
  }, [locationQuery]); // Add locationQuery as dependency

  const fetchProviders = async (overrideLocation = null) => {
    try {
      setLoading(true);
  
      let locationToFetch = overrideLocation !== null ? overrideLocation : locationQuery;
      if (!locationToFetch) {
        locationToFetch = await AsyncStorage.getItem("userLocation");
      }
  
      const response = await axios.get(`http://192.168.8.138:5001/api/auth/providers`, {
        params: { serviceName, location: locationToFetch }
      });
  
      const providers = response.data.providers || [];
  
      if (locationQuery.trim() && providers.length === 0) {
        setServiceProviders([]); // Keep "No providers found" message
      } else {
        // Fetch review details for each provider
        const updatedProviders = await Promise.all(
          providers.map(async (provider) => {
            try {
              const reviewDetailsResponse = await axios.get(
                `http://192.168.8.138:5001/api/reviews/provider/${provider.id}/details`
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
      }
    } catch (error) {
      console.error("Error fetching providers:", error);
      setServiceProviders([]);
    } finally {
      setLoading(false);
    }
  };
  
const filteredProviders = [...serviceProviders]
  .sort((a, b) => {
    // Convert prices to numbers, using 999999 as default for missing/invalid prices
    const priceA = a.servicePrice ? parseFloat(a.servicePrice) : 999999;
    const priceB = b.servicePrice ? parseFloat(b.servicePrice) : 999999;
    
    // Sort based on the selected option
    if (sortOption === "priceLow") {
      return priceA - priceB; // Sort Low to High
    }
    if (sortOption === "priceHigh") {
      return priceB - priceA; // Sort High to Low
    }
    if (sortOption === "ratingHigh") {
      const ratingA = parseFloat(a.averageRating) || 0;
      const ratingB = parseFloat(b.averageRating) || 0;
      return ratingB - ratingA;
    }
    return 0; // Default sorting
  });

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
                ? `http://192.168.8.138:5001/${item.profileImage}`
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
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>
            {locationQuery 
              ? `Searching providers in ${locationQuery}...` 
              : "Searching for nearby providers..."}
          </Text>
          <ActivityIndicator size="large" color="#1a237e" style={styles.loadingSpinner} />
        </View>
      ) : (
        <Text style={styles.emptyText}>
          {locationQuery 
            ? `No providers found in ${locationQuery}.` 
            : "No providers found for this service."}
        </Text>
      )}
    </View>
  );
  

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a237e" />
      
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.pageTitle}>{`${serviceName} Service Providers`}</Text>
        <Text style={styles.header}>Find the perfect service provider</Text>
      </View>
      <View style={styles.searchContainer}>
  {/* Location Search */}
 <View style={styles.searchInputContainer}>
  <Icon name="location-outline" size={20} color="#9E9E9E" style={styles.searchIcon} />
  <TextInput
  style={[styles.searchInput, { flex: 1 }]}
  placeholder="Enter town or city..."
  placeholderTextColor="#9E9E9E"
  value={locationQuery}
  onChangeText={(text) => {
    setLocationQuery(text);
    if (text.trim() === "") {
      AsyncStorage.getItem("userLocation").then((defaultLocation) => {
        setLocationQuery("");
        fetchProviders(defaultLocation);
      });
    } else if (text.trim().length >= 4) {
      setLoading(true);
      fetchProviders();
    }
  }}
/>
  <TouchableOpacity
    style={styles.searchButton}
    onPress={() => {
      setLoading(true);
      if (locationQuery.trim()) {
        fetchProviders();
      } else {
        setServiceProviders([]);
      }
    }}
  >
    <Icon name="search" size={20} color="#ffffff" />
  </TouchableOpacity>
</View>


        <View style={styles.sortingContainer}>
  <Text style={styles.sortLabel}>Sort by:</Text>
  <View style={styles.pickerContainer}>
    <RNPickerSelect
      onValueChange={(value) => setSortOption(value)}
      items={[
        { label: "Default Sorting", value: "default" },
        { label: "Price: Lowest First", value: "priceLow" },
        { label: "Price: Highest First", value: "priceHigh" },
        { label: "Rating: Most Rated", value: "ratingHigh" },
      ]}
      style={{
        inputIOS: styles.pickerInput,
        inputAndroid: styles.pickerInput,
      }}
      value={sortOption} // ✅ Keeps selected option visible
    />
  </View>
  <Text style={styles.selectedSortText}>
    {sortOption === "priceLow" ? "Sorting: Price Low to High" : 
     sortOption === "priceHigh" ? "Sorting: Price High to Low" : 
     sortOption === "ratingHigh" ? "Sorting: Rating High to Low" : "Sorting: Default"}
  </Text>
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
  sortingContainer: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  
  sortLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 6,
    backgroundColor: '#f8f8f8',
    marginBottom: 12,
  },
  
  pickerInput: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 0,
    color: '#333333',
    backgroundColor: 'transparent',
  },
  
  selectedSortText: {
    fontSize: 14,
    color: '#666666',
    fontStyle: 'italic',
    marginTop: 4,
  },
  searchButton: {
    backgroundColor: '#1a237e',
    padding: 10,
    borderRadius: 20,
    marginLeft: 10,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#757575',
    marginBottom: 16,
    textAlign: 'center',
  },
  loadingSpinner: {
    marginTop: 10,
  },
});

export default ServiceProvidersPage;
