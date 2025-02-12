import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TermsScreen = ({ navigation }) => {
  const sections = [
    {
      title: "Introduction",
      content: "Welcome to Opaleka. By using our app, you agree to comply with and be bound by the following terms and conditions. Please review them carefully."
    },
    {
      title: "Use of the App",
      content: "You agree to use the app only for lawful purposes. You must not use the app in any way that breaches any applicable local, national, or international law or regulation."
    },
    {
      title: "Accounts and Registration",
      content: "To access certain features of the app, you may be required to create an account. You agree to provide accurate, current, and complete information during the registration process."
    },
    {
      title: "Service Availability",
      content: "We strive to ensure that the app is available at all times. However, we do not guarantee that the app will always be available or that access will be uninterrupted."
    },
    {
      title: "Payments and Refunds",
      content: "All payments made through the app are subject to our payment terms. Refunds may be provided at our discretion based on the circumstances of each case."
    },
    {
      title: "User Conduct",
      content: "You agree not to use the app to upload, post, or otherwise transmit any content that is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable."
    },
    {
      title: "Termination",
      content: "We reserve the right to terminate or suspend your access to the app at any time, without notice, for conduct that we believe violates these terms or is harmful to other users."
    },
    {
      title: "Changes to Terms",
      content: "We may update these terms from time to time. If we make significant changes, we will notify you of the changes through the app or other means."
    },
    {
      title: "Contact Us",
      content: "If you have any questions about these terms, please contact us at info@opaleka.com."
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms and Conditions</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {sections.map((section, index) => (
            <View 
              key={index} 
              style={[
                styles.section,
                index === sections.length - 1 && styles.lastSection
              ]}
            >
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
  },
  lastSection: {
    marginBottom: 24, // Extra spacing for the last section
  },
  sectionHeader: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a237e',
  },
  sectionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
  },
});

export default TermsScreen;