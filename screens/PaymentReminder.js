import { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
  Easing,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const PaymentReminder = ({ onClose, status }) => {
  const [showReminder, setShowReminder] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const floatingAnim = useRef(new Animated.Value(0)).current;
  
  const navigation = useNavigation();

  useEffect(() => {
    setShowReminder(true);
    startAnimations();
  }, []);

  const startAnimations = () => {
    // Main entrance animation
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.bezier(0.2, 0.65, 0.4, 0.9),
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
      // Start secondary animations after entrance
      Animated.parallel([
        startPulseAnimation(),
        startFloatingAnimation(),
        startProgressAnimation(),
        startRotationAnimation(),
      ]),
    ]).start();
  };

  const startPulseAnimation = () => {
    return Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1500,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: true,
        }),
      ])
    );
  };

  const startFloatingAnimation = () => {
    return Animated.loop(
      Animated.sequence([
        Animated.timing(floatingAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: true,
        }),
        Animated.timing(floatingAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: true,
        }),
      ])
    );
  };

  const startProgressAnimation = () => {
    return Animated.timing(progressAnim, {
      toValue: 1,
      duration: 1500,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver: false,
    });
  };

  const startRotationAnimation = () => {
    return Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 12000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
  };

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 50,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowReminder(false);
      onClose();
    });
  };

  const handlePayment = () => {
    handleClose();
    setTimeout(() => {
      navigation.navigate("PaymentMethodScreen");
    }, 300);
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const floating = floatingAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10]
  });

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%']
  });

  const renderDecorationElements = () => {
    return (
      <Animated.View
        style={[
          styles.decorationContainer,
          {
            transform: [{ rotate: spin }],
          },
        ]}
      >
        {[...Array(8)].map((_, index) => (
          <View
            key={index}
            style={[
              styles.decorationElement,
              {
                transform: [
                  { rotate: `${index * 45}deg` },
                  { translateX: 100 },
                ],
                backgroundColor: `rgba(26, 35, 126, ${0.03 + (index * 0.01)})`,
              },
            ]}
          />
        ))}
      </Animated.View>
    );
  };

  const renderStatusBadge = () => (
    <View style={styles.statusBadgeContainer}>
      <Animated.View 
        style={[
          styles.statusBadgeProgress,
          { width: progressWidth }
        ]}
      />
      <Text style={styles.statusBadgeText}>
        {status === "Free" ? "TRIAL ACTIVE" : "ACTION REQUIRED"}
      </Text>
    </View>
  );

  const renderFeatures = () => (
    <View style={styles.featuresContainer}>
      {[
        { icon: "⚡️", text: status === "Free" ? "Higher Rankings" : "Instant Visibility" },
        { icon: "💎", text: "Premium Features" },
        { icon: "🎯", text: "More Bookings" },
      ].map((feature, index) => (
        <Animated.View
          key={index}
          style={[
            styles.featureItem,
            {
              transform: [
                { translateY: floating },
                { scale: pulseAnim }
              ],
            },
          ]}
        >
          <Text style={styles.featureIcon}>{feature.icon}</Text>
          <Text style={styles.featureText}>{feature.text}</Text>
        </Animated.View>
      ))}
    </View>
  );

  return (
    <Modal visible={showReminder} transparent animationType="none">
      <View style={styles.modalContainer}>
        <Animated.View
          style={[
            styles.modalContent,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {renderDecorationElements()}

          {renderStatusBadge()}

          <Animated.View
            style={[
              styles.iconContainer,
              {
                transform: [{ scale: pulseAnim }],
              },
            ]}
          >
            <Text style={styles.icon}>
              {status === "Free" ? "⭐️" : "✨"}
            </Text>
          </Animated.View>

          <Text style={styles.title}>
  {status === "Free" 
    ? "🎉 Free Trial Active" 
    : "⚠️ Your Account is Not Visible"}
</Text>

<Text style={styles.message}>
  {status === "Free"
    ? "You're on a free trial! Your trial ends after your first booking. Want to rank higher? Make a payment now!"
    : "Your account is currently invisible to clients. To start receiving bookings, make a payment."}
</Text>

<TouchableOpacity
  style={styles.payButton}
  activeOpacity={0.8}
  onPress={handlePayment}
>
  <View style={styles.payButtonContent}>
    <Text style={styles.payButtonText}>
      {status === "Free" ? "Make Payment" : "Make Payment"}
    </Text>
    <Text style={styles.payButtonSubtext}>
      {status === "Free" ? "Ensure continued visibility" : "Become visible to clients"}
    </Text>
  </View>
  <Text style={styles.payButtonArrow}>→</Text>
</TouchableOpacity>


          <TouchableOpacity
            onPress={handleClose}
            style={styles.closeButton}
            activeOpacity={0.7}
          >
            <Text style={styles.closeButtonText}>Remind Me Later</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = {
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(26, 35, 126, 0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 24,
    width: width * 0.9,
    borderRadius: 28,
    alignItems: "center",
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#1a237e",
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  decorationContainer: {
    position: 'absolute',
    width: '200%',
    height: '200%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  decorationElement: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusBadgeContainer: {
    backgroundColor: "#1a237e10",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  statusBadgeProgress: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    backgroundColor: '#1a237e15',
  },
  statusBadgeText: {
    color: "#1a237e",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 1,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#1a237e08",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#1a237e10",
  },
  icon: {
    fontSize: 44,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1a237e",
    marginBottom: 12,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  message: {
    fontSize: 16,
    lineHeight: 24,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
    paddingHorizontal: 12,
  },
  featuresContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 28,
    paddingHorizontal: 4,
  },
  featureItem: {
    alignItems: "center",
    backgroundColor: "#1a237e06",
    padding: 16,
    borderRadius: 16,
    width: "31%",
    borderWidth: 1,
    borderColor: "#1a237e08",
  },
  featureIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 13,
    color: "#1a237e",
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 18,
  },
  payButton: {
    backgroundColor: "#1a237e",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 20,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#1a237e",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  payButtonContent: {
    flex: 1,
  },
  payButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
  },
  payButtonSubtext: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    marginTop: 4,
  },
  payButtonArrow: {
    color: "white",
    fontSize: 24,
    fontWeight: "300",
    marginLeft: 8,
  },
  closeButton: {
    padding: 12,
  },
  closeButtonText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
};

export default PaymentReminder;