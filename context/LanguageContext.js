import React, { createContext, useState } from "react";
import i18n from "./i18n"; // Your i18n configuration

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("en"); // Default language

  const changeLanguage = (lang) => {
    setLanguage(lang); // Update the state
    i18n.locale = lang; // Update i18n language
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
