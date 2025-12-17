import React from 'react';
import { Icons } from '../constants';
import { AudiencePersona } from '../types';

interface InputSectionProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  voiceActive?: boolean;
  activePersona?: AudiencePersona | null;
}

export const InputSection: React.FC<InputSectionProps> = ({ value, onChange, onClear, voiceActive, activePersona }) => {
  return (
    <section className={`bg-white rounded-xl shadow-md border-2 overflow-hidden flex flex-col h-full group transition-all duration-200 ${voiceActive ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-slate-200 focus-within:border-blue-600'}`}>
      <div className={`px-5 py-3 border-b flex justify-between items-center ${voiceActive ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-200'}`}>
        <div className="flex items-center gap-3 overflow-hidden">
            <h2 className={`text-xs font-black uppercase tracking-widest flex-shrink-0 ${voiceActive ? 'text-emerald-900' : 'text-slate-800'}`}>
            Source Material
            </h2>
            <div className="flex items-center gap-2 overflow-hidden">
                {voiceActive && (
                    <span className="flex-shrink-0 flex items-center gap-1 text-[9px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full shadow-sm animate-pulse">
                        <Icons.Mic className="w-3 h-3" />
                        VOICE ACTIVE
                    </span>
                )}
                {activePersona && (
                    <span className="flex-shrink-0 flex items-center gap-1 text-[9px] font-bold bg-purple-600 text-white px-2 py-0.5 rounded-full shadow-sm" title={`Targeting: ${activePersona.name}`}>
                        <Icons.Users className="w-3 h-3" />
                        TARGET: {activePersona.name}
                    </span>
                )}
            </div>
        </div>
        {value.length > 0 && (
          <button 
            onClick={onClear}
            className="text-[10px] text-slate-700 hover:text-red-700 flex items-center gap-1.5 font-bold px-2.5 py-1.5 rounded bg-white border border-slate-300 hover:bg-red-50 hover:border-red-300 transition-all uppercase tracking-wide shadow-sm flex-shrink-0"
          >
            <Icons.Trash className="w-3 h-3" />
            Clear
          </button>
        )}
      </div>
      <div className="relative flex-grow bg-white">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste your blog post, transcript, or rough notes here..."
          className="w-full h-32 sm:h-40 lg:h-full p-5 outline-none resize-none text-slate-900 text-base font-semibold leading-relaxed bg-transparent placeholder:text-slate-500"
        />
        <div className={`
          absolute bottom-3 right-3 text-[10px] font-bold px-2 py-1 rounded border transition-all
          ${value.length > 0 ? 'bg-slate-100 text-slate-700 border-slate-300 shadow-sm' : 'opacity-0'}
        `}>
          {value.length} chars
        </div>
      </div>
    </section>
  );
};