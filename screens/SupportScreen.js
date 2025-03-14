import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, ScrollView, SafeAreaView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const SupportScreen = ({ navigation }) => {
  const handleEmailPress = () => {
    Linking.openURL('mailto:info@opaleka.com').catch(err => {
      console.error('Could not open email app', err);
    });
  };

  const handleCallPress = () => {
    Linking.openURL('tel:+264816889761').catch(err => {
      console.error('Could not open phone app', err);
    });
  };

  const supportItems = [
    {
      title: 'Benefits of using Opaleka',
      screen: 'Benefits',
      icon: 'gift-outline',
      gradient: ['#4CAF50', '#2E7D32'],
    },
    {
      title: 'Frequently Asked Questions',
      screen: 'FAQScreen',
      icon: 'help-circle-outline',
      gradient: ['#2196F3', '#1565C0'],
    },
    {
      title: 'Privacy Policy',
      screen: 'Privacy',
      icon: 'shield-checkmark-outline',
      gradient: ['#9C27B0', '#7B1FA2'],
    },
    {
      title: 'Payment Terms',
      screen: 'PaymentTerms',
      icon: 'card-outline',
      gradient: ['#009688', '#00796B'],
    },
    {
      title: 'Terms and Conditions',
      screen: 'Terms',
      icon: 'document-text-outline',
      gradient: ['#FF9800', '#EF6C00'],
    }
    
  ];

  const socialLinks = [
    {
      name: 'Facebook',
      icon: 'logo-facebook',
      url: 'https://www.facebook.com/profile.php?id=61567409875373',
      color: '#1877F2'
    },
    {
      name: 'Instagram',
      icon: 'logo-instagram',
      url: 'https://www.instagram.com/opaleka.namibia/',
      color: '#E4405F'
    },
    {
      name: 'LinkedIn',
      icon: 'logo-linkedin',
      url: 'https://www.linkedin.com/company/opaleka/?viewAsMember=true',
      color: '#0A66C2'
    }
  ];

  const handleSocialPress = (url) => {
    Linking.openURL(url).catch(err => {
      console.error('Could not open URL', err);
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Support</Text>
      </View>

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Help Center</Text>
          {supportItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.card}
              onPress={() => navigation.navigate(item.screen)}
              accessibilityLabel={item.title}
            >
              <LinearGradient
                colors={item.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.iconContainer}
              >
                <Ionicons name={item.icon} size={24} color="#fff" />
              </LinearGradient>
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardText}>{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#1a237e" />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <View style={styles.card}>
            <TouchableOpacity 
              style={styles.contactItem} 
              onPress={handleEmailPress}
              accessibilityLabel="Send email to Opaleka"
            >
              <LinearGradient
                colors={['#F44336', '#C62828']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.contactIconContainer}
              >
                <Ionicons name="mail" size={24} color="#fff" />
              </LinearGradient>
              <View style={styles.contactTextContainer}>
                <Text style={styles.contactLabel}>Send email</Text>
                <Text style={styles.contactValue}>info@opaleka.com</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <TouchableOpacity 
              style={styles.contactItem} 
              onPress={handleCallPress}
              accessibilityLabel="Call Opaleka support"
            >
              <LinearGradient
                colors={['#2196F3', '#1565C0']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.contactIconContainer}
              >
                <Ionicons name="call" size={24} color="#fff" />
              </LinearGradient>
              <View style={styles.contactTextContainer}>
                <Text style={styles.contactLabel}>Call for support</Text>
                <Text style={styles.contactValue}>+264 81 688 9761</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.section, styles.lastSection]}>
          <Text style={styles.sectionTitle}>Connect With Us</Text>
          <View style={styles.socialCard}>
            {socialLinks.map((social, index) => (
              <TouchableOpacity
                key={index}
                style={styles.socialButton}
                onPress={() => handleSocialPress(social.url)}
                accessibilityLabel={`Visit our ${social.name} page`}
              >
                <View style={[styles.socialIconContainer, { backgroundColor: `${social.color}20` }]}>
                  <Ionicons name={social.icon} size={24} color={social.color} />
                </View>
                <Text style={[styles.socialText, { color: social.color }]}>{social.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
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
  section: {
    padding: 16,
  },
  lastSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a237e',
    marginBottom: 12,
    marginLeft: 4,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 12,
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    letterSpacing: 0.2,
  },
  contactItem: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contactTextContainer: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 14,
    color: '#546E7A',
    letterSpacing: 0.2,
  },
  socialCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  socialButton: {
    alignItems: 'center',
    padding: 8,
  },
  socialIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  socialText: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default SupportScreen;