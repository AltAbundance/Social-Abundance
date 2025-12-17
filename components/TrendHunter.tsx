import React, { useState } from 'react';
import { Icons } from '../constants';
import { generateTrendIdeas } from '../services/geminiService';
import { TrendReport } from '../types';

interface TrendHunterProps {
    onUseIdea: (text: string) => void;
}

export const TrendHunter: React.FC<TrendHunterProps> = ({ onUseIdea }) => {
    const [niche, setNiche] = useState('');
    const [report, setReport] = useState<TrendReport | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleHunt = async () => {
        if (!niche.trim()) return;
        setIsLoading(true);
        try {
            const result = await generateTrendIdeas(niche);
            setReport(result);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col gap-6 animate-fade-in-up pb-32 lg:pb-0">
             <div className="bg-gradient-to-r from-red-900 to-pink-900 text-white p-8 rounded-xl shadow-lg relative overflow-hidden">
                <Icons.Radar className="absolute -top-6 -right-6 w-32 h-32 text-white opacity-10 rotate-12" />
                <h2 className="text-2xl font-black uppercase tracking-tight mb-2 flex items-center gap-2 relative z-10">
                    <Icons.Radar className="w-7 h-7 text-pink-200" />
                    Trend Hunter
                </h2>
                <p className="text-pink-50 text-sm font-medium leading-relaxed max-w-lg relative z-10">
                    Never run out of ideas. We scan the live web for breaking news in your niche and instantly generate 3 high-value content angles you can use right now.
                </p>
            </div>

            <div className="flex flex-col gap-6">
                {/* Search Bar */}
                <div className="flex gap-4">
                     <div className="flex-grow bg-white rounded-xl shadow-sm border-2 border-slate-200 p-2 flex items-center focus-within:border-pink-500 transition-colors">
                         <input 
                            type="text"
                            value={niche}
                            onChange={(e) => setNiche(e.target.value)}
                            placeholder="Enter your niche (e.g., 'SaaS Marketing', 'Crypto', 'Interior Design')"
                            className="w-full p-2 outline-none text-slate-900 font-bold placeholder:text-slate-500"
                            onKeyDown={(e) => e.key === 'Enter' && handleHunt()}
                         />
                     </div>
                     <button 
                        onClick={handleHunt}
                        disabled={isLoading || !niche.trim()}
                        className="px-6 rounded-xl bg-pink-600 text-white font-black uppercase tracking-wide shadow-lg shadow-pink-200 hover:bg-pink-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                         {isLoading ? <Icons.Refresh className="w-5 h-5 animate-spin"/> : <Icons.Radar className="w-5 h-5"/>}
                         <span className="hidden sm:inline">Hunt Trends</span>
                     </button>
                </div>

                {report ? (
                    <div className="flex flex-col gap-8 pb-20">
                         {/* Sources */}
                         {report.sources && report.sources.length > 0 && (
                             <div>
                                 <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest mb-3">Detected Signals (Sources)</h3>
                                 <div className="flex flex-wrap gap-2">
                                     {report.sources.map((source, i) => (
                                         <a 
                                            key={i} 
                                            href={source.url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-blue-700 hover:text-blue-900 hover:border-blue-300 transition-colors flex items-center gap-2"
                                         >
                                             <Icons.Share className="w-3 h-3" />
                                             {source.title.length > 30 ? source.title.substring(0, 30) + '...' : source.title}
                                         </a>
                                     ))}
                                 </div>
                             </div>
                         )}

                         {/* Trends Grid */}
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                             {report.trends.map((item, idx) => (
                                 <div key={idx} className="bg-white p-6 rounded-xl border-2 border-slate-100 hover:border-pink-200 transition-all group shadow-sm flex flex-col h-full">
                                     <div className="mb-4">
                                         <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded inline-block mb-3
                                            ${idx === 0 ? 'bg-orange-100 text-orange-800' : idx === 1 ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}
                                         `}>
                                             {item.angle}
                                         </span>
                                         <h3 className="font-black text-slate-900 text-lg leading-tight mb-2">
                                             {item.headline}
                                         </h3>
                                         <p className="text-slate-800 text-sm leading-relaxed">
                                             {item.description}
                                         </p>
                                     </div>
                                     <div className="mt-auto pt-4 border-t border-slate-50">
                                         <button 
                                            onClick={() => onUseIdea(`${item.headline}\n\n${item.description}\n\nAngle: ${item.angle}`)}
                                            className="w-full py-2 bg-slate-900 text-white rounded-lg font-bold text-xs uppercase tracking-wide hover:bg-pink-600 transition-colors shadow-lg shadow-slate-200 group-hover:shadow-pink-100"
                                         >
                                             Use this Idea
                                         </button>
                                     </div>
                                 </div>
                             ))}
                         </div>
                    </div>
                ) : (
                    <div className="border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-400 gap-4 bg-slate-50 py-20 min-h-[300px]">
                         <Icons.Radar className="w-12 h-12 opacity-50" />
                         <p className="font-bold text-slate-600">Enter your niche above to scan the web.</p>
                    </div>
                )}
            </div>
        </div>
    );
};