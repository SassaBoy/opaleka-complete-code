import React from 'react';
import { View, Button, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useSpeechAssistant } from './useSpeechAssistant';

const SpeechInteractionScreen = () => {
  const { startListening, stopListening, isListening, spokenText } = useSpeechAssistant();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ask me about services, prices, and more!</Text>
      <Button
        title={isListening ? 'Stop Listening' : 'Start Listening'}
        onPress={isListening ? stopListening : startListening}
        color="#00AEEF"
      />
      {isListening && <ActivityIndicator size="large" color="#00AEEF" style={styles.loader} />}
      {spokenText && <Text style={styles.spokenText}>You said: "{spokenText}"</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  loader: { marginVertical: 20 },
  spokenText: { fontSize: 16, marginTop: 20, textAlign: 'center' },
});

export default SpeechInteractionScreen;
