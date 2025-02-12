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

const MobilePaymentScreen = ({ navigation }) => {
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
        <Text style={styles.headerTitle}>Mobile Payment</Text>
        <View style={styles.rightHeader}>
          <MaterialIcons name="lock" size={24} color="#fff" />
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.amountCard}>
          <MaterialIcons name="smartphone" size={32} color="#1a237e" />
          <Text style={styles.transferPreviewText}>
            NAD 200.00
          </Text>
        </View>

        <View style={styles.referenceSection}>
          <View style={styles.referenceCard}>
            <MaterialIcons name="info" size={24} color="#1a237e" />
            <Text style={styles.referenceText}>
              Please pay directly to the mobile number provided below using any of the mobile payment methods.
            </Text>
          </View>
        </View>

        <View style={styles.paymentDetailsSection}>
          <Text style={styles.sectionTitle}>Payment Details</Text>
          <View style={styles.detailCard}>
            <DetailRow 
              label="Phone Number" 
              value="+264 857 886 108" 
              onCopy={() => handleCopy('+264 857 886 108')}
            />
            <DetailRow 
              label="Amount" 
              value="NAD 200.00" 
              onCopy={() => handleCopy('200.00')}
              isLast
            />
          </View>
        </View>

        <View style={styles.methodsSection}>
          <Text style={styles.sectionTitle}>Accepted Payment Methods</Text>
          <View style={styles.detailCard}>
            <DetailRow 
              icon="account-balance-wallet"
              label="eWallet"
              showCopy={false}
            />
            <DetailRow 
              icon="account-balance-wallet"
              label="Blue Wallet"
              showCopy={false}
            />
            <DetailRow 
              icon="account-balance-wallet"
              label="Easy Wallet"
              showCopy={false}
              isLast
            />
          </View>
        </View>

        <View style={styles.notesSection}>
          <Text style={styles.sectionTitle}>Payment Instructions</Text>
          <View style={styles.noteCard}>
            <NoteItem 
              icon="phone-android" 
              text="Open your preferred mobile payment app" 
            />
            <NoteItem 
              icon="payments" 
              text="Select any of the payment methods listed above" 
            />
            <NoteItem 
              icon="dialpad" 
              text="Enter the recipient number: +264 857 886 108" 
            />
            <NoteItem 
              icon="attach-money" 
              text="Enter the amount: NAD 200.00" 
            />
            <NoteItem 
              icon="check-circle" 
              text="Confirm and save your payment receipt" 
              isLast
            />
          </View>
        </View>

        <View style={styles.supportSection}>
          <View style={styles.supportCard}>
            <MaterialIcons name="support-agent" size={24} color="#1a237e" />
            <Text style={styles.supportText}>
              Payments are verified within 24 hours. For support, contact us at{' '}
              <Text style={styles.highlight}>+264 857 886 108</Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const DetailRow = ({ icon, label, value, onCopy, showCopy = true, isLast }) => (
  <View style={[styles.detailRow, !isLast && styles.detailRowBorder]}>
    {icon && (
      <MaterialIcons name={icon} size={20} color="#1a237e" style={styles.detailIcon} />
    )}
    <Text style={styles.detailLabel}>{label}</Text>
    <View style={styles.valueContainer}>
      {value && <Text style={styles.detailValue}>{value}</Text>}
      {showCopy && onCopy && (
        <TouchableOpacity onPress={onCopy}>
          <MaterialIcons name="content-copy" size={20} color="#1a237e" />
        </TouchableOpacity>
      )}
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
  transferPreviewText: {
    fontSize: 24,
    color: '#1a237e',
    marginTop: 8,
    fontWeight: '600',
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
  paymentDetailsSection: {
    marginBottom: 24,
  },
  methodsSection: {
    marginBottom: 24,
  },
  notesSection: {
    marginBottom: 24,
  },
  supportSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a237e',
    marginBottom: 16,
  },
  detailCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  detailRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailIcon: {
    marginRight: 12,
  },
  detailLabel: {
    flex: 1,
    fontSize: 14,
    color: '#666',
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    marginRight: 12,
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
  supportCard: {
    backgroundColor: '#E8F0FE',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#B3D4F7',
  },
  supportText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#1a237e',
    lineHeight: 22,
  },
  highlight: {
    fontWeight: '600',
  },
});

export default MobilePaymentScreen;