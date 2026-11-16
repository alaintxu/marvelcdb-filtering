import { ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { InternationalizationProvider, type ProviderMessagesByLocale } from '@astryxdesign/core/i18n';
import { checkLanguageString } from '../i18n';

// Astryx ships only English by default; other catalogs are loaded on demand.
const ASTRYX_LOCALES = {
  en: 'en',
  es: 'es-ES',
  fr: 'fr-FR',
  de: 'de-DE',
  it: 'it-IT',
  ko: 'ko-KR',
} as const;

type AppLanguage = keyof typeof ASTRYX_LOCALES;

const ASTRYX_CATALOGS: Partial<Record<AppLanguage, () => Promise<{ default: Record<string, string> }>>> = {
  es: () => import('@astryxdesign/core/locales/es-ES.generated.js'),
  fr: () => import('@astryxdesign/core/locales/fr-FR.generated.js'),
  de: () => import('@astryxdesign/core/locales/de-DE.generated.js'),
  it: () => import('@astryxdesign/core/locales/it-IT.generated.js'),
  ko: () => import('@astryxdesign/core/locales/ko-KR.generated.js'),
};

const AstryxI18nProvider = ({ children }: { children: ReactNode }) => {
  const { i18n } = useTranslation('global');
  const language = checkLanguageString((i18n.language ?? 'en').split('-')[0]) as AppLanguage;
  const locale = ASTRYX_LOCALES[language];
  const [catalog, setCatalog] = useState<{ locale: string; messages: ProviderMessagesByLocale }>();

  useEffect(() => {
    const loadCatalog = ASTRYX_CATALOGS[language];
    if (!loadCatalog) return;

    let cancelled = false;
    loadCatalog().then(({ default: messages }) => {
      if (!cancelled) setCatalog({ locale, messages: { [locale]: messages } });
    });
    return () => { cancelled = true; };
  }, [language, locale]);

  return (
    <InternationalizationProvider
      locale={locale}
      messages={catalog?.locale === locale ? catalog.messages : undefined}>
      {children}
    </InternationalizationProvider>
  );
};

export default AstryxI18nProvider;
