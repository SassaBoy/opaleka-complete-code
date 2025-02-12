import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PrivacyPolicyScreen = ({ navigation }) => {
  const sections = [
    {
      title: "Introduction",
      content: "At Opaleka, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our app."
    },
    {
      title: "Information We Collect",
      content: "We may collect personal information that you provide to us, such as your name, email address, phone number, and payment information. We also collect non-personal information about your use of the app."
    },
    {
      title: "How We Use Your Information",
      content: "We use your information to provide and improve our services, process transactions, communicate with you, and for security purposes. We may also use your information for marketing and promotional purposes."
    },
    {
      title: "Sharing Your Information",
      content: "We may share your information with third parties who perform services on our behalf, such as payment processors and customer service providers. We may also share your information if required by law or to protect our rights."
    },
    {
      title: "Data Security",
      content: "We implement appropriate security measures to protect your information from unauthorized access, alteration, disclosure, or destruction. However, no security system is impenetrable, and we cannot guarantee the security of your information."
    },
    {
      title: "Your Choices",
      content: "You have choices regarding the collection, use, and sharing of your information. You may opt-out of receiving marketing communications from us and update your account information at any time."
    },
    {
      title: "Changes to This Policy",
      content: "We may update this Privacy Policy from time to time. If we make significant changes, we will notify you through the app or other means."
    },
    {
      title: "Contact Us",
      content: "If you have any questions about this Privacy Policy, please contact us at info@opaleka.com."
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
        <Text style={styles.headerTitle}>Privacy Policy</Text>
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

export default PrivacyPolicyScreen;