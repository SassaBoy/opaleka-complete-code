import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Image,
  Alert,
  Modal,
  LogBox,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const HistoryPage = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState('Recent');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  
  LogBox.ignoreAllLogs();
  const [history, setHistory] = useState([]); // Initially an empty array

  const handleRefresh = async () => {
    setRefreshing(true);
    const statusMap = {
      Recent: 'all',
      Completed: 'completed',
      Cancelled: 'rejected',
    };
    
    await fetchHistoryData(statusMap[selectedTab]);
setHistory((prev) => prev.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    setRefreshing(false);
  };
  

  useEffect(() => {
    fetchHistoryData('all'); // Fetch "All" data on mount
  }, []);

  const fetchHistoryData = async (status = 'all') => {
    const cacheKey = `history_${status}`;
  
    try {
      setLoading(true);
  
      // Load cached data first
      const cachedData = await AsyncStorage.getItem(cacheKey);
      if (cachedData) {
        setHistory(JSON.parse(cachedData));
        setLoading(false);
      }
  
      // Fetch fresh data
      const token = await AsyncStorage.getItem('authToken');
      const endpoint = {
        all: 'http://192.168.8.138:5001/api/book/history/all', 
        completed: 'http://192.168.8.138:5001/api/book/history/completed', 
        rejected: 'http://192.168.8.138:5001/api/book/history/rejected',
      }[status];
  
      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (response.data.success) {
        const mappedData = response.data.data.map((booking) => ({
          id: booking._id,
          serviceName: booking.serviceName,
          date: booking.date,
          time: booking.time,
          price: booking.price !== undefined && booking.price !== null ? `N$ ${booking.price}` : 'N$ 0.00', // ✅ Correct price formatting
          status: booking.status || 'pending',
          createdAt: booking.createdAt || new Date().toISOString(),
          providerId: booking.providerId
            ? {
                name: booking.providerId.name || 'Unknown Provider',
                email: booking.providerId.email || 'Not Provided',
                phone: booking.providerId.phone || 'Not Provided',
                profileImage: booking.providerId.profileImage || null,
              }
            : {
                name: 'Unknown Provider',
                email: 'Not Provided',
                phone: 'Not Provided',
                profileImage: null,
              },
        }));
        
  
        const sortedData = mappedData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
        setHistory(sortedData);
        await AsyncStorage.setItem(cacheKey, JSON.stringify(sortedData));
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  
  // Delete this duplicate useEffect
useEffect(() => {
  const loadCachedData = async () => {
    const cachedData = await AsyncStorage.getItem('history_all');
    if (cachedData) {
      setHistory(JSON.parse(cachedData));
    }
    fetchHistoryData('all');
  };

  loadCachedData();
}, []);
  
const handleTabChange = (tab) => {
  setSelectedTab(tab);
  
  const statusMap = {
    Recent: 'all',
    Completed: 'completed',
    Cancelled: 'rejected',
  };
  
  fetchHistoryData(statusMap[tab]);
};
const handleDeleteRejectedRecord = async (id) => {
  Alert.alert(
    'Delete Record',
    'Are you sure you want to delete this rejected service record? This will only remove it from your history.',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem('authToken');
            const response = await axios.put(
              `http://192.168.8.138:5001/api/book/rejected/${id}`,
              {},
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
              // Update UI immediately (only for this user)
              const updatedHistory = history.filter(service => service.id !== id);
              setHistory(updatedHistory);

              // Update local cache
              await AsyncStorage.setItem('history_all', JSON.stringify(updatedHistory));
              await AsyncStorage.setItem('history_rejected', JSON.stringify(
                updatedHistory.filter(item => item.status?.toLowerCase().trim().includes('rejected'))
              ));

              Alert.alert('Success', 'Rejected record removed from your history.');
            } else {
              Alert.alert('Error', response.data.message || 'Failed to remove rejected record.');
            }
          } catch (error) {
            console.error('Error removing rejected record:', error.response?.data || error.message);
            Alert.alert('Error', 'An error occurred while removing the rejected record.');
          }
        },
      },
    ]
  );
};


  const handleCancelBooking = async (id) => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('authToken');
              const response = await axios.put(
                `http://192.168.8.138:5001/api/book/cancel/${id}`, 
                {},
                { headers: { Authorization: `Bearer ${token}` } }
              );
  
              if (response.data.success) {
                setHistory((prev) =>
                  prev.map((service) =>
                    service.id === id ? { ...service, status: 'rejected' } : service
                  )
                );
                Alert.alert('Success', 'Your booking has been cancelled.');
              } else {
                Alert.alert('Error', response.data.message || 'Failed to cancel booking.');
              }
            } catch (error) {
              console.error('Error cancelling booking:', error.response?.data || error.message);
              Alert.alert('Error', 'An error occurred while cancelling the booking.');
            }
          },
        },
      ]
    );
  };
  const handleDeleteRecord = async (id) => {
    Alert.alert(
      'Delete Record',
      'Are you sure you want to delete this completed service record? This will only remove it from your history.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('authToken');
              const response = await axios.put(
                `http://192.168.8.138:5001/api/book/completed/${id}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
              );
  
              if (response.data.success) {
                // Remove the record from UI only for this user
                const updatedHistory = history.filter(service => service.id !== id);
                setHistory(updatedHistory);
  
                // Update cache to reflect soft deletion
                await AsyncStorage.setItem('history_all', JSON.stringify(updatedHistory));
                await AsyncStorage.setItem('history_completed', JSON.stringify(
                  updatedHistory.filter(item => item.status?.toLowerCase().trim().includes('completed'))
                ));
  
                Alert.alert('Success', 'Completed record removed from your history.');
              } else {
                Alert.alert('Error', response.data.message || 'Failed to remove record.');
              }
            } catch (error) {
              console.error('Error removing record:', error.response?.data || error.message);
              Alert.alert('Error', 'An error occurred while removing the record.');
            }
          },
        },
      ]
    );
  };
  

  const getStatusColor = (status) => {
    if (!status) {
      return '#757575'; // Default color if status is undefined
    }
    switch (status.toLowerCase()) {
      case 'completed':
        return '#4CAF50';
      case 'cancelled':
        return '#E53935';
      default:
        return '#757575';
    }
  };
  const renderHistoryItem = ({ item }) => (
    <TouchableOpacity
    style={styles.historyCard}
    onPress={() => {
      setSelectedService(item);
      setDetailsVisible(true);
    }}
  >
    
    <View style={styles.cardHeader}>
  <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(item.status) }]} />
  <Image
    source={{
      uri: item?.providerId?.profileImage
        ? `http://192.168.8.138:5001/${item.providerId.profileImage.replace(/\\/g, '/')}`
        : 'http://192.168.8.138:5001/uploads/default-profile.png',
    }}
    style={styles.providerImage}
    defaultSource={require('../assets/default-profile.png')}
  />
  <View style={styles.headerInfo}>
  <Text style={styles.serviceText}>{item?.providerId?.name ?? 'Unknown Provider'}</Text>

    <Text style={styles.providerName}>{item.serviceName || 'Unknown Service'}</Text>
  </View>
  <MaterialIcons name="chevron-right" size={24} color="#1a237e" />
</View>

<View style={styles.serviceDetails}>
  <View style={styles.detailRow}>
    <MaterialIcons name="event" size={20} color="#666" />
    <Text style={styles.detailText}>
      {new Date(item.date).toLocaleDateString()} {/* Consistent date display */}
    </Text>
  </View>

  <View style={styles.detailRow}>
    <MaterialIcons name="access-time" size={20} color="#666" />
    <Text style={styles.detailText}>
      {new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} {/* Consistent time display */}
    </Text>
  </View>

  <View style={styles.priceContainer}>
    <Text style={styles.priceText}>{item.price}</Text>
    <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
      {item.status}
    </Text>
  </View>


        <View style={styles.actionButtonsContainer}>
        {item.status.toLowerCase() === 'completed' ? (
  <TouchableOpacity 
    style={styles.deleteButton} 
    onPress={() => handleDeleteRecord(item.id)}
  >
    <MaterialIcons name="delete" size={20} color="#ffffff" />
    <Text style={styles.deleteButtonText}>Delete Completed</Text>
  </TouchableOpacity>
) : item.status.toLowerCase() === 'rejected' ? (
  <TouchableOpacity 
    style={styles.deleteButton} 
    onPress={() => handleDeleteRejectedRecord(item.id)} // Calls the new function for rejected records
  >
    <MaterialIcons name="delete" size={20} color="#ffffff" />
    <Text style={styles.deleteButtonText}>Delete Rejected</Text>
  </TouchableOpacity>
) : null}


      
{selectedTab === 'Recent' && (
  <TouchableOpacity 
    style={styles.cancelButton} 
    onPress={() => handleCancelBooking(item.id)} // ✅ Calls only once
  >
    <MaterialIcons name="cancel" size={20} color="#ffffff" />
    <Text style={styles.cancelButtonText}>Cancel Booking</Text>
  </TouchableOpacity>
)}
 </View>
      </View>
    </TouchableOpacity>
  );
  
  console.log("Raw history data:", history); // Add this to debug
  const filteredHistory = useMemo(() => {
    return history.filter((service) => {
      if (!service || !service.status) return false;
      
      const status = service.status.toLowerCase().trim();
      
      switch (selectedTab) {
        case 'Recent':
          return status.includes('pending');
        case 'Completed':
          return status.includes('completed');
        case 'Cancelled':
          return status.includes('rejected');
        default:
          return false;
      }
    });
  }, [history, selectedTab]);

