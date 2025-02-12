import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SupportScreen = ({ navigation }) => {
  const handleEmailPress = () => {
    Linking.openURL('mailto:info@opaleka.com');
  };

  const handleCallPress = () => {
    Linking.openURL('tel:+264816889761');
  };

  const supportItems = [
    {
      title: 'Benefits of using Opaleka',
      screen: 'Benefits',
      icon: 'gift-outline'
    },
    {
      title: 'Frequently Asked Questions',
      screen: 'FAQScreen',
      icon: 'help-circle-outline'
    },
    {
      title: 'Terms and Conditions',
      screen: 'Terms',
      icon: 'document-text-outline'
    },
    {
      title: 'Privacy Policy',
      screen: 'Privacy',
      icon: 'shield-checkmark-outline'
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
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Support</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Help Center</Text>
          {supportItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.card}
              onPress={() => navigation.navigate(item.screen)}
            >
              <View style={styles.cardContent}>
                <Ionicons name={item.icon} size={24} color="#1a237e" style={styles.cardIcon} />
                <Text style={styles.cardText}>{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#1a237e" />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.contactItem} onPress={handleEmailPress}>
              <View style={styles.contactContent}>
                <Ionicons name="mail" size={24} color="#1a237e" />
                <View style={styles.contactTextContainer}>
                  <Text style={styles.contactLabel}>Send email</Text>
                  <Text style={styles.contactValue}>info@opaleka.com</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <TouchableOpacity style={styles.contactItem} onPress={handleCallPress}>
              <View style={styles.contactContent}>
                <Ionicons name="call" size={24} color="#1a237e" />
                <View style={styles.contactTextContainer}>
                  <Text style={styles.contactLabel}>Call for support</Text>
                  <Text style={styles.contactValue}>+264 81 688 9761</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connect With Us</Text>
          <View style={styles.socialCard}>
            {socialLinks.map((social, index) => (
              <TouchableOpacity
                key={index}
                style={styles.socialButton}
                onPress={() => handleSocialPress(social.url)}
              >
                <View style={[styles.socialIconContainer, { backgroundColor: `${social.color}10` }]}>
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
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
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
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardIcon: {
    marginRight: 12,
  },
  cardText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  contactItem: {
    width: '100%',
  },
  contactContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactTextContainer: {
    marginLeft: 12,
  },
  contactLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 14,
    color: '#666',
  },
  socialCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
  },
  socialButton: {
    alignItems: 'center',
    padding: 8,
  },
  socialIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
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