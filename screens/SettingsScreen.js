import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

export default function SettingsScreen({ navigation }) {
  const [userDetails, setUserDetails] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        setIsLoggedIn(false);
        setUserDetails(null);
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
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem("authToken");
              setIsLoggedIn(false);
              setUserDetails(null);
              navigation.navigate("Home", { role: "Client" });
            } catch (error) {
              console.error("Error during logout:", error);
              Toast.show({
                type: "error",
                text1: "Logout Failed",
                text2: "Something went wrong. Please try again.",
              });
            }
          }
        }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            console.log("Account deleted");
          }
        }
      ]
    );
  };

  const settingsOptions = [
    {
      icon: "person-circle",
      title: "My Account",
      onPress: () => {
        if (isLoggedIn && userDetails) {
          navigation.navigate("UserAccount", {
            userId: userDetails?.id,
            role: userDetails?.role,
          });
        }
      },
      type: "navigation",
      iconColor: "#1a237e"
    },
    {
      icon: "help-circle",
      title: "Help",
      onPress: () => navigation.navigate('Support'),
      type: "navigation",
      iconColor: "#1a237e"
    },
    {
      icon: "trash",
      title: "Delete Account",
      onPress: () => {
        Alert.alert(
          "Delete Account",
          "Are you sure you want to delete your account? This action cannot be undone.",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Delete",
              style: "destructive",
              onPress: async () => {
                try {
                  const token = await AsyncStorage.getItem("authToken");
                  const response = await fetch(
                    `https://service-booking-backend-eb9i.onrender.com/api/auth/delete-account`,
                    {
                      method: "DELETE",
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  );
    
                  const result = await response.json();
                  if (response.ok) {
                    await AsyncStorage.removeItem("authToken");
                    setIsLoggedIn(false);
                    setUserDetails(null);
                    navigation.navigate("Home", { role: "Client" });
                    Toast.show({
                      type: "success",
                      text1: "Account Deleted",
                      text2: "Your account has been deleted successfully.",
                    });
                  } else {
                    Toast.show({
                      type: "error",
                      text1: "Delete Failed",
                      text2: result.message || "Something went wrong.",
                    });
                  }
                } catch (error) {
                  console.error("Error deleting account:", error);
                  Toast.show({
                    type: "error",
                    text1: "Error",
                    text2: "Something went wrong. Please try again.",
                  });
                }
              },
            },
          ]
        );
      },
      type: "danger",
      iconColor: "#dc3545",
    },    
    {
      icon: "log-out",
      title: "Logout",
      onPress: handleLogout,
      type: "danger",
      iconColor: "#dc3545"
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <View style={styles.content}>
        {settingsOptions.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.card,
              index === settingsOptions.length - 1 && styles.lastCard
            ]}
            onPress={option.onPress}
          >
            <View style={styles.optionContent}>
              <View style={styles.optionLeft}>
                <View style={[
                  styles.iconContainer,
                  { backgroundColor: `${option.iconColor}15` }
                ]}>
                  <Ionicons 
                    name={option.icon} 
                    size={24} 
                    color={option.iconColor}
                  />
                </View>
                <Text style={[
                  styles.optionText,
                  option.type === "danger" && styles.dangerText
                ]}>
                  {option.title}
                </Text>
              </View>
              {option.type === "navigation" && (
                <Ionicons 
                  name="chevron-forward" 
                  size={24} 
                  color="#1a237e" 
                />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9ff',
  },
  header: {
    backgroundColor: '#1a237e',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    flex: 1,
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
  },
  lastCard: {
    marginBottom: 0,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    flex: 1,
  },
  dangerText: {
    color: '#dc3545',
  },
});
