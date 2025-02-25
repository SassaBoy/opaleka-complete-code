import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Animated,
  Dimensions,
  StatusBar,
  Platform,
  BackHandler
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

// Primary color
const PRIMARY_COLOR = '#1a237e';

const WelcomeScreen = ({ navigation }) => {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(50)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  
  // Background animation
  const bgTranslateX = useRef(new Animated.Value(0)).current;
  const bgTranslateY = useRef(new Animated.Value(0)).current;
  
  // Button animations
  const clientButtonScale = useRef(new Animated.Value(1)).current;
  const providerButtonScale = useRef(new Animated.Value(1)).current;
  
  // Circle animations
  const circle1Opacity = useRef(new Animated.Value(0.4)).current;
  const circle2Opacity = useRef(new Animated.Value(0.3)).current;
  const circle1Scale = useRef(new Animated.Value(0.8)).current;
  const circle2Scale = useRef(new Animated.Value(0.7)).current;

  // Prevent multiple clicks
  const [isNavigating, setIsNavigating] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      // Reset navigating state when screen is focused
      setIsNavigating(false);
      
      // Reset animations
      fadeAnim.setValue(0);
      slideUpAnim.setValue(50);
      logoScale.setValue(0.8);
      
      // Entrance animations
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideUpAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        })
      ]).start();
      
      // Background subtle movement
      Animated.loop(
        Animated.sequence([
          Animated.timing(bgTranslateX, {
            toValue: 10,
            duration: 12000,
            useNativeDriver: true,
          }),
          Animated.timing(bgTranslateX, {
            toValue: -10,
            duration: 12000,
            useNativeDriver: true,
          })
        ])
      ).start();
      
      Animated.loop(
        Animated.sequence([
          Animated.timing(bgTranslateY, {
            toValue: 10,
            duration: 15000,
            useNativeDriver: true,
          }),
          Animated.timing(bgTranslateY, {
            toValue: -10,
            duration: 15000,
            useNativeDriver: true,
          })
        ])
      ).start();
      
      // Circle animations
      animateCircles();
      
      // Handle back button on Android
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        if (navigation.isFocused()) {
          // Reset navigation state when back button is pressed
          setIsNavigating(false);
          return false;
        }
        return false;
      });
      
      return () => {
        // Cleanup
        fadeAnim.stopAnimation();
        slideUpAnim.stopAnimation();
        bgTranslateX.stopAnimation();
        bgTranslateY.stopAnimation();
        circle1Opacity.stopAnimation();
        circle2Opacity.stopAnimation();
        circle1Scale.stopAnimation();
        circle2Scale.stopAnimation();
        backHandler.remove();
      };
    }, [navigation])
  );

  const animateCircles = () => {
    // Circle 1 animation
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(circle1Opacity, {
            toValue: 0.7,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(circle1Scale, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          })
        ]),
        Animated.parallel([
          Animated.timing(circle1Opacity, {
            toValue: 0.4,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(circle1Scale, {
            toValue: 0.8,
            duration: 2000,
            useNativeDriver: true,
          })
        ])
      ])
    ).start();
    
    // Circle 2 animation with delay
    setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(circle2Opacity, {
              toValue: 0.6,
              duration: 2500,
              useNativeDriver: true,
            }),
            Animated.timing(circle2Scale, {
              toValue: 0.9,
              duration: 2500,
              useNativeDriver: true,
            })
          ]),
          Animated.parallel([
            Animated.timing(circle2Opacity, {
              toValue: 0.3,
              duration: 2500,
              useNativeDriver: true,
            }),
            Animated.timing(circle2Scale, {
              toValue: 0.7,
              duration: 2500,
              useNativeDriver: true,
            })
          ])
        ])
      ).start();
    }, 500);
  };

  const handleButtonPress = (role, buttonScale) => {
    if (isNavigating) return;
    setIsNavigating(true);
    
    // Button press animation
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(buttonScale, {
        toValue: 1,
        friction: 4,
        tension: 50,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      navigation.navigate("Login", { role });
      
      // Reset navigation state after a timeout to ensure it's reset if user comes back
      setTimeout(() => {
        setIsNavigating(false);
      }, 500);
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      {/* Animated gradient background */}
      <Animated.View style={[
        styles.backgroundContainer,
        {
          transform: [
            { translateX: bgTranslateX },
            { translateY: bgTranslateY },
            { scale: 1.1 }
          ]
        }
      ]}>
        <LinearGradient
          colors={[PRIMARY_COLOR, '#2B1A60', '#1E0B41']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        />
        
        {/* Animated circles */}
        <Animated.View 
          style={[
            styles.circle,
            styles.circle1,
            {
              opacity: circle1Opacity,
              transform: [{ scale: circle1Scale }]
            }
          ]}
        />
        
        <Animated.View 
          style={[
            styles.circle,
            styles.circle2,
            {
              opacity: circle2Opacity,
              transform: [{ scale: circle2Scale }]
            }
          ]}
        />
      </Animated.View>
      
      <SafeAreaView style={styles.content}>
        <Animated.View style={[
          styles.mainContent,
          { 
            opacity: fadeAnim,
            transform: [{ translateY: slideUpAnim }]
          }
        ]}>
          {/* Logo */}
          <Animated.View style={[
            styles.logoContainer,
            { transform: [{ scale: logoScale }] }
          ]}>
            <Image 
              source={require('../assets/image.png')} 
              style={styles.logo} 
              resizeMode="contain" 
            />
          </Animated.View>
          
          {/* Text content */}
          <View style={styles.textContent}>
            <Animated.Text style={[
              styles.welcomeText,
              { 
                opacity: fadeAnim,
                transform: [{ 
                  translateY: Animated.multiply(slideUpAnim, 0.5) 
                }] 
              }
            ]}>
              Welcome to
            </Animated.Text>
            
            <Animated.Text style={[
              styles.titleText,
              { 
                opacity: fadeAnim,
                transform: [{ 
                  translateY: Animated.multiply(slideUpAnim, 0.7) 
                }] 
              }
            ]}>
              <Text style={styles.italicText}>Opaleka</Text>
            </Animated.Text>
            
            <Animated.Text style={[
              styles.subtitleText,
              { 
                opacity: fadeAnim,
                transform: [{ 
                  translateY: Animated.multiply(slideUpAnim, 0.9) 
                }] 
              }
            ]}>
              Book trusted professionals for any service, anytime.
            </Animated.Text>
          </View>
          
          {/* Buttons */}
          <View style={styles.buttonContainer}>
            {/* Client Button */}
            <TouchableOpacity 
              onPress={() => handleButtonPress("Client", clientButtonScale)}
              activeOpacity={0.8}
              style={styles.touchableArea}
              disabled={isNavigating}
            >
              <Animated.View style={[
                styles.button,
                styles.clientButton,
                { transform: [{ scale: clientButtonScale }] }
              ]}>
                <LinearGradient
                  colors={[PRIMARY_COLOR, '#4F6AFF']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.buttonText}>I'm a Client</Text>
                </LinearGradient>
              </Animated.View>
            </TouchableOpacity>
            
            {/* Provider Button */}
            <TouchableOpacity 
              onPress={() => handleButtonPress("Provider", providerButtonScale)}
              activeOpacity={0.8}
              style={styles.touchableArea}
              disabled={isNavigating}
            >
              <Animated.View style={[
                styles.button,
                styles.providerButton,
                { transform: [{ scale: providerButtonScale }] }
              ]}>
                <LinearGradient
                  colors={[PRIMARY_COLOR, '#29A8BE']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.buttonText}>I'm a Service Provider</Text>
                </LinearGradient>
              </Animated.View>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PRIMARY_COLOR,
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  circle: {
    position: 'absolute',
    borderRadius: 999,
  },
  circle1: {
    width: width * 1.2,
    height: width * 1.2,
    backgroundColor: 'rgba(26, 35, 126, 0.25)', // Using primary color
    top: '10%',
    right: '-30%',
  },
  circle2: {
    width: width * 1,
    height: width * 1,
    backgroundColor: 'rgba(26, 35, 126, 0.15)', // Using primary color
    bottom: '5%',
    left: '-20%',
  },
  content: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    marginBottom: 40,
    width: width * 0.45,
    height: width * 0.45,
    borderRadius: width * 0.225,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: PRIMARY_COLOR, // Using primary color
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 6,
  },
  logo: {
    width: '75%',
    height: '75%',
  },
  textContent: {
    alignItems: 'center',
    marginBottom: 60,
  },
  welcomeText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 26,
    fontWeight: '400',
    marginBottom: 5,
  },
  titleText: {
    color: '#FFFFFF',
    fontSize: 56,
    fontWeight: '800',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 20,
  },
  italicText: {
    fontStyle: 'italic',
  },
  subtitleText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 18,
    textAlign: 'center',
    maxWidth: '85%',
  },
  buttonContainer: {
    width: '100%',
    gap: 20,
    alignItems: 'center',
  },
  touchableArea: {
    width: '90%',
    maxWidth: 320,
  },
  button: {
    height: 65,
    borderRadius: 32,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  buttonGradient: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clientButton: {
    shadowColor: PRIMARY_COLOR, // Using primary color
  },
  providerButton: {
    shadowColor: PRIMARY_COLOR, // Using primary color
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.5,
  }
});

export default WelcomeScreen;