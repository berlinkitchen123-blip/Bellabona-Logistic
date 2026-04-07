import React, { useState, useEffect } from 'react';
import { Loader2, Languages } from 'lucide-react';
import { useLanguage } from './LanguageContext';

interface Props {
  text: string;
  className?: string;
}

export const TranslatedText: React.FC<Props> = ({ text, className }) => {
  const [translatedText, setTranslatedText] = useState<string>(text);
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState(false);
  const { resolvedLanguage } = useLanguage();

  useEffect(() => {
    if (!text) {
      setTranslatedText('');
      return;
    }
    
    const translate = async () => {
      setIsTranslating(true);
      setError(false);
      try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${resolvedLanguage}&dt=t&q=${encodeURIComponent(text)}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Translation failed');
        const data = await res.json();
        
        // Data format: [ [ [ "Translated text", "Original text", ... ] ], ... ]
        let fullTranslation = "";
        if (data && data[0]) {
          data[0].forEach((item: any) => {
            if (item[0]) fullTranslation += item[0];
          });
        }
        
        if (fullTranslation) {
          setTranslatedText(fullTranslation);
        } else {
          setTranslatedText(text);
        }
      } catch (err) {
        console.error("Translation error:", err);
        setError(true);
        setTranslatedText(text); // Fallback to original
      } finally {
        setIsTranslating(false);
      }
    };

    translate();
  }, [text, resolvedLanguage]);

  return (
    <div className="relative group">
      {isTranslating ? (
        <div className="flex items-center space-x-2 text-gray-400">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm italic">Translating...</span>
        </div>
      ) : (
        <div className={className}>
          {translatedText}
        </div>
      )}
      
      {/* Show original text on hover if translated */}
      {!isTranslating && !error && translatedText !== text && (
        <div className="absolute top-full left-0 mt-2 p-3 bg-gray-900 text-white text-sm rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 max-w-md w-max">
          <div className="flex items-center space-x-1 mb-1 text-gray-400 text-xs font-bold uppercase">
            <Languages className="w-3 h-3" />
            <span>Original Text</span>
          </div>
          {text}
        </div>
      )}
    </div>
  );
};
