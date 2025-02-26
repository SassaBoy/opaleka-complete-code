import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const sections = [
  {
    title: 'Agreement to Terms',
    content: 'By accessing or using Opaleka’s platform, you confirm that you have read, understood, and agreed to these Terms & Conditions. If you do not agree with any part of these terms, you must refrain from using the platform.',
  },
  {
    title: 'User Registration & Account Security',
    content: 'To access certain features of our platform, you must create an account. By registering, you agree to provide accurate and up-to-date information, maintain the confidentiality of your credentials, and notify Opaleka of any unauthorized access.',
  },
  {
    title: 'Service Provider Obligations',
    content: 'Service providers must maintain valid business registrations, licenses, and permits as required by law. They must provide accurate service descriptions, respond to inquiries within 24 hours, and uphold high service quality.',
  },
  {
    title: 'User Responsibilities & Code of Conduct',
    content: 'Users must engage in respectful interactions, provide honest feedback, respect privacy, and avoid fraudulent activities.',
  },
  {
    title: 'Payments, Fees & Refunds',
    content: 'All service fees are transparently stated before confirming a booking. Payments must be completed as agreed. Refunds are subject to Opaleka’s refund policy.',
  },
  {
    title: 'Prohibited Activities',
    content: 'Users are prohibited from providing false information, engaging in illegal behavior, bypassing payment systems, or misusing customer data.',
  },
  {
    title: 'Dispute Resolution & Liability',
    content: 'Opaleka facilitates mediation but is not liable for disputes. Users must attempt to resolve issues before seeking legal action.',
  },
  {
    title: 'Data Protection & Privacy Policy',
    content: 'Opaleka safeguards user data under its Privacy Policy. We do not share data without consent, and users can request data access, modification, or deletion.',
  },
  {
    title: 'Termination & Suspension',
    content: 'Opaleka reserves the right to suspend accounts due to violations, fraudulent activity, or legal requirements.',
  },
  {
    title: 'Governing Law & Legal Notices',
    content: 'These terms are governed by the laws of Namibia. Any legal disputes shall be subject to the jurisdiction of the High Court of Namibia. For legal inquiries, contact info@opaleka.com.',
  },
];

const TermsScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms & Conditions</Text>
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

export default TermsScreen;
