import React, { useState } from 'react';
import { Icons } from '../constants';
import { reverseEngineerViralPost } from '../services/geminiService';
import { ViralAnalysis } from '../types';

export const ViralLab: React.FC = () => {
    const [inputUrl, setInputUrl] = useState('');
    const [analysis, setAnalysis] = useState<ViralAnalysis | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleAnalyze = async () => {
        if (!inputUrl.trim()) return;
        setIsLoading(true);
        try {
            const result = await reverseEngineerViralPost(inputUrl);
            setAnalysis(result);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col gap-6 animate-fade-in-up pb-32 lg:pb-0">
             <div className="bg-gradient-to-r from-teal-900 to-emerald-900 text-white p-8 rounded-xl shadow-lg relative overflow-hidden">
                <Icons.Lab className="absolute -top-6 -right-6 w-32 h-32 text-white opacity-10 rotate-12" />
                <h2 className="text-2xl font-black uppercase tracking-tight mb-2 flex items-center gap-2 relative z-10">
                    <Icons.Lab className="w-7 h-7 text-emerald-200" />
                    Viral Lab
                </h2>
                <p className="text-emerald-50 text-sm font-medium leading-relaxed max-w-lg relative z-10">
                    Don't just scroll past viral hits—steal their secrets. Paste any high-performing post below to reverse-engineer its psychological triggers and get a reusable template.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
                {/* Input Area */}
                <div className="lg:col-span-5 flex flex-col gap-4">
                    <div className="bg-white rounded-xl shadow-md border-2 border-slate-200 flex flex-col h-full overflow-hidden focus-within:border-emerald-500 transition-colors">
                        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                            <span className="text-xs font-black text-slate-700 uppercase tracking-widest">Viral Source</span>
                        </div>
                        <textarea 
                            value={inputUrl}
                            onChange={(e) => setInputUrl(e.target.value)}
                            placeholder="Paste the viral post text here..."
                            className="flex-grow p-4 resize-none outline-none text-sm leading-relaxed text-slate-800 placeholder:text-slate-500 font-medium min-h-[200px]"
                        />
                        <div className="p-4 border-t border-slate-100 bg-slate-50">
                            <button 
                                onClick={handleAnalyze}
                                disabled={isLoading || inputUrl.length < 10}
                                className={`w-full py-3 rounded-lg font-black text-sm uppercase tracking-wide transition-all flex items-center justify-center gap-2
                                ${inputUrl.length >= 10 
                                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200 hover:bg-emerald-700 hover:translate-y-[-1px]' 
                                    : 'bg-slate-200 text-slate-500 cursor-not-allowed'}
                                `}
                            >
                                {isLoading ? (
                                    <><Icons.Refresh className="w-4 h-4 animate-spin"/> Deconstructing...</>
                                ) : (
                                    <><Icons.Lab className="w-4 h-4"/> Analyze Secrets</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Results Area */}
                <div className="lg:col-span-7">
                    {analysis ? (
                        <div className="bg-white rounded-xl shadow-lg border-2 border-emerald-100 overflow-hidden animate-fade-in-up">
                            <div className="bg-emerald-50 px-6 py-4 border-b border-emerald-100 flex items-center gap-3">
                                <div className="p-2 bg-emerald-100 rounded-lg text-emerald-700">
                                    <Icons.Check className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-emerald-900 uppercase">Analysis Complete</h3>
                                    <p className="text-xs text-emerald-800 font-bold">Hook Type: {analysis.hookType}</p>
                                </div>
                            </div>
                            
                            <div className="p-6 space-y-6">
                                {/* Triggers */}
                                <div>
                                    <label className="text-xs font-black text-slate-700 uppercase tracking-widest mb-2 block">Psychological Triggers</label>
                                    <div className="flex flex-wrap gap-2">
                                        {analysis.psychologicalTriggers.map((t, i) => (
                                            <span key={i} className="px-3 py-1 bg-red-50 text-red-600 border border-red-100 rounded-full text-xs font-bold">
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Template */}
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                    <label className="text-xs font-black text-slate-700 uppercase tracking-widest mb-2 block flex items-center gap-2">
                                        <Icons.Copy className="w-3 h-3" /> The Template
                                    </label>
                                    <div className="text-slate-800 font-mono text-sm whitespace-pre-wrap leading-relaxed">
                                        {analysis.structureTemplate}
                                    </div>
                                </div>

                                {/* Repurposed Example */}
                                <div>
                                    <label className="text-xs font-black text-slate-700 uppercase tracking-widest mb-2 block">Repurposed Example</label>
                                    <p className="text-slate-800 text-sm leading-relaxed border-l-4 border-emerald-300 pl-4 italic">
                                        "{analysis.repurposedExample}"
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-400 gap-4 bg-slate-50 min-h-[300px]">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
                                <Icons.Lab className="w-8 h-8 text-slate-300" />
                            </div>
                            <p className="text-sm font-bold text-slate-600">Paste content to see the breakdown</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};