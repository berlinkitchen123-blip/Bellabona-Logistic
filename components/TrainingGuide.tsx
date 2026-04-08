
import React, { useState } from 'react';
import { SOPStep } from '../types';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  HelpCircle,
  AlertTriangle,
  Image as ImageIcon,
  Loader2,
  Edit2,
  Save,
  X
} from 'lucide-react';
import { StorageImage } from './StorageImage';
import { TranslatedText } from './TranslatedText';

interface Props {
  steps: SOPStep[];
}

export const TrainingGuide: React.FC<Props> = ({ steps }) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<SOPStep[]>(steps);

  const handleSave = () => {
    // Note: You'll need to pass an onUpdate function from App.tsx to save changes
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm(steps);
    setIsEditing(false);
  };

  if (!steps || steps.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-3xl shadow-sm border border-gray-100">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <h3 className="text-lg font-bold text-gray-900">Loading SOP Steps...</h3>
        <p className="text-sm text-gray-500 mt-2">Please wait while we fetch the training guide.</p>
      </div>
    );
  }

  const currentStep = steps[currentStepIdx];
  
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

  if (isValidImage(currentStep.image)) {
    console.log(`Rendering image for step ${currentStep.id}:`, getDisplayImage(currentStep.image)?.substring(0, 50) + '...');
  } else {
    console.warn(`No valid image found for step ${currentStep.id}`);
  }

  const handleNext = () => {
    if (currentStepIdx < steps.length - 1) {
      setCurrentStepIdx(currentStepIdx + 1);
    } else {
      setCurrentStepIdx(0); // Finish SOP: Reset to first step
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrev = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx(currentStepIdx - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const progress = ((currentStepIdx + 1) / steps.length) * 100;

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-24">
      {/* Progress Bar */}
      <div className="sticky top-20 z-30 bg-gray-50 pt-2">
        <div className="bg-white rounded-full h-2 w-full overflow-hidden shadow-sm">
          <div 
            className="bg-blue-600 h-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between items-center mt-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">
          <span>Step {currentStepIdx + 1} of {steps.length}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        {/* Step Image */}
        <div className="h-64 md:h-80 bg-gray-100 relative">
          {isValidImage(currentStep.image) ? (
            <StorageImage 
              path={currentStep.image!} 
              alt={currentStep.title} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50 p-8 text-center">
              <ImageIcon className="w-16 h-16 mb-4 opacity-10" />
              <p className="text-sm font-medium">No visual guide available for this step yet.</p>
              <p className="text-xs mt-1">Contact dispatch manager to upload a training photo.</p>
            </div>
          )}
          <div className="absolute top-4 left-4 flex items-center space-x-2">
             <div className="bg-blue-600 text-white w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg ring-4 ring-white">
                {currentStep.id}
             </div>
             <button 
               onClick={() => setIsEditing(!isEditing)}
               className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg ring-4 ring-white transition-colors ${isEditing ? 'bg-amber-500 text-white' : 'bg-white text-gray-700'}`}
             >
               {isEditing ? <X className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
             </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          {isEditing ? (
            <div className="space-y-4">
              <input 
                type="text"
                value={editForm[currentStepIdx].title}
                onChange={(e) => {
                  const newForm = [...editForm];
                  newForm[currentStepIdx].title = e.target.value;
                  setEditForm(newForm);
                }}
                className="w-full text-2xl font-black text-gray-900 leading-tight p-2 border-b-2 border-blue-500 outline-none"
              />
              <textarea
                value={editForm[currentStepIdx].points?.join('\n')}
                onChange={(e) => {
                  const newForm = [...editForm];
                  newForm[currentStepIdx].points = e.target.value.split('\n');
                  setEditForm(newForm);
                }}
                className="w-full text-gray-700 leading-relaxed font-medium p-2 border border-gray-200 rounded-xl outline-none"
                rows={5}
              />
              <button 
                onClick={handleSave}
                className="w-full bg-blue-600 text-white py-3 rounded-2xl font-bold hover:bg-blue-700 shadow-lg"
              >
                Save Changes
              </button>
            </div>
          ) : (
            <>
              <TranslatedText 
                text={currentStep.title}
                className="text-2xl font-black text-gray-900 mb-6 leading-tight"
              />

              <div className="space-y-4">
                {(currentStep.points || []).map((point, idx) => (
                  <div key={idx} className="flex items-start space-x-4 group">
                    <div className="mt-1 bg-green-50 text-green-600 p-1 rounded-full group-hover:bg-green-100 transition-colors">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <TranslatedText 
                      text={point}
                      className="text-gray-700 leading-relaxed font-medium"
                    />
                  </div>
                ))}
              </div>
            </>
          )}

          {currentStep.id === 12 && !isEditing && (
            <div className="mt-8 bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800 font-medium italic">
                Remember: Dispatch is complete only after OMS and physical packing fully match!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 w-full max-w-lg px-4 flex items-center space-x-3 z-40">
        <button 
          onClick={handlePrev}
          disabled={currentStepIdx === 0}
          className={`h-14 w-14 flex items-center justify-center rounded-2xl shadow-2xl border border-gray-100 transition-all ${
            currentStepIdx === 0 
              ? 'bg-gray-100 text-gray-300 cursor-not-allowed' 
              : 'bg-white text-gray-700 hover:bg-gray-50 active:scale-95'
          }`}
          title="Previous Step"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <button 
          onClick={handleNext}
          className={`flex-1 h-14 flex items-center justify-center rounded-2xl font-black text-lg shadow-[0_20px_50px_rgba(37,99,235,0.3)] transition-all active:scale-95 ${
            currentStepIdx === steps.length - 1
              ? 'bg-green-600 text-white hover:bg-green-700 shadow-[0_20px_50px_rgba(22,163,74,0.3)]'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {currentStepIdx === steps.length - 1 ? (
            <span className="flex items-center space-x-2">
              <CheckCircle2 className="w-6 h-6" />
              <span>Finish Training</span>
            </span>
          ) : (
            <span className="flex items-center space-x-2">
              <span>Next Step</span>
              <ChevronRight className="w-6 h-6" />
            </span>
          )}
        </button>
      </div>

      <div className="flex items-center justify-center space-x-2 text-gray-400 py-4">
        <HelpCircle className="w-4 h-4" />
        <span className="text-xs">Need help? Ask your supervisor.</span>
      </div>
    </div>
  );
};
