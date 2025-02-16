// import * as Speech from 'expo-speech';
// import Voice from 'react-native-voice';
// import { useState, useEffect } from 'react';
// import axios from 'axios';

// export const useSpeechAssistant = () => {
//   const [isListening, setIsListening] = useState(false);
//   const [spokenText, setSpokenText] = useState('');

//   const startListening = () => {
//     try {
//       setIsListening(true);
//       Voice.start('en-US');
//     } catch (error) {
//       console.error('Error starting voice recognition:', error);
//       Speech.speak('Something went wrong. Please try again.');
//     }
//   };

//   const stopListening = () => {
//     try {
//       Voice.stop();
//       setIsListening(false);
//     } catch (error) {
//       console.error('Error stopping voice recognition:', error);
//     }
//   };

//   const onSpeechResults = async (event) => {
//     const userQuery = event.value?.[0];
//     setSpokenText(userQuery);

//     try {
//       // Send query to backend with ChatGPT integration
//       const response = await axios.post('http://192.168.8.138:5001/api/ask-question', { query: userQuery });
//       const reply = response.data.answer || "I'm not sure about that. Try again.";
      
//       // Use Expo Speech to read out the AI's response
//       Speech.speak(reply);
//     } catch (error) {
//       console.error('Error fetching answer:', error);
//       Speech.speak("I couldn't process your question. Please try again later.");
//     }
//   };

//   const onSpeechError = (error) => {
//     console.error('Speech recognition error:', error);
//     Speech.speak("Sorry, I couldn't understand that. Can you repeat?");
//   };

//   useEffect(() => {
//     Voice.onSpeechResults = onSpeechResults;
//     Voice.onSpeechError = onSpeechError;

//     return () => {
//       Voice.destroy().then(Voice.removeAllListeners);
//     };
//   }, []);

//   return { startListening, stopListening, isListening, spokenText };
// };