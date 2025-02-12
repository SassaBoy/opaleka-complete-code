import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, LayoutAnimation, Platform, UIManager, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FAQScreen = ({ navigation }) => {
  const [expanded, setExpanded] = useState(null);

  const handlePress = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(expanded === index ? null : index);
  };

  const faqs = [
    {
      question: 'How do I book a service?',
      answer: 'To book a service, simply navigate to the "Services" section, select the service you need, and follow the booking instructions.',
    },
    {
      question: 'Are the service providers vetted?',
      answer: 'Yes, all our service providers are thoroughly vetted and verified to ensure your safety and security.',
    },
    {
      question: 'What payment methods are accepted?',
      answer: 'We accept various payment methods including credit/debit cards, mobile payments, and online banking.',
    },
    {
      question: 'Can I reschedule a booking?',
      answer: 'Yes, you can reschedule a booking by going to your booking history and selecting the reschedule option.',
    },
    {
      question: 'What should I do if I am not satisfied with the service?',
      answer: 'If you are not satisfied with the service, please contact our support team immediately, and we will address your concerns promptly.',
    },
    {
      question: 'Is there a cancellation fee?',
      answer: 'There is no cancellation fee if you cancel your booking at least 24 hours in advance. A fee may apply for last-minute cancellations.',
    },
    {
      question: 'How can I track my service request?',
      answer: 'You can track your service request in real-time through the "My Bookings" section in the app.',
    },
    {
      question: 'Can I request a specific service provider?',
      answer: 'Yes, you can request a specific service provider based on their availability and your preferences.',
    },
    {
      question: 'Are there any discounts available?',
      answer: 'We offer various discounts and promotions from time to time. Please check the "Promotions" section in the app for current offers.',
    },
    {
      question: 'How do I leave feedback?',
      answer: 'After the service is completed, you will receive a prompt to rate and leave feedback for the service provider.',
    },
    {
      question: 'Is my personal information secure?',
      answer: 'Yes, we take your privacy and security seriously. Your personal information is encrypted and securely stored.',
    },
    {
      question: 'How do I contact customer support?',
      answer: 'You can contact our customer support team through the "Support" section in the app or by emailing info@opaleka.com.',
    },
    {
      question: 'What areas do you service?',
      answer: 'We currently service various locations across Namibia. Please check the "Service Areas" section for more details.',
    },
    {
      question: 'Can I book services for someone else?',
      answer: 'Yes, you can book services for others by providing their details during the booking process.',
    },
    {
      question: 'What should I do if the service provider is late?',
      answer: 'If the service provider is late, please contact our support team, and we will address the situation immediately.',
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
        <Text style={styles.headerTitle}>Frequently Asked Questions</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {faqs.map((faq, index) => (
            <View 
              key={index} 
              style={[
                styles.section,
                index === faqs.length - 1 && styles.lastSection
              ]}
            >
              <TouchableOpacity
                onPress={() => handlePress(index)}
                style={styles.faqHeader}
              >
                <Text style={styles.faqQuestion}>{faq.question}</Text>
                <Ionicons 
                  name={expanded === index ? 'chevron-up' : 'chevron-down'} 
                  size={24} 
                  color="#1a237e" 
                />
              </TouchableOpacity>
              {expanded === index && (
                <View style={styles.faqAnswer}>
                  <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                </View>
              )}
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
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#1a237e',
    marginRight: 12,
  },
  faqAnswer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  faqAnswerText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
  },
});

export default FAQScreen;