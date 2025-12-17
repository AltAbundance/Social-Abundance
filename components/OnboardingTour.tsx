import React from 'react';
import { Icons } from '../constants';

export interface TourStep {
  title: string;
  description: string;
  viewId: string;
  icon: React.ReactNode;
}

interface OnboardingTourProps {
  isOpen: boolean;
  stepIndex: number;
  steps: TourStep[];
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
}

export const OnboardingTour: React.FC<OnboardingTourProps> = ({ 
    isOpen, stepIndex, steps, onNext, onPrev, onClose 
}) => {
  if (!isOpen) return null;

  const currentStep = steps[stepIndex];
  const isLastStep = stepIndex === steps.length - 1;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in-up"
        onClick={onClose}
      />
      
      {/* Card */}
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 sm:p-8 animate-fade-in-up border-2 border-white/20">
        
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-100 rounded-t-2xl overflow-hidden">
            <div 
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
            />
        </div>

        <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 transition-colors"
        >
            <span className="sr-only">Close</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>

        <div className="flex flex-col items-center text-center space-y-4 pt-4">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-blue-100">
                {React.cloneElement(currentStep.icon as React.ReactElement, { className: 'w-8 h-8' })}
            </div>
            
            <div className="space-y-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Step {stepIndex + 1} of {steps.length}
                </span>
                <h3 className="text-2xl font-black text-slate-900 leading-tight">
                    {currentStep.title}
                </h3>
                <p className="text-slate-600 font-medium leading-relaxed">
                    {currentStep.description}
                </p>
            </div>
        </div>

        <div className="flex gap-3 mt-8">
            <button 
                onClick={onPrev}
                disabled={stepIndex === 0}
                className="px-4 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-colors disabled:opacity-0"
            >
                Back
            </button>
            <button 
                onClick={isLastStep ? onClose : onNext}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-black uppercase tracking-wide shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
                {isLastStep ? (
                    <>Let's Go <Icons.Sparkles className="w-4 h-4" /></>
                ) : (
                    <>Next Step <Icons.ChevronDown className="w-4 h-4 -rotate-90" /></>
                )}
            </button>
        </div>
      </div>
    </div>
  );
};