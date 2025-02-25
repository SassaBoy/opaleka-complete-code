import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  Modal,
  Dimensions,
  Image,
} from "react-native";
import Toast from "react-native-toast-message";
import axios from "axios";
import debounce from "lodash.debounce";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";

const AdminNotificationsPage = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "notifications", title: "Notifications", icon: "notifications" },
    { key: "verification", title: "Verification", icon: "verified-user" },
    { key: "analytics", title: "Analytics", icon: "analytics" },
 
  ]);

  // Notification states
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [showUserList, setShowUserList] = useState(true);

  // Verification states
  const [pendingProviders, setPendingProviders] = useState([]);
  const [loadingProviders, setLoadingProviders] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [verificationNote, setVerificationNote] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [verificationSearchQuery, setVerificationSearchQuery] = useState("");

  // Analytics states (sample data)
  const [analyticsData] = useState({
    totalUsers: 1250,
    activeProviders: 45,
    pendingVerifications: 12,
    todayNotifications: 8,
  });

  useEffect(() => {
    if (index === 1) {
      fetchPendingProviders();
    }
  }, [index]);

  // Function to fetch pending providers
  const fetchPendingProviders = async () => {
    try {
      setLoadingProviders(true);
      const response = await axios.get(
        "https://service-booking-backend-eb9i.onrender.com/api/auth/pending-providers"
      );
      
      if (response.data.success) {
        setPendingProviders(response.data.providers);
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: response.data.message,
          position: "top",
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to fetch pending providers",
        position: "top",
      });
    } finally {
      setLoadingProviders(false);
    }
  };

  // Function to search pending providers
  const searchPendingProviders = async (query) => {
    try {
      setLoadingProviders(true);
      const response = await axios.get(
        `https://service-booking-backend-eb9i.onrender.com/api/auth/search-pending-providers?query=${query}`
      );
      if (response.data.success) {
        setPendingProviders(response.data.providers);
      }
    } catch (error) {
      console.error("Error searching providers:", error);
    } finally {
      setLoadingProviders(false);
    }
  };

  const debouncedSearchProviders = debounce(searchPendingProviders, 300);

  useEffect(() => {
    if (index === 1) {
      fetchPendingProviders();
    }
  }, [index]);

  useEffect(() => {
    if (verificationSearchQuery) {
      debouncedSearchProviders(verificationSearchQuery);
    } else {
      fetchPendingProviders();
    }
    return () => debouncedSearchProviders.cancel();
  }, [verificationSearchQuery]);

  const fetchUsers = async (query) => {
    if (!query) {
      setUsers([]);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(
        `https://service-booking-backend-eb9i.onrender.com/api/auth/search?query=${query}`
      );
      setUsers(response.data.users || []);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to fetch users",
        position: "top",
      });
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchUsers = debounce(fetchUsers, 300);

  useEffect(() => {
    debouncedFetchUsers(searchQuery);
    return () => debouncedFetchUsers.cancel();
  }, [searchQuery]);

  const handleSendNotification = async (audience, userId = null) => {
    if (!title || !message) {
      Toast.show({
        type: "error",
        text1: "Missing Fields",
        text2: "Please fill in both title and message",
        position: "top",
      });
      return;
    }

    try {
      setLoading(true);
      await axios.post("https://service-booking-backend-eb9i.onrender.com/api/auth/send-notification", {
        title,
        message,
        audience,
        userId,
      });
      
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Notification sent successfully",
        position: "top",
      });
      
      setTitle("");
      setMessage("");
      setSelectedEmail("");
      setShowUserList(true);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to send notification",
        position: "top",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (status) => {
    try {
      setLoading(true);
      await axios.post("https://service-booking-backend-eb9i.onrender.com/api/auth/verify-documents", {
        email: selectedProvider.email,
        verificationStatus: status,
        adminNotes: verificationNote,
      });

      Toast.show({
        type: "success",
        text1: "Success",
        text2: `Provider ${status.toLowerCase()} successfully`,
        position: "top",
      });

      setModalVisible(false);
      setVerificationNote("");
      setSelectedProvider(null);
      fetchPendingProviders();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to verify provider",
        position: "top",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderNotificationsTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <MaterialIcons name="title" size={24} color="#1a237e" style={styles.inputIcon} />
          <TextInput
  style={styles.input}
  placeholder="Notification Title"
  value={title}
  onChangeText={(text) => {
    setTitle(text); // Efficiently update state
  }}
  placeholderTextColor="#9e9e9e"
  autoFocus={false} // Prevents forced focus issues
  underlineColorAndroid="transparent" // Removes underline behavior
  blurOnSubmit={false} // Keeps the focus in the TextInput
/>
        </View>

        <View style={styles.inputContainer}>
          <MaterialIcons name="message" size={24} color="#1a237e" style={styles.inputIcon} />
          <TextInput
  style={[styles.input, styles.messageInput]}
  placeholder="Notification Message"
  value={message}
  onChangeText={(text) => {
    setMessage(text); // Efficiently update state
  }}
  multiline
  placeholderTextColor="#9e9e9e"
  underlineColorAndroid="transparent" // Removes underline behavior
  blurOnSubmit={false} // Keeps the focus in the TextInput
/>
        </View>
      </View>

      {!selectedEmail && (
        <>
          <Text style={styles.subHeader}>Search User</Text>
          <View style={styles.inputContainer}>
            <MaterialIcons name="search" size={24} color="#1a237e" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter name or email"
              value={searchQuery}
              onChangeText={(text) => {
                setSearchQuery(text);
                setShowUserList(true);
              }}
              placeholderTextColor="#9e9e9e"
            />
          </View>
        </>
      )}

      {showUserList && users.length > 0 && !selectedEmail && (
        <FlatList
          data={users}
          keyExtractor={(item) => item?.id?.toString() || Math.random().toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.userItem}
              onPress={() => {
                setSelectedEmail(item.email);
                setShowUserList(false);
              }}
            >
              <View style={styles.userAvatar}>
                <Text style={styles.avatarText}>
                  {item.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{item.name}</Text>
                <Text style={styles.userEmail}>{item.email}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      {selectedEmail && (
        <View style={styles.selectedUserContainer}>
          <Text style={styles.selectedUserText}>Selected: {selectedEmail}</Text>
          <TouchableOpacity
            onPress={() => {
              setSelectedEmail("");
              setSearchQuery("");
            }}
          >
            <MaterialIcons name="close" size={24} color="#1a237e" />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.buttonsContainer}>
        {selectedEmail && (
          <TouchableOpacity
            style={[styles.button, (!title || !message) && styles.buttonDisabled]}
            disabled={!title || !message}
            onPress={() => handleSendNotification("Specific", selectedEmail)}
          >
            <LinearGradient
              colors={(!title || !message) ? ["#9ea1c7", "#787bc7"] : ["#4a148c", "#1a237e"]}
              style={styles.gradient}
            >
              <Text style={styles.buttonText}>Send to Selected User</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.button, (!title || !message) && styles.buttonDisabled]}
          disabled={!title || !message}
          onPress={() => handleSendNotification("All")}
        >
          <LinearGradient
            colors={(!title || !message) ? ["#9ea1c7", "#787bc7"] : ["#4a148c", "#1a237e"]}
            style={styles.gradient}
          >
            <Text style={styles.buttonText}>Send to All Users</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, (!title || !message) && styles.buttonDisabled]}
          disabled={!title || !message}
          onPress={() => handleSendNotification("Providers")}
        >
          <LinearGradient
            colors={(!title || !message) ? ["#9ea1c7", "#787bc7"] : ["#4a148c", "#1a237e"]}
            style={styles.gradient}
          >
            <Text style={styles.buttonText}>Send to Providers Only</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, (!title || !message) && styles.buttonDisabled]}
          disabled={!title || !message}
          onPress={() => handleSendNotification("Clients")}
        >
          <LinearGradient
            colors={(!title || !message) ? ["#9ea1c7", "#787bc7"] : ["#4a148c", "#1a237e"]}
            style={styles.gradient}
          >
            <Text style={styles.buttonText}>Send to Clients Only</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderProviderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.providerItem}
      onPress={() => {
        setSelectedProvider(item);
        setModalVisible(true);
      }}
    >
      <View style={styles.providerHeader}>
        {item.profileImage ? (
          <Image
            source={{ uri: item.profileImage }}
            style={styles.providerAvatar}
          />
        ) : (
          <View style={styles.providerAvatar}>
            <Text style={styles.avatarText}>
              {item.name.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        <View style={styles.providerInfo}>
          <Text style={styles.providerName}>{item.name}</Text>
          <Text style={styles.providerEmail}>{item.email}</Text>
          <Text style={styles.providerStatus}>Status: Pending</Text>
        </View>
      </View>
      
      <View style={styles.providerDetails}>
      
        
    
      </View>
      
      <MaterialIcons name="chevron-right" size={24} color="#1a237e" />
    </TouchableOpacity>
  );
  

  const renderVerificationTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.searchContainer}>
        <View style={styles.inputContainer}>
          <MaterialIcons name="search" size={24} color="#1a237e" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Search by name or email"
            value={verificationSearchQuery}
            onChangeText={setVerificationSearchQuery}
            placeholderTextColor="#9e9e9e"
          />
        </View>
      </View>

      {loadingProviders ? (
        <ActivityIndicator size="large" color="#1a237e" style={styles.loader} />
      ) : (
        <FlatList
          data={pendingProviders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderProviderItem}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No pending verifications found</Text>
          }
        />
      )}
    </View>
  );


  const renderAnalyticsTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.analyticsGrid}>
        <View style={styles.analyticsCard}>
          <MaterialIcons name="people" size={32} color="#1a237e" />
          <Text style={styles.analyticsNumber}>{analyticsData.totalUsers}</Text>
          <Text style={styles.analyticsLabel}>Total Users</Text>
        </View>
        <View style={styles.analyticsCard}>
          <MaterialIcons name="verified-user" size={32} color="#1a237e" />
          <Text style={styles.analyticsNumber}>{analyticsData.activeProviders}</Text>
          <Text style={styles.analyticsLabel}>Active Providers</Text>
        </View>
        <View style={styles.analyticsCard}>
          <MaterialIcons name="pending-actions" size={32} color="#1a237e" />
          <Text style={styles.analyticsNumber}>{analyticsData.pendingVerifications}</Text>
          <Text style={styles.analyticsLabel}>Pending Verifications</Text>
        </View>
        <View style={styles.analyticsCard}>
          <MaterialIcons name="notifications-active" size={32} color="#1a237e" />
          <Text style={styles.analyticsNumber}>{analyticsData.todayNotifications}</Text>
          <Text style={styles.analyticsLabel}>Today's Notifications</Text>
        </View>
      </View>
    </View>
  );

  

  const renderScene = SceneMap({
    notifications: renderNotificationsTab,
    verification: renderVerificationTab,
    analytics: renderAnalyticsTab,
  });

  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: '#ffffff' }}
      style={styles.tabBar}
      renderLabel={({ route, focused }) => (
        <View style={styles.tabLabel}>
          <MaterialIcons
            name={route.icon}
            size={24}
            color={focused ? '#ffffff' : '#b3e5fc'}
          />
          <Text style={[styles.tabText, { color: focused ? '#ffffff' : '#b3e5fc' }]}>
            {route.title}
          </Text>
        </View>
      )}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <Toast />
      <LinearGradient
        colors={["#4a148c", "#1a237e"]}
        style={styles.headerGradient}
      >
        <Text style={styles.header}>Admin Dashboard</Text>
      </LinearGradient>

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: Dimensions.get('window').width }}
        renderTabBar={renderTabBar}
        swipeEnabled={true}
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Verify Provider</Text>
            <Text style={styles.modalSubtitle}>{selectedProvider?.name}</Text>
            
            <View style={styles.inputContainer}>
              <MaterialIcons name="note" size={24} color="#1a237e" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, styles.messageInput]}
                placeholder="Add verification notes"
                value={verificationNote}
                onChangeText={setVerificationNote}
                multiline
                placeholderTextColor="#9e9e9e"
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.rejectButton]}
                onPress={() => handleVerification("Rejected")}
              >
                <Text style={styles.buttonText}>Reject</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.approveButton]}
                onPress={() => handleVerification("Verified")}
              >
                <Text style={styles.buttonText}>Approve</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <MaterialIcons name="close" size={24} color="#666666" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f2f5",  // Lighter background for better contrast
  },
  headerGradient: {
    padding: 20,
    paddingTop: 40,
    borderBottomLeftRadius: 0,  // Remove rounded corners for cleaner look
    borderBottomRightRadius: 0,
    elevation: 0,  // Remove shadow for flatter design
  },
  header: {
    fontSize: 28,
    fontWeight: "700",
    color: "#ffffff",
    textAlign: "center",
    marginTop: 8,
  },
  tabBar: {
    backgroundColor: "#1a237e",
    elevation: 0,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  tabLabel: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 6,
  },
  tabText: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
    fontWeight: '500',
  },
  tabContent: {
    flex: 1,
    padding: 16,
  },
  form: {
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    elevation: 0,  // Remove shadow for cleaner look
    shadowOpacity: 0,
    height: 56,  // Fixed height for better consistency
  },
  inputIcon: {
    padding: 12,
    opacity: 0.7,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingRight: 12,
    fontSize: 15,
    color: "#333333",
    fontWeight: '400',
    height: '100%',  // Take full height of container
   
  },
  messageInput: {
    height: 50,
    textAlignVertical: "top",
    paddingTop: 12,
    
  },
  searchContainer: {
    marginBottom: 16,
    zIndex: 1,  // Ensure search results appear above other content
    alignItems: "center",
  },
  selectedUserContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedUserText: {
    fontSize: 15,
    color: "#333333",
    flex: 1,
    fontWeight: '500',
  },
  subHeader: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333333",
    marginTop: -20,
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#ffffff",
    marginVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    elevation: 0,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1a237e",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 13,
    color: "#666666",
  },
  buttonsContainer: {
    marginTop: 20,
    marginBottom: 24,
    gap: 8,
  },
  button: {
    borderRadius: 8,
    overflow: "hidden",
    elevation: 0,
    backgroundColor: "#1a237e",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  gradient: {
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
  },
  // Analytics styles
  analyticsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 8,
    gap: 12,
  },
  analyticsCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    elevation: 0,
  },
  analyticsNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333333',
    marginTop: 8,
  },
  analyticsLabel: {
    fontSize: 13,
    color: '#666666',
    marginTop: 4,
    textAlign: 'center',
    fontWeight: '500',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 16,
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 20,
    width: "100%",
    maxWidth: 480,
    elevation: 0,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333333",
    marginBottom: 4,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 8,
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    elevation: 0,
  }
});

export default AdminNotificationsPage;