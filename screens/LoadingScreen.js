import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import * as Progress from 'react-native-progress';

const PRIMARY_COLOR = '#1a237e';
const SECONDARY_COLOR = '#F8F9FF';
const TEXT_COLOR = '#4F4F4F';

const LoadingScreen = ({ navigation, route }) => {
  const { service } = route.params || {}; // Get the service object from route params

  useEffect(() => {
    if (!service || !service.name) {
      console.error('Missing or invalid service parameter');
      return;
    }

    // Navigate to the next page after a delay
    const timer = setTimeout(() => {
      navigation.navigate('ServiceProvidersPage', { serviceName: service.name, service }); // Pass both `serviceName` and `service`
    }, 3000);

    return () => clearTimeout(timer); // Clear timer on component unmount
  }, [navigation, service]);

  // Handle missing or invalid service
  if (!service || !service.name) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          Missing or invalid service parameter. Please go back and try again.
        </Text>
      </View>
    );
  }

  // Render the loading UI
  return (
    <View style={styles.container}>
      <Text style={styles.loadingText}>
        Loading service providers for "{service.name}"...
      </Text>
      <ActivityIndicator size="large" color={PRIMARY_COLOR} style={styles.spinner} />
      <Progress.Bar
        indeterminate={true}
        width={250}
        color={PRIMARY_COLOR}
        borderColor={PRIMARY_COLOR}
        style={styles.progressBar}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: SECONDARY_COLOR,
    paddingHorizontal: 20,
  },
  spinner: {
    marginBottom: 24,
  },
  loadingText: {
    fontSize: 20,
    color: TEXT_COLOR,
    marginBottom: 16,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 28,
  },
  progressBar: {
    marginTop: 16,
    height: 6, // Increase height for better visibility
  },
  errorText: {
    fontSize: 18,
    color: '#E53935',
    textAlign: 'center',
    margin: 20,
    fontWeight: '600',
    lineHeight: 24,
  },
});

export default LoadingScreen;
