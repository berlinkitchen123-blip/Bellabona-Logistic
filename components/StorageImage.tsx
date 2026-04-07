import React, { useState, useEffect } from 'react';
import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';

interface Props {
  path: string;
  alt: string;
  className?: string;
}

export const StorageImage: React.FC<Props> = ({ path, alt, className }) => {
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!path) return;
    
    const trimmed = path.trim();
    if (trimmed.startsWith('http') || trimmed.startsWith('data:')) {
      setUrl(trimmed);
      return;
    }
    if (trimmed.length > 200 && !trimmed.includes('/')) {
      setUrl(`data:image/png;base64,${trimmed}`);
      return;
    }

    // Attempt Firebase Storage
    if (storage) {
      const imageRef = ref(storage, trimmed);
      getDownloadURL(imageRef)
        .then((downloadUrl) => {
          setUrl(downloadUrl);
        })
        .catch((err) => {
          console.warn("Storage fetch error for", trimmed, err);
          // Fallback to relative URL just in case it's hosted locally
          setUrl(trimmed);
        });
    } else {
      setUrl(trimmed);
    }
  }, [path]);

  if (!url) {
    return <div className={`animate-pulse bg-gray-200 flex items-center justify-center text-xs text-gray-400 ${className}`}>Loading image...</div>;
  }

  return (
    <img 
      src={url} 
      alt={alt} 
      className={className}
      referrerPolicy="no-referrer"
      onError={() => setError(true)}
    />
  );
};
