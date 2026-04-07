
import React, { useRef } from 'react';
import { SOPStep } from '../types';
import { Camera, Upload, Trash2 } from 'lucide-react';
import { StorageImage } from './StorageImage';

interface Props {
  step: SOPStep;
  onImageUpdate: (base64: string) => void;
}

export const SOPStepEditor: React.FC<Props> = ({ step, onImageUpdate }) => {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === 'string') {
        onImageUpdate(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const getDisplayImage = (img: string | undefined): string | undefined => {
    if (!img || typeof img !== 'string') return undefined;
    const trimmed = img.trim();
    if (trimmed.startsWith('data:') || trimmed.startsWith('http')) return trimmed;
    if (trimmed.length > 200 && !trimmed.includes('/')) return `data:image/png;base64,${trimmed}`;
    return trimmed;
  };

  const isValidImage = (img: string | undefined): boolean => {
    const display = getDisplayImage(img);
    return !!display;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group">
      <div className="p-4 border-b border-gray-50 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
            {step.id}
          </div>
          <h3 className="font-bold text-gray-900 line-clamp-1">{step.title}</h3>
        </div>
      </div>

      <div className="p-0 bg-gray-50 h-48 relative group">
        {isValidImage(step.image) ? (
          <>
            <StorageImage 
              path={step.image!} 
              alt={step.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
               <button 
                  onClick={() => fileRef.current?.click()}
                  className="bg-white p-2 rounded-full shadow-lg text-blue-600 hover:bg-blue-50 transition-colors"
               >
                  <Upload className="w-5 h-5" />
               </button>
               <button 
                  onClick={() => onImageUpdate('')}
                  className="bg-white p-2 rounded-full shadow-lg text-red-600 hover:bg-red-50 transition-colors"
               >
                  <Trash2 className="w-5 h-5" />
               </button>
            </div>
          </>
        ) : (
          <button 
            onClick={() => fileRef.current?.click()}
            className="w-full h-full flex flex-col items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors p-4"
          >
            <Camera className="w-10 h-10 mb-2 opacity-20" />
            <span className="text-sm font-medium">Add Training Photo</span>
            {step.image && (
              <div className="text-[10px] text-red-500 mt-2 p-2 bg-red-50 rounded w-full text-left overflow-hidden">
                <strong>Invalid format:</strong><br/>
                Type: {typeof step.image}<br/>
                Value: {typeof step.image === 'object' ? JSON.stringify(step.image).substring(0, 100) : String(step.image).substring(0, 100)}...
              </div>
            )}
          </button>
        )}
        <input 
          type="file" 
          accept="image/*" 
          className="hidden" 
          ref={fileRef} 
          onChange={handleImage} 
        />
      </div>

      <div className="p-4">
        <ul className="space-y-1.5">
          {(step.points || []).slice(0, 2).map((point, idx) => (
            <li key={idx} className="text-xs text-gray-500 flex items-start space-x-2">
              <div className="w-1 h-1 bg-gray-300 rounded-full mt-1.5 flex-shrink-0" />
              <span className="line-clamp-1">{point}</span>
            </li>
          ))}
          {(step.points || []).length > 2 && (
            <li className="text-[10px] text-blue-500 font-medium">+ {(step.points || []).length - 2} more instructions</li>
          )}
        </ul>
      </div>
    </div>
  );
};
