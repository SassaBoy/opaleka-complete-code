import React, { useState } from "react";
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
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { LinearGradient } from 'expo-linear-gradient';
import Swiper from "react-native-swiper";
const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const userRole = "Client"; // Toggle between "Client" and "Provider"
  const userName = "John Doe";
  const userLocation = "Windhoek, Namibia";
  const profileImage = "https://via.placeholder.com/100";
  const trialDaysLeft = 5;

  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = [
    { 
      name: "Cleaning",
      image: require("../assets/image.png"),
      color: "#4CAF50",
      icon: "cleaning-services"
    },
    { 
      name: "Plumbing",
      image: require("../assets/image.png"),
      color: "#2196F3",
      icon: "plumbing"
    },
    { 
      name: "Tutoring",
      image: require("../assets/image.png"),
      color: "#9C27B0",
      icon: "school"
    },
    { 
      name: "Fitness",
      image: require("../assets/image.png"),
      color: "#FF5722",
      icon: "fitness-center"
    },
    { 
      name: "Music",
      image: require("../assets/image.png"),
      color: "#E91E63",
      icon: "music-note"
    },
  ];

  const adverts = [
    {
      id: 1,
      image: "https://via.placeholder.com/400x200",
      title: "Special Discount on Cleaning Services!",
      description: "Get 20% off on all cleaning services this month.",
    },
    {
      id: 2,
      image: "https://via.placeholder.com/400x200",
      title: "Plumbing Emergency? We've Got You Covered!",
      description: "Fast and reliable plumbing services available 24/7.",
    },
    {
      id: 3,
      image: "https://via.placeholder.com/400x200",
      title: "Enhance Your Skills with Our Tutoring Services!",
      description: "Affordable tutoring for all age groups.",
    },
  ];

  const quickActions = [
    {
      title: "View Schedule",
      icon: "calendar-today",
      colors: ['#1976d2', '#1565c0'],
      onPress: () => console.log("View Schedule")
    },
    {
      title: "Manage Bookings",
      icon: "people",
      colors: ['#7b1fa2', '#6a1b9a'],
      onPress: () => console.log("Manage Bookings")
    },
    {
      title: "View Reviews",
      icon: "star",
      colors: ['#f4511e', '#e64a19'],
      onPress: () => console.log("View Reviews")
    },
    {
      title: "Settings",
      icon: "settings",
      colors: ['#388e3c', '#2e7d32'],
      onPress: () => console.log("Settings")
    }
  ];

  const todayBookings = [
    {
      time: "9:00 AM",
      clientName: "John Doe",
      service: "House Cleaning",
      status: "Confirmed"
    },
    {
      time: "11:30 AM",
      clientName: "Jane Smith",
      service: "Plumbing Repair",
      status: "Pending"
    },
    {
      time: "2:00 PM",
      clientName: "Mike Johnson",
      service: "Math Tutoring",
      status: "Confirmed"
    }
  ];

  const renderSidebar = () => (
    <LinearGradient
      colors={['#1a237e', '#0d47a1']}
      style={styles.sidebar}
    >
      <TouchableOpacity
        style={styles.closeSidebarButton}
        onPress={() => setSidebarVisible(false)}
      >
        <Icon name="close" size={24} color="#fff" />
      </TouchableOpacity>
      <View style={styles.sidebarHeader}>
        <Image source={{ uri: profileImage }} style={styles.sidebarImage} />
        <Text style={styles.sidebarName}>{userName}</Text>
        <Text style={styles.sidebarRole}>{userRole}</Text>
      </View>
      
      {sidebarLinks.map((link, index) => (
        <TouchableOpacity
          key={index}
          style={styles.sidebarLink}
          onPress={link.onPress}
        >
          <Icon name={link.icon} size={24} color="#fff" />
          <Text style={styles.sidebarLinkText}>{link.title}</Text>
        </TouchableOpacity>
      ))}
    </LinearGradient>
  );

  const renderClientView = () => (
    <ScrollView style={styles.mainContent}>
      {trialDaysLeft > 0 && (
        <LinearGradient
          colors={['#2962ff', '#0039cb']}
          style={styles.trialBanner}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <View style={styles.trialContent}>
            <Icon name="star" size={24} color="#FFD700" />
            <Text style={styles.trialText}>
              {trialDaysLeft} days left in your free trial
            </Text>
          </View>
          <TouchableOpacity
            style={styles.upgradeButton}
            onPress={() => console.log("Upgrade Plan")}
          >
            <Text style={styles.upgradeText}>Upgrade Now</Text>
          </TouchableOpacity>
        </LinearGradient>
      )}

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Icon name="search" size={24} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="What service do you need?"
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <Text style={styles.sectionTitle}>Categories</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesScroll}
      >
        {categories.map((category, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.categoryCard,
              selectedCategory === category.name && styles.selectedCategory,
            ]}
            onPress={() => setSelectedCategory(category.name)}
          >
            <LinearGradient
              colors={[category.color, shadeColor(category.color, -20)]}
              style={styles.categoryGradient}
            >
              <Icon name={category.icon} size={32} color="#fff" />
            </LinearGradient>
            <Text style={styles.categoryName}>{category.name}</Text>
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
    <ScrollView style={styles.mainContent}>
      <LinearGradient
        colors={['#1a237e', '#0d47a1']}
        style={styles.providerDashboard}
      >
        <View style={styles.dashboardHeader}>
          <View>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={[styles.providerName, { color: '#fff' }]}>{userName}</Text>
          </View>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Active Bookings</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>4.9</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
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
              <Icon name={action.icon} size={24} color="#fff" />
              <Text style={styles.actionText}>{action.title}</Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.upcomingBookings}>
        <Text style={styles.sectionTitle}>Today's Schedule</Text>
        {todayBookings.map((booking, index) => (
          <View key={index} style={styles.bookingCard}>
            <View style={styles.bookingTime}>
              <Text style={styles.timeText}>{booking.time}</Text>
            </View>
            <View style={styles.bookingDetails}>
              <Text style={styles.clientName}>{booking.clientName}</Text>
              <Text style={styles.serviceType}>{booking.service}</Text>
              <View style={[
                styles.statusBadge,
                { backgroundColor: booking.status === "Confirmed" ? "#4CAF50" : "#FFC107" }
              ]}>
                <Text style={styles.statusText}>{booking.status}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
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

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setSidebarVisible(true)}
        >
          <Icon name="menu" size={28} color="#333" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.appTitle}>Leonard Cornelius</Text>
          <Text style={styles.location}>{userLocation}</Text>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <Image 
            source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Flag_of_Namibia.svg/1920px-Flag_of_Namibia.svg.png' }} 
            style={styles.profileImage} 
          />
        </TouchableOpacity>
      </View>

      {userRole === "Client" ? renderClientView() : renderProviderView()}
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
  mainContent: {
    flex: 1,
  },
  searchContainer: {
    padding: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    borderRadius: 12,
    height: 50,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    marginTop: -40,
  },
  actionButton: {
    width: (width - 48) / 2,
    marginHorizontal: 8,
    marginBottom: 16,
  },
  actionGradient: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 16,
    marginBottom: 16,
  },
  trialBanner: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
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
    color: '#2962ff',
    fontWeight: '600',
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

// Sidebar links configuration
const sidebarLinks = [
  {
    icon: "person",
    title: "Profile",
    onPress: () => console.log("Navigate to Profile")
  },
  {
    icon: "notifications",
    title: "Notifications",
    onPress: () => console.log("Navigate to Notifications")
  },
  {
    icon: "history",
    title: "Booking History",
    onPress: () => console.log("Navigate to History")
  },
  {
    icon: "payment",
    title: "Payment Methods",
    onPress: () => console.log("Navigate to Payments")
  },
  {
    icon: "settings",
    title: "Settings",
    onPress: () => console.log("Navigate to Settings")
  },
  {
    icon: "help",
    title: "Help & Support",
    onPress: () => console.log("Navigate to Support")
  },
  {
    icon: "logout",
    title: "Log Out",
    onPress: () => console.log("Log out")
  }
];

export default HomeScreen;