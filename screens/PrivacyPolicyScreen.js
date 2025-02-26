import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const sections = [
  {
    title: 'Data Collection & Usage',
    content: 'Opaleka collects and processes certain information to provide a seamless and secure service experience.',
  },
  {
    title: 'Information You Provide',
    content: 'When using our platform, you may be required to provide personal information, service provider details, booking information, and payment details.',
  },
  {
    title: 'Information Collected Automatically',
    content: 'We may collect certain technical and usage data when you interact with our platform, including device information, usage data, and location data.',
  },
  {
    title: 'How We Use Your Information',
    content: 'Opaleka utilizes collected data to improve booking processes, enhance platform performance, and comply with legal requirements.',
  },
  {
    title: 'Data Retention',
    content: 'We retain your information only as long as necessary to fulfill our obligations and legal requirements.',
  },
  {
    title: 'How We Protect Your Data',
    content: 'Opaleka implements industry-leading security measures to protect your data from unauthorized access, misuse, or loss.',
  },
  {
    title: 'Who Receives Your Information and Why?',
    content: 'Some of your information may be shared with other users or trusted third parties to enhance your experience, improve our services, and fulfill legal obligations.',
  },
  {
    title: 'Cookie Policy & Data Confidentiality',
    content: 'Opaleka uses cookies and similar technologies to provide a secure, efficient, and personalized experience.',
  },
  {
    title: 'External Links & Third-Party Websites',
    content: 'Opaleka may contain links to external websites or social media platforms. Please be aware that these websites have their own privacy policies.',
  },
  {
    title: 'Updates to Our Privacy Policy',
    content: 'We may update our Privacy Policy from time to time to reflect legal requirements, technological advancements, or service improvements.',
  },
  {
    title: 'Contact Us',
    content: 'If you have any questions regarding our privacy practices, you can reach out to us via email at info@opaleka.com.',
  },
];

const PrivacyScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
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

export default PrivacyScreen;
