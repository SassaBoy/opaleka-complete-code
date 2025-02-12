import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const fetchNotifications = async () => {
    const token = await AsyncStorage.getItem("authToken");
    try {
      setLoading(true);
      const response = await axios.get(
        "http://192.168.8.138:5001/api/auth/notifications",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      const readStatus = await AsyncStorage.getItem("readNotifications");
      const readNotifications = readStatus ? JSON.parse(readStatus) : [];
      
      const updatedNotifications = response.data.notifications.map(notification => ({
        ...notification,
        read: notification.read || readNotifications.includes(notification._id)
      }));
      
      setNotifications(updatedNotifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchNotifications();
    }, [])
  );

  const deleteNotification = async (notificationId) => {
    const token = await AsyncStorage.getItem("authToken");
    try {
      const response = await axios.delete(
        `http://192.168.8.138:5001/api/auth/notifications/${notificationId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications();
    setRefreshing(false);
  };

  const navigateToDetail = async (notification) => {
    const token = await AsyncStorage.getItem("authToken");
    if (!notification._id) return;

    try {
      await axios.put(
        `http://192.168.8.138:5001/api/auth/notifications/${notification._id}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const readStatus = await AsyncStorage.getItem("readNotifications");
      const readNotifications = readStatus ? JSON.parse(readStatus) : [];
      if (!readNotifications.includes(notification._id)) {
        readNotifications.push(notification._id);
        await AsyncStorage.setItem("readNotifications", JSON.stringify(readNotifications));
      }

      setNotifications(prev =>
        prev.map(item =>
          item._id === notification._id
            ? { ...item, read: true }
            : item
        )
      );

      navigation.navigate("NotificationDetail", { notification });
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const renderNotification = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        item.read ? styles.readNotification : styles.unreadNotification,
      ]}
      onPress={() => navigateToDetail(item)}
    >
      <View style={styles.iconContainer}>
        <MaterialIcons
          name={item.read ? "notifications-none" : "notifications-active"}
          size={24}
          color={item.read ? "#9e9e9e" : "#1a237e"}
        />
      </View>
  
      <View style={styles.contentContainer}>
        <Text
          style={[
            styles.notificationTitle,
            item.read && styles.readNotificationTitle,
          ]}
          numberOfLines={2}
        >
          {item.title}
        </Text>
        <Text
          style={[
            styles.notificationTime,
            item.read && styles.readNotificationTime,
          ]}
        >
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
  
      <TouchableOpacity onPress={() => deleteNotification(item._id)} style={{ marginLeft: "auto" }}>
        <MaterialIcons name="delete" size={24} color="#e53935" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1a237e" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        {notifications.length > 0 && (
          <Text style={styles.notificationCount}>
            {notifications.filter(n => !n.read).length} new
          </Text>
        )}
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item._id}
        renderItem={renderNotification}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="notifications-off" size={64} color="#9e9e9e" />
            <Text style={styles.emptyText}>No notifications yet</Text>
          </View>
        }
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    backgroundColor: '#1a237e',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  notificationCount: {
    fontSize: 14,
    color: '#ffffff',
    backgroundColor: '#ffffff20',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    overflow: 'hidden',
  },
  listContainer: {
    padding: 16,
    paddingTop: 8,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
  },
  unreadNotification: {
    backgroundColor: '#f8f9ff',
    borderWidth: 1,
    borderColor: '#1a237e15',
  },
  readNotification: {
    opacity: 0.85,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
    marginRight: 12,
  },
  notificationTitle: {
    fontSize: 16,
    color: '#1a237e',
    fontWeight: '600',
    marginBottom: 6,
    lineHeight: 22,
  },
  readNotificationTitle: {
    color: '#424242',
    fontWeight: '500',
  },
  notificationTime: {
    fontSize: 12,
    color: '#1a237e90',
    fontWeight: '500',
  },
  readNotificationTime: {
    color: '#75757590',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
    opacity: 0.9,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#757575',
    fontWeight: '500',
    letterSpacing: 0.2,
  },
});

export default NotificationsPage;