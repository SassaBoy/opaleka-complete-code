import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const sections = [
  {
    title: 'Accepted Payment Methods',
    content: 'Opaleka supports secure transactions using the following payment methods: Credit & Debit Cards (Visa, MasterCard), Mobile Money (E-wallets, Mobile Banking), Bank Transfers & Electronic Fund Transfers (EFT), Secure Payment Gateway (DPO Group).',
  },
  {
    title: 'Subscription & Billing',
    content: 'Service providers must subscribe to access Opaleka’s platform. The current subscription plan is a 30-Day Subscription: NAD 180 (one-time payment). Subscriptions do not auto-renew; service providers must manually renew their subscription.',
  },
  {
    title: 'Financial Terms for Service Providers',
    content: 'All service providers are responsible for handling transactions directly with clients. Payments between clients and providers occur outside of the Opaleka platform. Payments must be made before the subscription expiry date via EFT, Credit/Debit Cards, or Mobile Wallets.',
  },
  {
    title: 'Financial Terms',
    content: 'Clients make payments directly to service providers for services rendered. Opaleka does not process or handle these payments but provides a secure platform for service interactions.',
  },
  {
    title: 'Refund & Cancellation Policy',
    content: 'Subscription Cancellation: No refund for unused portions of a billing period. Service Cancellation: Full refund if canceled within 24 hours of booking. Dispute Resolution: Refund claims must be submitted within 7 days of the transaction.',
  },
  {
    title: 'Payment Security & Compliance',
    content: 'SSL/TLS encryption for all transactions, regular security audits, compliance with PCI-DSS standards, and real-time fraud detection ensure secure payments. Never share your payment credentials or verification codes.',
  },
  {
    title: 'Prohibited Activities',
    content: 'Engaging in fraudulent transactions, using unauthorized payment methods, circumventing Opaleka’s payment system, or sharing login credentials may result in account suspension or legal action.',
  },
  {
    title: 'Dispute Resolution & Legal Compliance',
    content: 'These payment terms are governed by the laws of Namibia. Disputes must first go through informal negotiation. If unresolved, parties may opt for arbitration through NAMFISA or legal action via Namibian courts.',
  },
  {
    title: 'Contact Information',
    content: 'For payment-related inquiries, contact Opaleka at: Address: Unit 13, Square Park, Windhoek, Namibia. Email: info@opaleka.com. Phone: +264 81 688 9761.',
  },
];

const PaymentTermsScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Terms</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {sections.map((section, index) => (
            <View key={index} style={[styles.section, index === sections.length - 1 && styles.lastSection]}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
              </View>
              <Text style={styles.sectionText}>{section.content}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C0032',
  },
  header: {
    backgroundColor: '#190061',
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
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  section: {
    backgroundColor: 'rgba(25, 0, 97, 0.5)',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    borderColor: 'rgba(86, 67, 253, 0.2)',
    borderWidth: 1,
  },
  lastSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#5643fd',
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#a68eff',
  },
  sectionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#fff',
  },
});

export default PaymentTermsScreen;
