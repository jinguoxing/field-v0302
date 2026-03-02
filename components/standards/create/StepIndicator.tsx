import React from 'react';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  steps: string[];
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, steps }) => {
  return (
    <div className="flex items-center">
      {steps.map((step, index) => {
        const stepNum = index + 1;
        const isActive = stepNum === currentStep;
        const isCompleted = stepNum < currentStep;

        return (
          <div key={step} className="flex items-center">
            <div className={`flex items-center gap-2 ${isActive ? 'text-white' : isCompleted ? 'text-emerald-400' : 'text-slate-500'}`}>
              <div 
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-colors
                  ${isActive 
                    ? 'bg-cyan-600 border-cyan-500 text-white shadow-[0_0_10px_rgba(8,145,178,0.5)]' 
                    : isCompleted 
                      ? 'bg-emerald-900/30 border-emerald-500 text-emerald-400' 
                      : 'bg-slate-800 border-slate-600 text-slate-500'
                  }`}
              >
                {isCompleted ? <Check size={14} /> : stepNum}
              </div>
              <span className={`text-xs font-medium ${isActive ? 'text-slate-200' : ''}`}>{step}</span>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-8 h-px mx-3 ${isCompleted ? 'bg-emerald-500/50' : 'bg-slate-700'}`}></div>
            )}
          </div>
        );
      })}
    </div>
  );
};