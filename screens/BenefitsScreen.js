import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

const BenefitsScreen = ({ navigation }) => {
  const benefits = [
    {
      icon: 'check-circle',
      title: 'Convenience',
      description: 'Book services at the comfort of your home with just a few taps on your mobile device.',
    },
    {
      icon: 'clock',
      title: 'Time-saving',
      description: 'Save time by finding and booking reliable service providers quickly and easily.',
    },
    {
      icon: 'shield-alt',
      title: 'Safety & Security',
      description: 'All service providers are vetted and verified to ensure safety and security for our users.',
    },
    {
      icon: 'wallet',
      title: 'Affordable Pricing',
      description: 'Get access to high-quality services at competitive and affordable prices.',
    },
    {
      icon: 'thumbs-up',
      title: 'Quality Service',
      description: 'We ensure that all services provided meet the highest standards of quality and professionalism.',
    },
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
        <Text style={styles.headerTitle}>Benefits of Opaleka</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {benefits.map((benefit, index) => (
            <View 
              key={index} 
              style={[
                styles.section,
                index === benefits.length - 1 && styles.lastSection
              ]}
            >
              <View style={styles.benefitHeader}>
                <FontAwesome5 name={benefit.icon} size={32} color="#1a237e" />
                <Text style={styles.benefitTitle}>{benefit.title}</Text>
              </View>
              <Text style={styles.benefitDescription}>{benefit.description}</Text>
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
    marginBottom: 24,
  },
  benefitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
  },
  benefitTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a237e',
    marginLeft: 12,
  },
  benefitDescription: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
  },
});

export default BenefitsScreen;