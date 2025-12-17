import React, { useState } from 'react';
import { Icons } from '../constants';
import { compoundIdea } from '../services/geminiService';
import { IdeaMatrix } from '../types';

export const IdeaCompounding: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [matrix, setMatrix] = useState<IdeaMatrix | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleCompound = async () => {
        if (!topic.trim()) return;
        setIsLoading(true);
        try {
            const result = await compoundIdea(topic);
            setMatrix(result);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const copyText = (text: string) => {
        navigator.clipboard.writeText(text);
        // Could trigger toast here
    };

    return (
        <div className="h-full flex flex-col gap-6 animate-fade-in-up pb-32 lg:pb-0">
             <div className="bg-gradient-to-r from-orange-900 to-red-900 text-white p-8 rounded-xl shadow-lg relative overflow-hidden">
                <Icons.Layers className="absolute -top-6 -right-6 w-32 h-32 text-white opacity-10 rotate-12" />
                <h2 className="text-2xl font-black uppercase tracking-tight mb-2 flex items-center gap-2 relative z-10">
                    <Icons.Layers className="w-7 h-7 text-orange-200" />
                    Idea Matrix
                </h2>
                <p className="text-orange-50 text-sm font-medium leading-relaxed max-w-lg relative z-10">
                    The cure for writer's block. Enter one simple topic, and we'll explode it into 20+ distinct angles, hooks, and content pieces you can use immediately.
                </p>
            </div>

            <div className="flex flex-col gap-6">
                <div className="flex gap-4">
                     <div className="flex-grow bg-white rounded-xl shadow-sm border-2 border-slate-200 p-2 flex items-center focus-within:border-orange-500 transition-colors">
                         <input 
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="Enter a topic (e.g., 'Remote Work', 'Vegan Diet', 'Bitcoin')"
                            className="w-full p-2 outline-none text-slate-900 font-bold placeholder:text-slate-500"
                            onKeyDown={(e) => e.key === 'Enter' && handleCompound()}
                         />
                     </div>
                     <button 
                        onClick={handleCompound}
                        disabled={isLoading || !topic.trim()}
                        className="px-6 rounded-xl bg-orange-600 text-white font-black uppercase tracking-wide shadow-lg shadow-orange-200 hover:bg-orange-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                         {isLoading ? <Icons.Refresh className="w-5 h-5 animate-spin"/> : <Icons.Layers className="w-5 h-5"/>}
                         <span className="hidden sm:inline">Compound Idea</span>
                     </button>
                </div>

                {matrix ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-20">
                         {matrix.results.map((item, idx) => (
                             <div key={idx} className="bg-white p-5 rounded-xl border-2 border-slate-100 hover:border-orange-200 transition-colors group shadow-sm">
                                 <div className="flex justify-between items-start mb-2">
                                     <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest bg-orange-50 px-2 py-1 rounded">
                                         {item.angle}
                                     </span>
                                     <button 
                                        onClick={() => copyText(item.content)}
                                        className="text-slate-400 hover:text-orange-600 transition-colors opacity-0 group-hover:opacity-100"
                                     >
                                         <Icons.Copy className="w-4 h-4" />
                                     </button>
                                 </div>
                                 <p className="text-slate-800 font-bold text-sm leading-relaxed">
                                     {item.content}
                                 </p>
                             </div>
                         ))}
                    </div>
                ) : (
                    <div className="border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-400 gap-4 bg-slate-50 py-20">
                         <Icons.Layers className="w-12 h-12 opacity-50" />
                         <p className="font-bold text-slate-600">Enter a topic above to generate the matrix.</p>
                    </div>
                )}
            </div>
        </div>
    );
};