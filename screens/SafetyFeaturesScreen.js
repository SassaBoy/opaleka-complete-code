import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  SafeAreaView, 
  Dimensions, 
  Animated, 
  StatusBar 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const SafetyFeaturesScreen = ({ navigation }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  
  const safetyFeatures = [
    {
      title: 'Verified Providers',
      description: 'All service providers undergo thorough background checks and identity verification for your safety. Easily identify them by photo and review their ratings before each service.',
      image: require('../assets/result.png'),
      gradient: ['#4A5CDB', '#224099'],
      icon: 'shield-checkmark'
    },
    {
      title: 'Secure Payments',
      description: 'Your financial information is protected with bank-level encryption. Choose from multiple payment options and enjoy secure, hassle-free transactions.',
      image: require('../assets/payment.png'),
      gradient: ['#FF9800', '#E65100'],
      icon: 'card'
    },
    {
      title: 'Real-time Tracking',
      description: 'Know exactly when your service provider will arrive with live location tracking. Get notifications and estimated arrival times for better planning.',
      image: require('../assets/tracking.png'),
      gradient: ['#4CAF50', '#1B5E20'],
      icon: 'location'
    },
    {
      title: 'Emergency Assistance',
      description: 'Access our 24/7 emergency support team with a single tap. Get immediate help for any situation with our dedicated customer service representatives.',
      image: require('../assets/emergency.png'),
      gradient: ['#F44336', '#B71C1C'],
      icon: 'alert-circle'
    }
  ];
  
  useEffect(() => {
    // Animate content when page changes with slower, smoother timing
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(progressAnim, {
        toValue: currentPage / (safetyFeatures.length - 1),
        duration: 600,
        useNativeDriver: false,
      })
    ]).start();
    
    // Reset animations when returning to start position
    return () => {
      fadeAnim.setValue(0);
      translateY.setValue(30);
    };
  }, [currentPage]);
  
  const handleNext = () => {
    if (currentPage < safetyFeatures.length - 1) {
      fadeAnim.setValue(0);
      translateY.setValue(30);
      setCurrentPage(currentPage + 1);
    } else {
      navigation.goBack();
    }
  };
  
  const handlePrevious = () => {
    if (currentPage > 0) {
      fadeAnim.setValue(0);
      translateY.setValue(30);
      setCurrentPage(currentPage - 1);
    }
  };
  
  const handleDotPress = (index) => {
    fadeAnim.setValue(0);
    translateY.setValue(30);
    setCurrentPage(index);
  };
  
  const currentFeature = safetyFeatures[currentPage];

  // Interpolate background colors based on current page
  const backgroundColor = progressAnim.interpolate({
    inputRange: [0, 0.33, 0.66, 1],
    outputRange: ['#4A5CDB', '#FF9800', '#4CAF50', '#F44336']
  });
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <LinearGradient
        colors={currentFeature.gradient}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Decorative background elements */}
        <View style={styles.decorationCircle1} />
        <View style={styles.decorationCircle2} />
        
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.closeButton}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          >
            <Ionicons name="close-outline" size={32} color="#fff" />
          </TouchableOpacity>
          
          <View style={styles.progressBarContainer}>
            <Animated.View 
              style={[
                styles.progressBar,
                { width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%']
                })}
              ]}
            />
          </View>
        </View>
        
        <Animated.View style={[
          styles.content,
          { 
            opacity: fadeAnim,
            transform: [{ translateY: translateY }]
          }
        ]}>
          <View style={styles.iconContainer}>
            <Ionicons name={currentFeature.icon} size={52} color="#ffffff" />
          </View>
          
          <Text style={styles.title}>{currentFeature.title}</Text>
          
          <Text style={styles.description}>{currentFeature.description}</Text>
          
          <View style={styles.imageContainer}>
            <Image 
              source={currentFeature.image}
              style={styles.image}
              resizeMode="contain"
            />
            
            {/* Decorative element over image */}
            <View style={styles.imageOverlay} />
          </View>
        </Animated.View>
        
        <View style={styles.footer}>
          <View style={styles.navigationContainer}>
            {currentPage > 0 ? (
              <TouchableOpacity
                style={styles.navButton}
                onPress={handlePrevious}
                activeOpacity={0.8}
              >
                <Ionicons name="chevron-back" size={24} color="#ffffff" />
              </TouchableOpacity>
            ) : (
              <View style={styles.emptyNavButton} />
            )}
            
            <View style={styles.paginationContainer}>
              {safetyFeatures.map((_, index) => (
                <TouchableOpacity 
                  key={index}
                  onPress={() => handleDotPress(index)}
                  activeOpacity={0.7}
                  style={styles.dotTouchable}
                >
                  <View 
                    style={[
                      styles.paginationDot,
                      index === currentPage && styles.activeDot
                    ]} 
                  />
                </TouchableOpacity>
              ))}
            </View>
            
            <TouchableOpacity
              style={styles.navButton}
              onPress={handleNext}
              activeOpacity={0.8}
            >
              <Ionicons 
                name={currentPage === safetyFeatures.length - 1 ? "checkmark" : "chevron-forward"} 
                size={24} 
                color="#ffffff" 
              />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    paddingTop: StatusBar.currentHeight || 40,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    zIndex: 10,
  },
  closeButton: {
    padding: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    flex: 1,
    marginLeft: 20,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 2,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    zIndex: 5,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 40,
    opacity: 0.9,
    letterSpacing: 0.3,
  },
  imageContainer: {
    width: width * 0.8,
    height: height * 0.3,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 15,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
    position: 'relative',
    borderRadius: 20,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 20,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dotTouchable: {
    padding: 10, // Larger touch target
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#ffffff',
    width: 18,
    borderRadius: 4,
    height: 8,
  },
  navButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  emptyNavButton: {
    width: 50,
    height: 50,
    opacity: 0,
  },
  decorationCircle1: {
    position: 'absolute',
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    top: -width * 0.3,
    right: -width * 0.2,
  },
  decorationCircle2: {
    position: 'absolute',
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: width * 0.3,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    bottom: -width * 0.2,
    left: -width * 0.1,
  },
});

export default SafetyFeaturesScreen;