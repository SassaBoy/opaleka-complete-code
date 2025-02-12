import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const ReservationDetailsPage = ({ navigation, route }) => {
  // Mock client reservation details
  const reservation = {
    clientName: "Natalia Brown",
    clientAvatar:
      "https://th.bing.com/th/id/R.598eb694888d7cb70a2e71cc8458919a?rik=WLEM%2bX7xOtJ%2b0A&pid=ImgRaw&r=0",
    service: "House Cleaning",
    date: "2025-02-05",
    time: "10:00 AM",
    price: "NAD 350",
  };

  const handleAccept = () => {
    Alert.alert("Reservation Accepted", "You have accepted the reservation.");
    navigation.goBack();
  };

  const handleDecline = () => {
    Alert.alert(
      "Decline Reservation",
      "Are you sure you want to decline this reservation?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          style: "destructive",
          onPress: () => {
            Alert.alert("Reservation Declined", "You have declined the reservation.");
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reservation Details</Text>
      </View>

      {/* Client Details Section */}
      <View style={styles.detailsSection}>
        <Image source={{ uri: reservation.clientAvatar }} style={styles.avatar} />
        <View style={styles.clientDetails}>
          <Text style={styles.clientName}>{reservation.clientName}</Text>
          <Text style={styles.serviceText}>{reservation.service}</Text>
          <Text style={styles.dateText}>Date: {reservation.date}</Text>
          <Text style={styles.timeText}>Time: {reservation.time}</Text>
          <Text style={styles.priceText}>Total Price: {reservation.price}</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.acceptButton} onPress={handleAccept}>
          <Icon name="check-circle" size={24} color="#fff" />
          <Text style={styles.actionButtonText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.declineButton} onPress={handleDecline}>
          <Icon name="cancel" size={24} color="#fff" />
          <Text style={styles.actionButtonText}>Decline</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9ff",
  },
  header: {
    backgroundColor: "#1a237e",
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: 0.5,
  },
  detailsSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 16,
  },
  clientDetails: {
    flex: 1,
  },
  clientName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a237e",
  },
  serviceText: {
    fontSize: 16,
    color: "#4F4F4F",
    marginVertical: 4,
  },
  dateText: {
    fontSize: 16,
    color: "#4F4F4F",
    marginBottom: 4,
  },
  timeText: {
    fontSize: 16,
    color: "#4F4F4F",
    marginBottom: 4,
  },
  priceText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a237e",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 32,
    paddingHorizontal: 16,
  },
  acceptButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  declineButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E53935",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});

export default ReservationDetailsPage;
