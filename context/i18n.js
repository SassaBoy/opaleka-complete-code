import * as Localization from 'react-native-localize';
import I18n from 'i18n-js';

// Translation strings
const translations = {
  en: {
    settings: "Settings",
    cityTown: "City/Town",
    language: "Language",
    chooseLanguage: "Choose Language",
    selectCity: "Select City/Town",
    // Add more English translations here
  },
  af: {
    settings: "Instellings",
    cityTown: "Stad/Dorp",
    language: "Taal",
    chooseLanguage: "Kies Taal",
    selectCity: "Kies Stad/Dorp",
    // Add more Afrikaans translations here
  },
};

// Configure i18n
I18n.translations = translations;
I18n.fallbacks = true;

// Set the default language based on the device's locale
const fallback = { languageTag: "en", isRTL: false };
const { languageTag } = Localization.findBestAvailableLanguage(Object.keys(translations)) || fallback;
I18n.locale = languageTag;

// Helper function for translations
export const t = (key, config) => I18n.t(key, config);

export default I18n;