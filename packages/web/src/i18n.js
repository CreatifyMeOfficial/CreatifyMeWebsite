import { createI18n } from "vue-i18n";
import ar from "@/languages/ar.json";
import en from "@/languages/en.json";

// Get saved language preference or default to 'en'
const getDefaultLocale = () => {
  const savedLanguage = localStorage.getItem('userLanguage');
  return savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ar')
    ? savedLanguage
    : 'en';
};

// Set initial direction based on language
const setInitialDirection = () => {
  const language = getDefaultLocale();
  const direction = language === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.style.setProperty('--direction', direction);
};

// Set direction on app initialization
setInitialDirection();

const i18n = createI18n({
  legacy: false,
  locale: getDefaultLocale(), // default language
  fallbackLocale: 'en', // fallback language
  messages: {
    ar,
    en
  }
});

export default i18n;
