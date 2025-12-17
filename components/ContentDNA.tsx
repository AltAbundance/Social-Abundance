import React, { useState } from 'react';
import { Icons } from '../constants';
import { generateContentDNAReport } from '../services/geminiService';
import { ContentDNAReport } from '../types';

export const ContentDNA: React.FC = () => {
    const [historyText, setHistoryText] = useState('');
    const [report, setReport] = useState<ContentDNAReport | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleAnalyze = async () => {
        if (historyText.length < 50) return;
        setIsLoading(true);
        try {
            const result = await generateContentDNAReport(historyText);
            setReport(result);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col gap-6 animate-fade-in-up pb-32 lg:pb-0">
             <div className="bg-gradient-to-br from-indigo-900 to-blue-900 text-white p-8 rounded-xl shadow-lg relative overflow-hidden">
                <Icons.DNA className="absolute -top-6 -right-6 w-32 h-32 text-white opacity-10 rotate-12" />
                <h2 className="text-2xl font-black uppercase tracking-tight mb-2 flex items-center gap-2 relative z-10">
                    <Icons.DNA className="w-7 h-7 text-indigo-200" />
                    Content DNA Test
                </h2>
                <p className="text-indigo-50 text-sm font-medium leading-relaxed max-w-lg relative z-10">
                    Understand your creative psychology. Paste your best (and worst) content below to get a forensic diagnostic report on your unique strengths, blind spots, and creator archetype.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-grow">
                {/* Input Area */}
                <div className="flex flex-col gap-4">
                    <div className="bg-white rounded-xl shadow-md border-2 border-slate-200 flex flex-col h-full overflow-hidden focus-within:border-indigo-500 transition-colors">
                        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                            <span className="text-xs font-black text-slate-700 uppercase tracking-widest">Content Samples</span>
                            <span className="text-[10px] font-bold bg-slate-200 text-slate-600 px-2 py-1 rounded">Min 100 words</span>
                        </div>
                        <textarea 
                            value={historyText}
                            onChange={(e) => setHistoryText(e.target.value)}
                            placeholder="Paste 3-5 of your recent posts here for analysis..."
                            className="flex-grow p-4 resize-none outline-none text-sm leading-relaxed text-slate-800 placeholder:text-slate-500 font-medium min-h-[200px]"
                        />
                        <div className="p-4 border-t border-slate-100 bg-slate-50">
                            <button 
                                onClick={handleAnalyze}
                                disabled={isLoading || historyText.length < 50}
                                className={`w-full py-3 rounded-lg font-black text-sm uppercase tracking-wide transition-all flex items-center justify-center gap-2
                                ${historyText.length >= 50 
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:translate-y-[-1px]' 
                                    : 'bg-slate-200 text-slate-500 cursor-not-allowed'}
                                `}
                            >
                                {isLoading ? (
                                    <><Icons.Refresh className="w-4 h-4 animate-spin"/> Running Diagnostics...</>
                                ) : (
                                    <><Icons.DNA className="w-4 h-4"/> Run DNA Test</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Report Area */}
                <div className="flex flex-col gap-4">
                    {report ? (
                        <div className="bg-white rounded-xl shadow-lg border-2 border-indigo-100 overflow-hidden animate-fade-in-up h-full flex flex-col">
                            <div className="bg-indigo-50 px-6 py-5 border-b border-indigo-100">
                                <span className="text-xs font-bold text-indigo-500 uppercase tracking-wide block mb-1">Your Archetype</span>
                                <h3 className="text-2xl font-black text-indigo-900">{report.archetype}</h3>
                            </div>
                            
                            <div className="p-6 overflow-y-auto space-y-6 flex-grow">
                                <div>
                                    <h4 className="text-sm font-black text-slate-900 uppercase mb-2 flex items-center gap-2">
                                        <Icons.Mic className="w-4 h-4 text-blue-500" /> Voice Fingerprint
                                    </h4>
                                    <p className="text-slate-800 text-sm italic border-l-4 border-blue-200 pl-3">"{report.voiceFingerprint}"</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="text-sm font-black text-emerald-700 uppercase mb-2 flex items-center gap-2">
                                            <Icons.Check className="w-4 h-4" /> Strengths
                                        </h4>
                                        <ul className="space-y-2">
                                            {report.strengths.map((s, i) => (
                                                <li key={i} className="text-sm text-slate-800 font-medium flex items-start gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0"></span>
                                                    {s}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-orange-700 uppercase mb-2 flex items-center gap-2">
                                            <Icons.Lightning className="w-4 h-4" /> Blind Spots
                                        </h4>
                                        <ul className="space-y-2">
                                            {report.blindSpots.map((s, i) => (
                                                <li key={i} className="text-sm text-slate-800 font-medium flex items-start gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 flex-shrink-0"></span>
                                                    {s}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <h4 className="text-sm font-black text-slate-900 uppercase mb-3 flex items-center gap-2">
                                        <Icons.Chart className="w-4 h-4 text-blue-600" /> Growth Roadmap
                                    </h4>
                                    <div className="space-y-3">
                                        {report.growthRoadmap.map((step, i) => (
                                            <div key={i} className="flex gap-3">
                                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                                                    {i + 1}
                                                </span>
                                                <p className="text-sm text-slate-800 font-medium pt-0.5">{step}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-400 gap-4 bg-slate-50 min-h-[300px]">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
                                <Icons.DNA className="w-8 h-8 text-slate-300" />
                            </div>
                            <p className="text-sm font-bold text-slate-600">Your DNA Report will appear here</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};