{loading && (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#1a237e" />
  </View>
)}

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <MaterialIcons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
      
      <Text style={styles.headerTitle}>Service History</Text>
      <View style={styles.countBadge}>
        <Text style={styles.countText}>
          {history.length} services
        </Text>
      </View>
    </View>

    <View style={styles.tabs}>
      {['Recent', 'Completed', 'Cancelled'].map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[styles.tab, selectedTab === tab && styles.activeTab]}
          onPress={() => handleTabChange(tab)}
        >
          <Text style={[styles.tabText, selectedTab === tab && styles.activeTabText]}>{tab}</Text>
        </TouchableOpacity>
      ))}
    </View>


    <FlatList
  data={filteredHistory}
  keyExtractor={(item) => item.id}
  renderItem={renderHistoryItem}
  contentContainerStyle={styles.listContainer}
  refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
  initialNumToRender={5}
  maxToRenderPerBatch={10}
  windowSize={10}
  removeClippedSubviews={true}
  ListEmptyComponent={() => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="history" size={64} color="#9e9e9e" />
      <Text style={styles.emptyText}>
        {selectedTab === 'Recent' 
          ? 'No recent services found' 
          : selectedTab === 'Completed' 
          ? 'No completed services yet' 
          : 'No cancelled services found'}
      </Text>
    </View>
  )}
