import React, { createContext, useState, useContext, useEffect } from 'react';

export type Language = 'auto' | 'en' | 'de' | 'ar' | 'tr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  resolvedLanguage: string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'auto',
  setLanguage: () => {},
  resolvedLanguage: 'en',
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('app_language') as Language) || 'auto';
  });

  useEffect(() => {
    localStorage.setItem('app_language', language);
  }, [language]);

  const resolvedLanguage = language === 'auto' ? navigator.language.split('-')[0] : language;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, resolvedLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
