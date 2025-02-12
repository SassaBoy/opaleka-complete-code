import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Clipboard,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const BankTransferScreen = ({ navigation }) => {
  const handleCopy = (text) => {
    Clipboard.setString(text);
    // You could add a toast/notification here to show "Copied to clipboard"
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
        <Text style={styles.headerTitle}>Bank Transfer</Text>
        <View style={styles.rightHeader}>
          <MaterialIcons name="account-balance" size={24} color="#fff" />
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>Amount to Transfer</Text>
          <Text style={styles.amountValue}>NAD 200.00</Text>
          <TouchableOpacity 
            style={styles.copyButton}
            onPress={() => handleCopy('200.00')}
          >
            <MaterialIcons name="content-copy" size={20} color="#1a237e" />
            <Text style={styles.copyText}>Copy Amount</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.referenceSection}>
          <View style={styles.referenceCard}>
            <MaterialIcons name="info" size={24} color="#1a237e" />
            <Text style={styles.referenceText}>
              Please use your phone number as the payment reference
            </Text>
          </View>
        </View>

        <View style={styles.bankDetailsSection}>
          <Text style={styles.sectionTitle}>Bank Details</Text>
          <View style={styles.bankDetailCard}>
            <BankDetailRow 
              label="Account Name" 
              value="Opaleka Namibia Services" 
              onCopy={() => handleCopy('Opaleka Namibia Services')}
            />
            <BankDetailRow 
              label="Bank" 
              value="First National Bank" 
              onCopy={() => handleCopy('First National Bank')}
            />
            <BankDetailRow 
              label="Branch" 
              value="Windhoek" 
              onCopy={() => handleCopy('Windhoek')}
            />
            <BankDetailRow 
              label="Branch Code" 
              value="280172" 
              onCopy={() => handleCopy('280172')}
            />
            <BankDetailRow 
              label="SWIFT Code" 
              value="FIRNNANXXX" 
              onCopy={() => handleCopy('FIRNNANXXX')}
            />
            <BankDetailRow 
              label="Account Number" 
              value="62272889076" 
              onCopy={() => handleCopy('62272889076')}
              isLast
            />
          </View>
        </View>

        <View style={styles.notesSection}>
          <Text style={styles.sectionTitle}>Important Notes</Text>
          <View style={styles.noteCard}>
            <NoteItem 
              icon="phone" 
              text="Use your phone number as the payment reference to ensure proper tracking" 
            />
            <NoteItem 
              icon="receipt" 
              text="Keep your payment confirmation for future reference" 
            />
            <NoteItem 
              icon="schedule" 
              text="Payments are typically verified within 24 hours" 
            />
            <NoteItem 
              icon="support-agent" 
              text="Contact our support at +264 857 886 108 if you need assistance" 
              isLast
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const BankDetailRow = ({ label, value, onCopy, isLast }) => (
  <View style={[styles.bankDetailRow, !isLast && styles.bankDetailRowBorder]}>
    <Text style={styles.bankDetailLabel}>{label}</Text>
    <View style={styles.valueContainer}>
      <Text style={styles.bankDetailValue}>{value}</Text>
      <TouchableOpacity onPress={onCopy}>
        <MaterialIcons name="content-copy" size={20} color="#1a237e" />
      </TouchableOpacity>
    </View>
  </View>
);

const NoteItem = ({ icon, text, isLast }) => (
  <View style={[styles.noteItem, !isLast && styles.noteItemBorder]}>
    <MaterialIcons name={icon} size={20} color="#1a237e" style={styles.noteIcon} />
    <Text style={styles.noteText}>{text}</Text>
  </View>
);

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
  amountCard: {
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
  amountLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  amountValue: {
    fontSize: 32,
    color: '#1a237e',
    fontWeight: '600',
    marginBottom: 16,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  copyText: {
    color: '#1a237e',
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
  },
  referenceSection: {
    marginBottom: 24,
  },
  referenceCard: {
    backgroundColor: '#E8F0FE',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#B3D4F7',
  },
  referenceText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#1a237e',
    lineHeight: 22,
  },
  bankDetailsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a237e',
    marginBottom: 16,
  },
  bankDetailCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
  },
  bankDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  bankDetailRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bankDetailLabel: {
    fontSize: 14,
    color: '#666',
  },
  bankDetailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    marginRight: 12,
  },
  notesSection: {
    marginBottom: 24,
  },
  noteCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
  },
  noteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  noteItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  noteIcon: {
    marginRight: 12,
  },
  noteText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default BankTransferScreen;