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

export const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();
  return (
    <div className="flex items-center space-x-1 bg-gray-100 rounded-lg px-2 py-1">
      <select 
        value={language} 
        onChange={(e) => setLanguage(e.target.value as any)}
        className="bg-transparent text-xs font-bold text-gray-700 outline-none cursor-pointer appearance-none pr-2"
      >
        <option value="auto">Auto Lang</option>
        <option value="en">English</option>
        <option value="de">Deutsch</option>
        <option value="tr">Türkçe</option>
        <option value="ar">العربية</option>
      </select>
    </div>
  );
};

export const useLanguage = () => useContext(LanguageContext);
