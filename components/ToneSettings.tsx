import React, { useState } from 'react';
import { ToneSettings as ToneSettingsType } from '../types';
import { Icons } from '../constants';

interface ToneSettingsProps {
  settings: ToneSettingsType;
  onChange: (settings: ToneSettingsType) => void;
}

export const ToneSettings: React.FC<ToneSettingsProps> = ({ settings, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const updateSetting = <K extends keyof ToneSettingsType>(key: K, value: ToneSettingsType[K]) => {
    onChange({ ...settings, [key]: value });
  };

  const getComprehensionLabel = (val: number) => {
    if (val < 25) return "6th Grader";
    if (val < 50) return "Standard";
    if (val < 75) return "College";
    return "Masters/PhD";
  };

  return (
    <section className="bg-white rounded-xl shadow-md border-2 border-slate-900/5 overflow-hidden transition-all duration-300">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="px-5 py-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors group"
      >
        <h2 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
          <Icons.BookOpen className="w-4 h-4 text-blue-600" />
          Settings & Comprehension
        </h2>
        <div className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} text-slate-700 group-hover:text-blue-600`}>
          <Icons.ChevronDown className="w-5 h-5" />
        </div>
      </div>

      {isOpen && (
        <div className="px-5 pb-6 pt-2 border-t border-slate-200 bg-slate-50 space-y-8">
          
          {/* Main Sliders */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
            
            {/* Comprehension Slider - Featured */}
            <div className="col-span-1 md:col-span-2 space-y-3 p-4 bg-white rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600"></div>
                <div className="flex justify-between items-center mb-1">
                     <label className="text-sm font-black text-slate-800 uppercase tracking-wide flex items-center gap-2">
                         <Icons.Chart className="w-4 h-4 text-blue-600"/>
                         Comprehension Level
                     </label>
                     <span className="text-xs font-bold text-white bg-blue-600 px-3 py-1 rounded-full shadow-sm">
                         {getComprehensionLabel(settings.comprehensionLevel)}
                     </span>
                </div>
                <div className="px-1">
                    <input
                    type="range"
                    min="0"
                    max="100"
                    value={settings.comprehensionLevel}
                    onChange={(e) => updateSetting('comprehensionLevel', parseInt(e.target.value))}
                    className="w-full h-3 bg-slate-200 rounded-full appearance-none cursor-pointer accent-blue-600 hover:accent-blue-500"
                    />
                </div>
                <div className="flex justify-between text-[10px] font-bold text-slate-700 uppercase tracking-wide">
                  <span>Simple</span>
                  <span>Complex</span>
                </div>
            </div>

            {/* Other Settings */}
            {[
              { label: 'Formality', key: 'formality', minLabel: 'Casual', maxLabel: 'Formal' },
              { label: 'Emoji Usage', key: 'emojiUsage', minLabel: 'None', maxLabel: 'Heavy' },
              { label: 'Humor', key: 'humor', minLabel: 'Serious', maxLabel: 'Witty' },
            ].map((item) => (
              <div key={item.key} className="space-y-3">
                <div className="flex justify-between items-end">
                    <span className="text-xs font-black text-slate-800 uppercase tracking-wide">{item.label}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  // @ts-ignore
                  value={settings[item.key]}
                  // @ts-ignore
                  onChange={(e) => updateSetting(item.key, parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-blue-500"
                />
                <div className="flex justify-between text-[10px] font-bold text-slate-700 uppercase tracking-wide">
                  <span>{item.minLabel}</span>
                  <span>{item.maxLabel}</span>
                </div>
              </div>
            ))}
            
             {/* Perspective */}
             <div className="space-y-3">
               <div className="text-xs font-black text-slate-800 uppercase tracking-wide">Perspective</div>
               <div className="flex bg-slate-200 p-1 rounded-lg">
                 {(['first', 'second', 'third'] as const).map((p) => (
                   <button
                    key={p}
                    onClick={() => updateSetting('perspective', p)}
                    className={`flex-1 py-2 text-xs rounded-[6px] font-bold transition-all ${
                      settings.perspective === p 
                        ? 'bg-white text-blue-700 shadow-sm ring-1 ring-black/5' 
                        : 'text-slate-700 hover:text-slate-900'
                    }`}
                   >
                     {p === 'first' ? 'I / We' : p === 'second' ? 'You' : 'They'}
                   </button>
                 ))}
               </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};