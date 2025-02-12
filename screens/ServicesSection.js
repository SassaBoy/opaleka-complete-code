import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  FlatList,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const ServicesSection = ({ services, availableServices, onUpdate, onDelete }) => {
  const [showServiceModal, setShowServiceModal] = useState(false);

  const renderServiceModal = () => (
    <Modal
      visible={showServiceModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowServiceModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Service</Text>
          <FlatList
            data={availableServices}
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.serviceOption}
                onPress={() => {
                  onUpdate(services.length, {
                    name: item.name,
                    category: item.category,
                    price: "0"
                  });
                  setShowServiceModal(false);
                }}
              >
                <Text style={styles.serviceOptionText}>{item.name}</Text>
                <Text style={styles.categoryText}>{item.category}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowServiceModal(false)}
          >
            <Text style={styles.closeButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <View>
      {services.map((service, index) => (
        <View key={index} style={styles.serviceCard}>
          <View style={styles.serviceHeader}>
            <Text style={styles.serviceName}>{service.name}</Text>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => onDelete(index)}
            >
              <MaterialIcons name="delete" size={24} color="red" />
            </TouchableOpacity>
          </View>
          <Text style={styles.categoryText}>{service.category}</Text>
          <TextInput
            style={styles.priceInput}
            value={service.price}
            onChangeText={(text) => 
              onUpdate(index, { ...service, price: text })
            }
            keyboardType="numeric"
            placeholder="Enter price"
          />
        </View>
      ))}
      
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowServiceModal(true)}
      >
        <MaterialIcons name="add" size={24} color="#00AEEF" />
        <Text style={styles.addButtonText}>Add Service</Text>
      </TouchableOpacity>

      {renderServiceModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  serviceCard: {
    backgroundColor: '#F5F6FA',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  priceInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },
  deleteButton: {
    padding: 5,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  addButtonText: {
    marginLeft: 8,
    color: '#00AEEF',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  serviceOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  serviceOptionText: {
    fontSize: 16,
    color: '#333',
  },
  closeButton: {
    marginTop: 15,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'red',
    fontWeight: 'bold',
  },
});

export default ServicesSection;