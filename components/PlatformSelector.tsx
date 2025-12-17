import React from 'react';
import { PlatformId } from '../types';
import { PLATFORMS } from '../constants';

interface PlatformSelectorProps {
  selectedPlatforms: PlatformId[];
  onToggle: (id: PlatformId) => void;
}

export const PlatformSelector: React.FC<PlatformSelectorProps> = ({ selectedPlatforms, onToggle }) => {
  return (
    <section className="space-y-3">
       <div className="flex justify-between items-center px-1">
        <h2 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
          Select Platforms
        </h2>
        {selectedPlatforms.length > 0 && (
          <span className="text-[10px] bg-blue-700 text-white px-2 py-1 rounded font-bold shadow-sm">
            {selectedPlatforms.length} Selected
          </span>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {PLATFORMS.map((platform) => {
          const isSelected = selectedPlatforms.includes(platform.id);
          return (
            <button
              key={platform.id}
              onClick={() => onToggle(platform.id)}
              className={`
                flex items-center gap-2 px-3 py-2.5 rounded-lg border-2 text-sm font-bold transition-all duration-200
                active:scale-95 shadow-sm
                ${isSelected 
                  ? 'border-blue-700 bg-blue-700 text-white shadow-blue-200 ring-2 ring-blue-200 ring-offset-1' 
                  : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50 hover:text-slate-900'
                }
              `}
            >
              <div className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-600'}`}>
                {platform.icon}
              </div>
              <span>{platform.name}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
};