/>



<Modal visible={detailsVisible} animationType="slide" transparent>
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        {/* Profile image */}
        <Image
          source={{
            uri: selectedService?.providerId?.profileImage
              ? `http://192.168.8.138:5001/${selectedService.providerId.profileImage.replace(/\\/g, '/')}`
              : 'https://via.placeholder.com/50',
          }}
          style={styles.providerImage1}
        />

        {/* Provider Name */}
        <Text style={styles.modalTitle}>
  {selectedService?.providerId?.name ?? 'Unknown Provider'}
</Text>


     <View style={styles.modalDetailRow}>
  <MaterialIcons name="work" size={20} color="#666" />
  <Text style={styles.modalDetailText}>
    Service: {selectedService?.serviceName || 'Unknown Service'}
  </Text>
</View>
<View style={styles.modalDetailRow}>
  <MaterialIcons name="event" size={20} color="#666" />
  <Text style={styles.modalDetailText}>
  Date: {selectedService?.date ? new Date(selectedService.date).toLocaleDateString() : 'N/A'}
</Text>
</View>

<View style={styles.modalDetailRow}>
  <MaterialIcons name="access-time" size={20} color="#666" />
  <Text style={styles.modalDetailText}>
  Time: {selectedService?.time ? new Date(selectedService.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
</Text>
</View>
<View style={styles.modalDetailRow}>
  <MaterialIcons name="person" size={20} color="#666" />
  <Text style={styles.modalDetailText}>
  Email: {selectedService?.providerId?.email ?? 'Not Provided'}
</Text>
</View>
<View style={styles.modalDetailRow}>
  <MaterialIcons name="phone" size={20} color="#666" />
  <Text style={styles.modalDetailText}>
    Phone: {selectedService?.providerId?.phone || 'Not provided'}
  </Text>
</View>
<View style={styles.modalDetailRow}>
  <MaterialIcons name="payment" size={20} color="#666" />
  <Text style={styles.modalDetailText}>Price: {selectedService?.price}</Text>
</View>
<View style={styles.modalDetailRow}>
  <MaterialIcons name="info" size={20} color="#666" />
  <Text style={styles.modalDetailText}>Status: {selectedService?.status}</Text>
</View>

        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setDetailsVisible(false)}
        >
          <Text style={styles.closeButtonText}>Close</Text>
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
    backgroundColor: '#f0f2f5',
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
  countBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  countText: {
    fontSize: 14,
    color: '#ffffff',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#1a237e',
  },
  tabText: {
    fontSize: 15,
    color: '#6c757d',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#1a237e',
    fontWeight: '700',
  },
  listContainer: {
    padding: 16,
    paddingTop: 8,
  },
  historyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    marginBottom: 20,
    marginHorizontal: 8,
    width: '100%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 7,
    borderWidth: 1.5,
    borderColor: '#e6e6e6',
    overflow: 'hidden',
    paddingBottom: 24,
  },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  statusIndicator: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  serviceText: {
    flex: 1,
    fontSize: 18,
    fontWeight: '800',
    color: '#2c3e50',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },

  serviceDetails: {
    padding: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#f1f3f5',
    borderRadius: 10,
  },
  detailText: {
    fontSize: 15,
    color: '#495057',
    marginLeft: 10,
    flex: 1,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  priceText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a237e',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
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
    opacity: 0.7,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#9e9e9e',
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 24,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 7,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a237e',
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: 0.5,
    marginTop: -40,
    marginLeft: -60,
  },
  modalDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  modalDetailText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },
  closeButton: {
    marginTop: 24,
    backgroundColor: '#E53935',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    textTransform: 'uppercase',
  },

  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly', // More balanced spacing
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    borderRadius: 12,
  },
  
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14, // Increased for better clickability
    paddingHorizontal: 12,
    borderRadius: 15, // Smoother rounded corners
    backgroundColor: '#D32F2F', // More vibrant red
    marginHorizontal: 6, // More space between buttons
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  
  deleteButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    marginLeft: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  
  cancelButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14, // More height
    paddingHorizontal: 12,
    borderRadius: 15, // Smoother rounded edges
    backgroundColor: '#FF9800', // Brighter orange
    marginHorizontal: 6,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  
  cancelButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    marginLeft: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    gap: 10, // Add spacing between elements for better alignment
  },
  headerInfo: {
    flex: 1,
    justifyContent: 'flex-start', // Aligns text better with the moved image
    marginLeft: 8,
    marginTop: 2, // Slightly adjusts name positioning for better balance
  },
  
  statusIndicator: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  serviceText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2c3e50',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  providerName: {
    fontSize: 14,
    color: '#666',
  },
  providerImage: {
    width: 60,
    height: 60,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#fff',
    marginTop: 6, // Moves image slightly down for better alignment with the name
  },
  
  providerImage1: {
    width: 60,
    height: 60,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#fff',
    marginTop: 30, // Moves image slightly down for better alignment with the name
  },
  
});


export default HistoryPage;