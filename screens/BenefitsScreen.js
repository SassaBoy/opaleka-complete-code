import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const BenefitsScreen = ({ navigation }) => {
  const benefits = [
    {
      icon: 'check-circle',
      title: 'Convenience',
      description: 'Book services at the comfort of your home with just a few taps on your mobile device.',
      gradient: ['#4CAF50', '#2E7D32'],
    },
    {
      icon: 'clock',
      title: 'Time-saving',
      description: 'Save time by finding and booking reliable service providers quickly and easily.',
      gradient: ['#2196F3', '#1565C0'],
    },
    {
      icon: 'shield-alt',
      title: 'Safety & Security',
      description: 'All service providers are vetted and verified to ensure safety and security for our users.',
      gradient: ['#F44336', '#C62828'],
    },
    {
      icon: 'wallet',
      title: 'Affordable Pricing',
      description: 'Get access to high-quality services at competitive and affordable prices.',
      gradient: ['#FF9800', '#EF6C00'],
    },
    {
      icon: 'thumbs-up',
      title: 'Quality Service',
      description: 'We ensure that all services provided meet the highest standards of quality and professionalism.',
      gradient: ['#9C27B0', '#7B1FA2'],
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
        contentContainerStyle={styles.scrollContent}
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
              <LinearGradient
                colors={benefit.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.iconContainer}
              >
                <FontAwesome5 name={benefit.icon} size={24} color="#fff" />
              </LinearGradient>
              <View style={styles.textContainer}>
                <Text style={styles.benefitTitle}>{benefit.title}</Text>
                <Text style={styles.benefitDescription}>{benefit.description}</Text>
              </View>
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
  scrollContent: {
    paddingBottom: 32,
  },
  content: {
    padding: 16,
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 16,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  lastSection: {
    marginBottom: 24,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a237e',
    marginBottom: 8,
  },
  benefitDescription: {
    fontSize: 15,
    lineHeight: 22,
    color: '#546E7A',
    letterSpacing: 0.2,
  },
});

export default BenefitsScreen;