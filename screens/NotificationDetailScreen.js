import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  Animated,
  Share,
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const NotificationDetailScreen = ({ route }) => {
  const { notification } = route.params;
  const navigation = useNavigation();
  const scrollY = new Animated.Value(0);

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.9],
    extrapolate: "clamp",
  });

  const formatDate = (date) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  const handleShare = async () => {
    try {
      const messageDetails = formatNotificationMessage(notification.message);
      const shareMessage = [
        notification.title,
        ...messageDetails.map(item => `${item.label}: ${item.value}`)
      ].join('\n');
  
      await Share.share({
        message: shareMessage,
      });
    } catch (error) {
      console.error("Error sharing notification:", error);
    }
  };

  const getRelativeTime = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return formatDate(date);
  };

  const formatNotificationMessage = (message) => {
    try {
      const parsedMessage = JSON.parse(message);
      return [
        { label: "Service", value: parsedMessage.serviceName },
        { label: "Date", value: new Date(parsedMessage.date).toLocaleDateString() },
        { label: "Time", value: new Date(parsedMessage.time).toLocaleTimeString() },
        { label: "Price", value: `N$${parsedMessage.price}` },
        { label: "Client Name", value: parsedMessage.clientName },
        { label: "Client Email", value: parsedMessage.clientEmail },
        { label: "Client Phone", value: parsedMessage.clientPhone },
        { label: "Address", value: parsedMessage.address } // Include address field
      ];
    } catch (error) {
      return [{ label: "Message", value: message }];
    }
  };
  

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Animated.View style={[styles.headerContainer, { opacity: headerOpacity }]}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notification Details</Text>
          <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
            <Ionicons name="share-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onScroll={(event) => {
          const offsetY = event.nativeEvent.contentOffset.y;
          scrollY.setValue(offsetY);
        }}
        scrollEventThrottle={16}
      >
        <View style={styles.content}>
          <View style={styles.card}>
            <View style={styles.titleContainer}>
              <View style={styles.iconContainer}>
                <MaterialIcons name="notifications" size={24} color="#1a237e" />
              </View>
              <Text style={styles.title}>{notification.title}</Text>
            </View>

            <View style={styles.metaContainer}>
              <View style={styles.metaItem}>
                <MaterialIcons name="access-time" size={16} color="#666" />
                <Text style={styles.metaText}>
                  {getRelativeTime(notification.createdAt)}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.messageContainer}>
              {formatNotificationMessage(notification.message).map((item, index) => (
                <View key={index} style={styles.messageRow}>
                  <Text style={styles.messageLabel}>{item.label}:</Text>
                  <Text style={styles.messageValue}>{item.value}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9ff",
  },
  headerContainer: {
    backgroundColor: "#1a237e",
    zIndex: 1000,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    paddingTop: Platform.OS === "ios" ? 12 : 32,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  shareButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 16,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingTop: 12,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#1a237e",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#f3f4ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a237e",
    flex: 1,
    letterSpacing: 0.2,
  },
  metaContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f6fa",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  metaText: {
    fontSize: 13,
    color: "#666",
    marginLeft: 6,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#e8e9ff",
    marginVertical: 16,
  },
  messageContainer: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 16,
  },
  messageRow: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "center",
  },
  messageLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a237e",
    marginRight: 10,
    width: 120,
  },
  messageValue: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
});

export default NotificationDetailScreen;