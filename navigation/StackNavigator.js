import React from "react";
import { createStackNavigator, CardStyleInterpolators } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

import LandingScreen from "../screens/LandingScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import CompleteProfileScreen from "../screens/CompleteProfileScreen";
import UploadDocumentsScreen from "../screens/UploadDocumentsScreen";
import ThankYouScreen from "../screens/ThankYouScreen";
import EnableFingerprintScreen from "../screens/EnableFingerprintScreen";
import SettingsScreen from "../screens/SettingsScreen";
import HomeScreen from "../screens/HomeScreen";
import ResetPasswordScreen from "../screens/ResetPasswordScreen";
import RequestPasswordResetScreen from "../screens/RequestPasswordResetScreen";
import UserAccount from "../screens/UserAccount";
import HistoryScreen from "../screens/History";
import SupportScreen from "../screens/SupportScreen";
import BenefitsScreen from "../screens/BenefitsScreen";
import FAQScreen from "../screens/FAQScreen";
import TermsScreen from "../screens/TermsScreen";
import ServicesPage from "../screens/ServicesPage";
import ServiceProvidersPage from "../screens/ServiceProvidersPage";
import LoadingScreen from "../screens/LoadingScreen";
import ServiceProviderProfilePage from "../screens/ServiceProviderProfilePage";
import IndividualCleaningScreen from "../screens/IndividualCleaningScreen";
import NotificationsPage from "../screens/NotificationsPage";
import AdminNotificationsPage from "../screens/AdminNotificationsPage";
import NotificationDetailScreen from "../screens/NotificationDetailScreen";
import PrivacyPolicyScreen from "../screens/PrivacyPolicyScreen";
import PaymentMethodScreen from "../screens/PaymentMethodScreen";
import CardPaymentScreen from "../screens/CardPaymentScreen";
import BankTransferScreen from "../screens/BankTransferScreen";
import MobilePaymentScreen from "../screens/MobilePaymentScreen";
import ViewBookingsPage from "../screens/ViewBookingsPage";
import ReviewsPage from "../screens/ReviewsPage";
import RateServiceProviderPage from "../screens/RateServiceProviderPage";
import ReservationDetailsPage from "../screens/ReservationDetailsPage";
import SpeechInteractionScreen from "../screens/SpeechInteractionScreen";
import ThankYou1Screen from "../screens/ThankYou1Screen";

const Stack = createStackNavigator();

const StackNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: true, // Enable swipe gestures
          gestureDirection: "horizontal", // Allows swiping back to previous screen
          animationEnabled: true, // Smooth transitions
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, // Smooth iOS-like animation
        }}
      >
       <Stack.Screen name="Landing" component={LandingScreen} options={{ animationEnabled: false }} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AdminNotificationsPage" component={AdminNotificationsPage} />
        <Stack.Screen name="RateServiceProviderPage" component={RateServiceProviderPage} />
        <Stack.Screen name="ReservationDetailsPage" component={ReservationDetailsPage} />
        <Stack.Screen name="NotificationsPage" component={NotificationsPage} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="RequestPassword" component={RequestPasswordResetScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        <Stack.Screen name="ServicesPage" component={ServicesPage} />
        <Stack.Screen name="ServiceProvidersPage" component={ServiceProvidersPage} />
        <Stack.Screen name="UserAccount" component={UserAccount} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="CompleteProfile" component={CompleteProfileScreen} />
        <Stack.Screen name="UploadDocuments" component={UploadDocumentsScreen} />
        <Stack.Screen name="ThankYou" component={ThankYouScreen} />
        <Stack.Screen name="History" component={HistoryScreen} />
        <Stack.Screen name="Support" component={SupportScreen} />
        <Stack.Screen name="Benefits" component={BenefitsScreen} />
        <Stack.Screen name="FAQScreen" component={FAQScreen} />
        <Stack.Screen name="Terms" component={TermsScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="LoadingScreen" component={LoadingScreen} />
        <Stack.Screen name="ServiceProviderProfilePage" component={ServiceProviderProfilePage} />
        <Stack.Screen name="BookingPage" component={IndividualCleaningScreen} />
        <Stack.Screen name="NotificationDetail" component={NotificationDetailScreen} />
        <Stack.Screen name="Privacy" component={PrivacyPolicyScreen} />
        <Stack.Screen name="PaymentMethodScreen" component={PaymentMethodScreen} />
        <Stack.Screen name="CardPayment" component={CardPaymentScreen} />
        <Stack.Screen name="BankTransferScreen" component={BankTransferScreen} />
        <Stack.Screen name="MobilePaymentScreen" component={MobilePaymentScreen} />
        <Stack.Screen name="ViewBookingsPage" component={ViewBookingsPage} />
        <Stack.Screen name="ReviewsPage" component={ReviewsPage} />
        <Stack.Screen name="ThankYou1" component={ThankYou1Screen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;
