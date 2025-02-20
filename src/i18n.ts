import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import resourcesToBackend from 'i18next-resources-to-backend';

export const I18N_LANGS = ['en', 'es', 'fr', 'de', 'it', 'ko'];
export const I18N_NAMESPACES = ['global', 'multiselect_filter', 'modal', 'instructions', 'filters'];

export const checkLanguageString = (language: string): string => {
  if (!I18N_LANGS.includes(language)) {
    return I18N_LANGS[0];
  }
  return language;
}

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(resourcesToBackend((language: string, namespace: string) => import(`./locales/${language}/${namespace}.json`)))
  .init({
    detection: {
      // order and from where user language should be detected
      order: ['querystring', 'localStorage', 'navigator', 'htmlTag'],
      // keys or params to lookup language from
      lookupQuerystring: 'i18n-lang',
      lookupLocalStorage: 'i18n-lang',
    },
    debug: false,
    fallbackLng: I18N_LANGS[0],
  });
/*
I18N_LANGS.map((lang) => 
  I18N_NAMESPACES.map((namespace) => {
    i18n.addResourceBundle(
      lang,
      namespace, 
      import(`./translations/${lang}/${namespace}.json`)
    );
    }
  )
);*/


export default i18n;