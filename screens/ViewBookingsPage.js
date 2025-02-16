import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Modal,
  Image,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';
import moment from 'moment';

const ViewBookingsPage = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState('Completed');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, [selectedTab]);
  
  const fetchBookings = async () => {
    try {
      setLoading(true);
      setBookings([]); // Prevent UI from going blank while loading
      
      const token = await AsyncStorage.getItem('authToken');
      
      if (!token) {
        Alert.alert('Authentication Error', 'You must log in to view bookings.');
        return navigation.navigate('Login');
      }

      const endpoint = `https://service-booking-backend-eb9i.onrender.com/api/book/provider/bookings/${selectedTab.toLowerCase()}`;
      
      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        const sortedBookings = response.data.bookings.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setBookings(sortedBookings || []);
      }
       else {
        Alert.alert('Error', response.data.message || 'Failed to fetch bookings.');
      }
    } catch (error) {
      console.error(`Error fetching ${selectedTab} bookings:`, error.message);
      Alert.alert('Unable to load bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchBookings();
    setRefreshing(false);
  };

  const handleRejectBooking = async (bookingId) => {
    Alert.alert(
      'Reject Booking',
      'Are you sure you want to reject this booking?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('authToken');
              const response = await axios.post(
                `https://service-booking-backend-eb9i.onrender.com/api/book/reject/${bookingId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
              );
  
              if (response.data.success) {
                Alert.alert('Success', 'The booking has been rejected.');
                await fetchBookings();
              } else {
                Alert.alert('Error', response.data.message || 'Failed to reject booking.');
              }
            } catch (error) {
              console.error('Error rejecting booking:', error.response?.data || error.message);
              Alert.alert(
                'Error',
                error.response?.data?.message || 'Unable to reject the booking. Please try again.'
              );
            }
          },
        },
      ]
    );
  };
  

  const handleAcceptBooking = async (bookingId) => {
    try {
      setLoading(true);
setBookings([]); // Prevent UI from going blank while loading

      const token = await AsyncStorage.getItem('authToken');
      const response = await axios.post(
        `https://service-booking-backend-eb9i.onrender.com/api/book/accept/${bookingId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (response.data.success) {
        Alert.alert('Success', 'Booking successfully accepted.');
        await fetchBookings();
      } else {
        Alert.alert('Error', response.data.message || 'Failed to accept booking.');
      }
    } catch (error) {
      console.error('Error accepting booking:', error.message);
      Alert.alert('Error', 'Unable to accept booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteCompletedJob = async (bookingId) => {
    Alert.alert(
      'Delete Completed Job',
      'Are you sure you want to delete this completed job?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('authToken');
  
              console.log(`Attempting to delete job with ID: ${bookingId}`);
  
              const response = await axios.delete(
                `https://service-booking-backend-eb9i.onrender.com/api/book/completed/${bookingId}`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
  
              console.log('Server Response:', response.data);
  
              if (response.data.success) {
                Alert.alert('Success', 'Completed job deleted successfully.');
                await fetchBookings();
              } else {
                console.error('Failed to delete job. Server response:', response.data);
                Alert.alert('Error', response.data.message || 'Failed to delete completed job.');
              }
  
            } catch (error) {
              console.error('Error deleting completed job:', error);
  
              let errorMessage = 'Unable to delete completed job. Please try again.';
              if (error.response) {
                console.error('Full error response:', JSON.stringify(error.response.data, null, 2));
  
                errorMessage = error.response.data?.message 
                  ? error.response.data.message 
                  : JSON.stringify(error.response.data, null, 2);
              } else if (error.request) {
                console.error('Request made but no response received:', error.request);
                errorMessage = 'No response from the server. Check your internet connection.';
              } else {
                console.error('Unexpected error:', error.message);
                errorMessage = error.message;
              }
  
              Alert.alert('Error', errorMessage);
            }
          },
        },
      ]
    );
  };
  
  
  const handleDeleteRejectedRecord = async (bookingId) => {
    Alert.alert(
      'Delete Rejected Record',
      'Are you sure you want to delete this rejected booking?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('authToken');
              const response = await axios.delete(
                `https://service-booking-backend-eb9i.onrender.com/api/book/rejected/${bookingId}`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
              if (response.data.success) {
                Alert.alert('Success', 'Rejected booking deleted successfully.');
                await fetchBookings();
              } else {
                Alert.alert('Error', response.data.message || 'Failed to delete rejected booking.');
              }
            } catch (error) {
              console.error('Error deleting rejected booking:', error.response?.data || error.message);
              Alert.alert(
                'Error',
                error.response?.data?.message || 'Unable to delete rejected booking. Please try again.'
              );
            }
          },
        },
      ]
    );
  };
  
  const handleCompleteJob = async (bookingId) => {
    Alert.alert(
      'Complete Job',
      'Are you sure you want to mark this job as completed?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Complete',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('authToken');
              const response = await axios.post(
                `https://service-booking-backend-eb9i.onrender.com/api/book/complete/${bookingId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
              );
  
              if (response.data.success) {
                Alert.alert('Success', 'The job has been marked as completed. The client has been notified.');
                await fetchBookings();
              } else {
                Alert.alert('Error', response.data.message || 'Failed to complete the job.');
              }
            } catch (error) {
              console.error('Error completing job:', error.response?.data || error.message);
              Alert.alert(
                'Error',
                error.response?.data?.message || 'Unable to complete the job. Please try again.'
              );
            }
          },
        },
      ]
    );
  };
  

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return '#2E7D32';
      case 'Confirmed': return '#4CAF50';
      case 'Pending': return '#FFC107';
      case 'Rejected': return '#E53935';
      default: return '#757575';
    }
  };

  const renderBookingItem = ({ item }) => (
    <TouchableOpacity
      style={styles.bookingCard}
      onPress={() => {
        setSelectedBooking(item);
        setDetailsVisible(true);
      }}
      activeOpacity={0.9}
    >
      <View style={styles.cardHeader}>
        <Image
          source={{
            uri: item.profileImage
              ? `https://service-booking-backend-eb9i.onrender.com/${item.profileImage}`
              : "http://192.168.8.138:5001/uploads/default-profile.png",
          }}
          style={styles.profileImage}
        />
        <View style={styles.headerTextContainer}>
          <Text style={styles.clientName}>{item.clientName}</Text>
          <Text style={styles.serviceName}>{item.serviceName}</Text>
        </View>
        <MaterialIcons 
          name="chevron-right" 
          size={24} 
          color="#1a237e" 
          style={styles.chevron}
        />
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <MaterialIcons name="event" size={18} color="#666" />
          
          <Text style={styles.detailText}>
  {moment(item.date).format('dddd, MMMM D, YYYY')} <Text>•</Text> {moment(item.time, 'HH:mm').format('hh:mm A')}
</Text>

        </View>

        <View style={styles.statusRow}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status}
          </Text>
        </View>
      </View>

      <View style={styles.actionContainer}>
        {selectedTab === 'Pending' && (
          <>
            <TouchableOpacity
              style={[styles.actionButton, styles.rejectButton]}
              onPress={() => handleRejectBooking(item.id)}
            >
              <MaterialIcons name="close" size={18} color="#fff" />
              <Text style={styles.buttonText}>Reject</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.acceptButton]}
              onPress={() => handleAcceptBooking(item.id)}
            >
              <MaterialIcons name="check" size={18} color="#fff" />
              <Text style={styles.buttonText}>Accept</Text>
            </TouchableOpacity>
          </>
        )}

        {selectedTab === 'Confirmed' && (
          <TouchableOpacity
            style={[styles.actionButton, styles.completeButton]}
            onPress={() => handleCompleteJob(item.id)}
          >
            <MaterialIcons name="done-all" size={18} color="#fff" />
            <Text style={styles.buttonText}>Complete Job</Text>
          </TouchableOpacity>
        )}

        {(selectedTab === 'Completed' || selectedTab === 'Rejected') && (
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => selectedTab === 'Completed' 
              ? handleDeleteCompletedJob(item.id) 
              : handleDeleteRejectedRecord(item.id)}
          >
            <MaterialIcons name="delete" size={18} color="#fff" />
            <Text style={styles.buttonText}>
              {selectedTab === 'Completed' ? 'Delete Job' : 'Delete Record'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.tapHint}>Tap card for details →</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingOverlay}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Processing, please wait...</Text>
      </View>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Bookings</Text>
        <View style={styles.bookingCount}>
          <Text style={styles.countText}>{bookings.length} bookings</Text>
        </View>
      </View>

      <View style={styles.tabContainer}>
        {['Completed', 'Confirmed', 'Pending', 'Rejected'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tabItem,
              selectedTab === tab && styles.activeTabItem
            ]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text style={[
              styles.tabText,
              selectedTab === tab && styles.activeTabText
            ]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderBookingItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#1a237e']}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="event-busy" size={64} color="#9e9e9e" />
            <Text style={styles.emptyText}>No {selectedTab.toLowerCase()} bookings found</Text>
          </View>
        }
      />

      <Modal visible={detailsVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Image
              source={{
                uri: selectedBooking?.profileImage
                  ? `https://service-booking-backend-eb9i.onrender.com/${selectedBooking.profileImage}`
                  : "https://service-booking-backend-eb9i.onrender.com/uploads/default-profile.png",
              }}
              style={styles.modalImage}
            />
            
            <Text style={styles.modalTitle}>{selectedBooking?.clientName}</Text>
            
            <View style={styles.modalSection}>
  <View style={styles.modalRow}>
    <MaterialIcons name="work" size={20} color="#666" />
    <Text style={styles.modalText}>{selectedBooking?.serviceName}</Text>
  </View>
  <View style={styles.modalRow}>
    <MaterialIcons name="email" size={20} color="#666" />
    <Text style={styles.modalText}>{selectedBooking?.email}</Text>
  </View>
  <View style={styles.modalRow}>
    <MaterialIcons name="phone" size={20} color="#666" />
    <Text style={styles.modalText}>{selectedBooking?.phone}</Text>
  </View>
  <View style={styles.modalRow}>
    <MaterialIcons name="schedule" size={20} color="#666" />
    <Text style={styles.modalText}>
      {moment(selectedBooking?.date).format('dddd, MMMM D, YYYY')} at {moment(selectedBooking?.time, 'HH:mm').format('hh:mm A')}
    </Text>
  </View>
  <View style={styles.modalRow}> 
    <MaterialIcons name="location-on" size={20} color="#666" />
    <Text style={styles.modalText}>{selectedBooking?.address}</Text>
  </View>
  <View style={styles.modalRow}>
  <MaterialIcons name="fiber-manual-record" size={16} color={getStatusColor(selectedBooking?.status)} />
  <Text style={styles.modalText}>{selectedBooking?.status}</Text>
</View>

 
</View>


            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setDetailsVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close Details</Text>
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
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#1a237e',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    flex: 1,
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  bookingCount: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  countText: {
    color: '#fff',
    fontSize: 14,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tabItem: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTabItem: {
    borderBottomColor: '#1a237e',
  },
  tabText: {
    fontSize: 15,
    color: '#666',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#1a237e',
  },
  bookingCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    margin: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#eee',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  clientName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },
  serviceName: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  chevron: {
    marginLeft: 'auto',
  },
  detailsContainer: {
    marginTop: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  actionContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 15,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    flex: 1,
    justifyContent: 'center',
    gap: 8,
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#E53935',
  },
  completeButton: {
    backgroundColor: '#1a237e',
  },
  deleteButton: {
    backgroundColor: '#c62828',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 14,
  },
  tapHint: {
    color: '#1a237e',
    fontSize: 12,
    marginTop: 10,
    textAlign: 'right',
    opacity: 0.7,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#95a5a6',
    marginTop: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '90%',
  },
  modalImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#1a237e',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a237e',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalSection: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 16,
  },
  modalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
  },
  modalText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#2c3e50',
  },
  closeButton: {
    backgroundColor: '#1a237e',
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
  },
  closeButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
 loadingOverlay: {
     position: "absolute",
     top: 0,
     left: 0,
     right: 0,
     bottom: 0,
     justifyContent: "center",
     alignItems: "center",
     backgroundColor: "rgba(26, 35, 126, 0.95)", // Using your PRIMARY_COLOR with opacity
     zIndex: 999,
   },
   
   loadingContainer: {
     backgroundColor: "white",
     padding: 30,
     borderRadius: 16,
     alignItems: "center",
     width: '80%',
     maxWidth: 300,
     shadowColor: "#000",
     shadowOffset: {
       width: 0,
       height: 2,
     },
     shadowOpacity: 0.25,
     shadowRadius: 3.84,
     elevation: 5,
   },
   
   loadingText: {
     marginTop: 16,
     fontSize: 16,
     color: "#fff",
     fontWeight: "500",
     textAlign: "center",
     letterSpacing: 0.5,
     fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
   },
  
});

export default ViewBookingsPage;