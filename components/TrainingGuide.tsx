
import React, { useState } from 'react';
import { SOPStep } from '../types';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  HelpCircle,
  AlertTriangle,
  Image as ImageIcon
} from 'lucide-react';

interface Props {
  steps: SOPStep[];
}

export const TrainingGuide: React.FC<Props> = ({ steps }) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const currentStep = steps[currentStepIdx];

  const handleNext = () => {
    if (currentStepIdx < steps.length - 1) {
      setCurrentStepIdx(currentStepIdx + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
          {currentStep.image ? (
            <img 
              src={currentStep.image} 
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
          <div className="absolute top-4 left-4">
             <div className="bg-blue-600 text-white w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg ring-4 ring-white">
                {currentStep.id}
             </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          <h2 className="text-2xl font-black text-gray-900 mb-6 leading-tight">
            {currentStep.title}
          </h2>

          <div className="space-y-4">
            {currentStep.points.map((point, idx) => (
              <div key={idx} className="flex items-start space-x-4 group">
                <div className="mt-1 bg-green-50 text-green-600 p-1 rounded-full group-hover:bg-green-100 transition-colors">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <p className="text-gray-700 leading-relaxed font-medium">
                  {point}
                </p>
              </div>
            ))}
          </div>

          {currentStep.id === 12 && (
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
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-lg px-4 flex items-center space-x-3 z-50">
        <button 
          onClick={handlePrev}
          disabled={currentStepIdx === 0}
          className={`h-14 w-14 flex items-center justify-center rounded-2xl shadow-lg transition-all ${
            currentStepIdx === 0 
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
              : 'bg-white text-gray-700 hover:bg-gray-50 active:scale-95'
          }`}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <button 
          onClick={handleNext}
          className={`flex-1 h-14 flex items-center justify-center rounded-2xl font-bold text-lg shadow-lg transition-all active:scale-95 ${
            currentStepIdx === steps.length - 1
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {currentStepIdx === steps.length - 1 ? (
            <span className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>Finish Training</span>
            </span>
          ) : (
            <span className="flex items-center space-x-2">
              <span>Next Step</span>
              <ChevronRight className="w-5 h-5" />
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
