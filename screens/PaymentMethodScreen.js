import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const PaymentMethodScreen = ({ navigation }) => {
  const paymentMethods = [
    {
      id: '1',
      title: 'Card Payment',
      icon: 'credit-card',
      color: '#4CAF50',
      screen: 'CardPayment',
      description: 'Pay with credit or debit card',
    },
    {
      id: '2',
      title: 'Bank Transfer',
      icon: 'account-balance',
      color: '#1976D2',
      screen: 'BankTransferScreen',
      description: 'Direct bank transfer payment',
    },
    {
      id: '3',
      title: 'Mobile Payment',
      icon: 'smartphone',
      color: '#E91E63',
      screen: 'MobilePaymentScreen',
      description: 'Pay using mobile payment services',
    },
  ];

  const handlePaymentMethodPress = (screen) => {
    navigation.navigate(screen);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Methods</Text>
        <View style={styles.rightHeader}>
          <TouchableOpacity>
            <MaterialIcons name="credit-card" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Select Payment Method</Text>
        
        {paymentMethods.map((method) => (
          <TouchableOpacity
            key={method.id}
            style={styles.paymentCard}
            onPress={() => handlePaymentMethodPress(method.screen)}
          >
            <View style={styles.paymentHeader}>
              <View style={[styles.iconContainer, { backgroundColor: `${method.color}20` }]}>
                <MaterialIcons name={method.icon} size={24} color={method.color} />
              </View>
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentTitle}>{method.title}</Text>
                <Text style={styles.paymentDescription}>{method.description}</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#1a237e" />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

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
  rightHeader: {
    marginLeft: 16,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a237e',
    marginBottom: 16,
    marginTop: 8,
  },
  paymentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    overflow: 'hidden',
  },
  paymentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a237e',
    marginBottom: 4,
  },
  paymentDescription: {
    fontSize: 14,
    color: '#666666',
  },
  addMethodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
  },
  addMethodText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a237e',
    marginLeft: 8,
  },
});

export default PaymentMethodScreen;