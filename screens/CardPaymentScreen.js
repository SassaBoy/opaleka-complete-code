import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const CardPaymentScreen = ({ navigation }) => {
  const [cardHolderName, setCardHolderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCvv] = useState('');
  const [saveDetails, setSaveDetails] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const formatCardNumber = (text) => {
    const cleaned = text.replace(/\s/g, '');
    const chunks = cleaned.match(/.{1,4}/g) || [];
    return chunks.join(' ');
  };

  const handleAddCard = () => {
    if (!agreeTerms) {
      // Show proper error message UI instead of alert
      return;
    }
    // Process card addition
    navigation.goBack();
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
        <Text style={styles.headerTitle}>Add Payment Card</Text>
        <View style={styles.rightHeader}>
          <TouchableOpacity>
            <MaterialIcons name="lock" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.cardPreview}>
          <MaterialIcons name="credit-card" size={32} color="#1a237e" />
          <Text style={styles.cardPreviewText}>
            {cardNumber || '•••• •••• •••• ••••'}
          </Text>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Card Information</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Cardholder Name</Text>
            <View style={styles.inputWrapper}>
              <MaterialIcons name="person" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter cardholder name"
                value={cardHolderName}
                onChangeText={setCardHolderName}
                placeholderTextColor="#999"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Card Number</Text>
            <View style={styles.inputWrapper}>
              <MaterialIcons name="credit-card" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="1234 5678 9012 3456"
                keyboardType="numeric"
                value={cardNumber}
                onChangeText={(text) => setCardNumber(formatCardNumber(text))}
                maxLength={19}
                placeholderTextColor="#999"
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputContainer, { flex: 1, marginRight: 12 }]}>
              <Text style={styles.label}>Expiry Date</Text>
              <View style={styles.inputWrapper}>
                <MaterialIcons name="event" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="MM"
                  keyboardType="numeric"
                  value={expiryMonth}
                  onChangeText={setExpiryMonth}
                  maxLength={2}
                  placeholderTextColor="#999"
                />
                <Text style={styles.divider}>/</Text>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="YYYY"
                  keyboardType="numeric"
                  value={expiryYear}
                  onChangeText={setExpiryYear}
                  maxLength={4}
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            <View style={[styles.inputContainer, { flex: 0.5 }]}>
              <Text style={styles.label}>CVV</Text>
              <View style={styles.inputWrapper}>
                <MaterialIcons name="lock" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="123"
                  keyboardType="numeric"
                  secureTextEntry
                  value={cvv}
                  onChangeText={setCvv}
                  maxLength={3}
                  placeholderTextColor="#999"
                />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.optionsSection}>
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setSaveDetails(!saveDetails)}
          >
            <View style={[styles.checkbox, saveDetails && styles.checkboxChecked]}>
              {saveDetails && <MaterialIcons name="check" size={16} color="#fff" />}
            </View>
            <View style={styles.checkboxContent}>
              <Text style={styles.checkboxLabel}>Save Card Details</Text>
              <Text style={styles.checkboxDescription}>
                Securely save this card for future payments
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setAgreeTerms(!agreeTerms)}
          >
            <View style={[styles.checkbox, agreeTerms && styles.checkboxChecked]}>
              {agreeTerms && <MaterialIcons name="check" size={16} color="#fff" />}
            </View>
            <View style={styles.checkboxContent}>
              <Text style={styles.checkboxLabel}>Accept Terms</Text>
              <Text style={styles.checkboxDescription}>
                I agree to the terms of service and privacy policy
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.addButton, !agreeTerms && styles.addButtonDisabled]}
          onPress={handleAddCard}
          disabled={!agreeTerms}
        >
          <MaterialIcons name="lock" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Add Card Securely</Text>
        </TouchableOpacity>
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
  cardPreview: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
  },
  cardPreviewText: {
    fontSize: 20,
    color: '#1a237e',
    marginTop: 8,
    letterSpacing: 2,
    fontWeight: '500',
  },
  formSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a237e',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    height: 56,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    marginHorizontal: -6,
  },
  divider: {
    fontSize: 20,
    color: '#666',
    marginHorizontal: 8,
  },
  optionsSection: {
    marginBottom: 24,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#1a237e',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: '#1a237e',
  },
  checkboxContent: {
    flex: 1,
  },
  checkboxLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  checkboxDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  footer: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  addButton: {
    backgroundColor: '#1a237e',
    borderRadius: 12,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
  },
  addButtonDisabled: {
    backgroundColor: '#9e9e9e',
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default CardPaymentScreen;