import React, { useState } from 'react';
import { Icons } from '../constants';
import { generateAudiencePersona } from '../services/geminiService';
import { AudiencePersona } from '../types';

interface AudiencePersonasProps {
    personas: AudiencePersona[];
    onAddPersona: (persona: AudiencePersona) => void;
    onDeletePersona: (id: string) => void;
    activePersonaId: string | null;
    onSetActivePersona: (id: string | null) => void;
}

export const AudiencePersonas: React.FC<AudiencePersonasProps> = ({ 
    personas, onAddPersona, onDeletePersona, activePersonaId, onSetActivePersona 
}) => {
    const [description, setDescription] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = async () => {
        if (!description.trim()) return;
        setIsGenerating(true);
        try {
            const result = await generateAudiencePersona(description);
            onAddPersona(result);
            setDescription('');
        } catch (error) {
            console.error(error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="h-full flex flex-col gap-6 animate-fade-in-up pb-32 lg:pb-0">
             <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white p-8 rounded-xl shadow-lg relative overflow-hidden">
                <Icons.Users className="absolute -top-6 -right-6 w-32 h-32 text-white opacity-10 rotate-12" />
                <h2 className="text-2xl font-black uppercase tracking-tight mb-2 flex items-center gap-2 relative z-10">
                    <Icons.Users className="w-7 h-7 text-purple-200" />
                    Ghost Audiences
                </h2>
                <p className="text-purple-50 text-sm font-medium leading-relaxed max-w-lg relative z-10">
                    Stop writing to "everyone." Create specific, fictional Ghost Personas. When you write for one specific person, your content becomes infinitely more magnetic.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                {/* Creator Column */}
                <div className="lg:col-span-1 flex flex-col gap-4">
                    <div className="bg-white rounded-xl shadow-md border-2 border-slate-200 flex flex-col overflow-hidden">
                        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
                             <span className="text-xs font-black text-slate-700 uppercase tracking-widest">Create New Persona</span>
                        </div>
                        <div className="p-4 flex-grow flex flex-col gap-4">
                             <textarea 
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe your target audience... (e.g., 'Corporate moms who want to start a side hustle but are exhausted')"
                                className="w-full h-32 p-3 text-sm border border-slate-200 rounded-lg outline-none focus:border-purple-500 resize-none text-slate-800 placeholder:text-slate-500"
                             />
                             <button 
                                onClick={handleGenerate}
                                disabled={isGenerating || !description.trim()}
                                className="w-full py-3 bg-purple-600 text-white rounded-lg font-bold text-sm hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-purple-200"
                             >
                                {isGenerating ? <Icons.Refresh className="w-4 h-4 animate-spin"/> : <Icons.MagicWand className="w-4 h-4"/>}
                                Summon Persona
                             </button>
                        </div>
                    </div>
                </div>

                {/* List Column */}
                <div className="lg:col-span-2 overflow-y-auto no-scrollbar pb-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {personas.map(persona => (
                            <div 
                                key={persona.id} 
                                className={`
                                    relative bg-white rounded-xl border-2 transition-all cursor-pointer group hover:shadow-md
                                    ${activePersonaId === persona.id ? 'border-purple-600 ring-2 ring-purple-100' : 'border-slate-200 hover:border-purple-300'}
                                `}
                                onClick={() => onSetActivePersona(activePersonaId === persona.id ? null : persona.id)}
                            >
                                {activePersonaId === persona.id && (
                                    <div className="absolute top-0 right-0 bg-purple-600 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg rounded-tr-sm">
                                        ACTIVE
                                    </div>
                                )}
                                <div className="p-5 space-y-3">
                                    <div>
                                        <h3 className="font-black text-slate-900 text-lg leading-tight">{persona.name}</h3>
                                        <p className="text-xs font-bold text-slate-600 uppercase">{persona.role}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <div>
                                            <span className="text-[10px] font-black text-red-600 uppercase tracking-wide">Pain Points</span>
                                            <p className="text-xs text-slate-700 line-clamp-2 leading-relaxed">{persona.painPoints.join(", ")}</p>
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wide">Desires</span>
                                            <p className="text-xs text-slate-700 line-clamp-2 leading-relaxed">{persona.desires.join(", ")}</p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-500 italic pt-2 border-t border-slate-100 line-clamp-2">"{persona.description}"</p>
                                </div>
                                <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex justify-between items-center rounded-b-xl">
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); onDeletePersona(persona.id); }}
                                        className="text-xs text-slate-500 hover:text-red-600 font-bold flex items-center gap-1"
                                    >
                                        <Icons.Trash className="w-3 h-3" /> Remove
                                    </button>
                                    <span className={`text-xs font-bold ${activePersonaId === persona.id ? 'text-purple-600' : 'text-slate-500 group-hover:text-purple-600'}`}>
                                        {activePersonaId === persona.id ? 'Selected' : 'Click to Select'}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {personas.length === 0 && (
                            <div className="col-span-2 flex flex-col items-center justify-center p-12 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                                <Icons.Users className="w-12 h-12 mb-4 opacity-50" />
                                <p className="font-bold text-slate-600">No personas yet.</p>
                                <p className="text-sm text-slate-500">Create your first ghost audience to get started.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};