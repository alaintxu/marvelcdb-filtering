import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import global_en from "./translations/en/global.json";
import LanguageDetector from 'i18next-browser-languagedetector';
import global_es from "./translations/es/global.json";

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    detection: {
      // order and from where user language should be detected
      order: ['querystring', 'localStorage', 'navigator', 'htmlTag'],
      // keys or params to lookup language from
      lookupQuerystring: 'i18n-lang',
      lookupLocalStorage: 'i18n-lang',
    },
    debug: true,
    fallbackLng: 'en',
    resources: {
      en: {
        global: global_en
      },
      es: {
        global: global_es
      }
    },
  });

export default i18n;