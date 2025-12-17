import React, { useState, useEffect } from 'react';
import { GenerationResult, PlatformId } from '../types';
import { Icons, PLATFORMS } from '../constants';

interface ResultsSectionProps {
  results: GenerationResult[];
  quotables?: string[];
  onMakeGraphic: (text: string) => void;
  onSchedule?: (content: string, platformId: PlatformId) => void;
}

export const ResultsSection: React.FC<ResultsSectionProps> = ({ results, quotables, onMakeGraphic, onSchedule }) => {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (results.length > 0) {
        const activeExists = results.find(r => r.platformId === activeTab);
        if (!activeTab || !activeExists) {
            setActiveTab(results[0].platformId);
        }

        const hasHighScore = results.some(r => r.scores && r.scores.total >= 90);
        if (hasHighScore) {
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 5000);
        }
    }
  }, [results, activeTab]);

  if (results.length === 0) return null;

  const activeResult = results.find(r => r.platformId === activeTab) || results[0];
  const platformConfig = PLATFORMS.find(p => p.id === activeResult.platformId);
  const scores = activeResult.scores || { hook: 0, virality: 0, total: 0, reasoning: "No score available" };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(activeResult.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareScore = () => {
      const shareText = `I just scored ${scores.total}/100 on my ${platformConfig?.name} post with Content Multiplier! 🚀\nHook Score: ${scores.hook}\nVirality Score: ${scores.virality}`;
      navigator.clipboard.writeText(shareText);
      alert("Scorecard copied to clipboard!");
  };

  const getScoreColor = (score: number) => {
      if (score >= 90) return 'text-emerald-900 bg-emerald-50 border-emerald-400';
      if (score >= 70) return 'text-blue-900 bg-blue-50 border-blue-400';
      return 'text-orange-900 bg-orange-50 border-orange-400';
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up pb-10">
    <div className="bg-white rounded-xl shadow-lg border-2 border-slate-300 overflow-hidden flex flex-col relative h-auto min-h-[500px] lg:h-full">
      {showConfetti && (
          <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
              {[...Array(20)].map((_, i) => (
                  <div 
                    key={i}
                    className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-bounce"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `-10%`,
                        animationDuration: `${Math.random() * 2 + 1}s`,
                        animationDelay: `${Math.random()}s`,
                        backgroundColor: ['#f43f5e', '#8b5cf6', '#10b981', '#f59e0b'][Math.floor(Math.random() * 4)]
                    }}
                  />
              ))}
          </div>
      )}

      <div className="bg-slate-100 border-b-2 border-slate-300">
        <div className="flex overflow-x-auto no-scrollbar scroll-smooth px-2 pt-2 gap-1.5">
          {results.map((result) => {
             const pConfig = PLATFORMS.find(p => p.id === result.platformId);
             const isActive = activeTab === result.platformId;
             const score = result.scores?.total || 0;
             return (
               <button
                 key={result.platformId}
                 onClick={() => { setActiveTab(result.platformId); setCopied(false); }}
                 className={`
                    flex items-center gap-1.5 px-3 py-2.5 border-t-2 border-x-2 rounded-t-lg text-[11px] sm:text-sm font-black whitespace-nowrap transition-all group uppercase tracking-tight
                    ${isActive 
                        ? 'bg-white border-slate-300 text-blue-700 border-b-white -mb-0.5 z-10' 
                        : 'bg-slate-200 border-transparent text-slate-700 hover:bg-slate-300 hover:text-slate-900'
                    }
                 `}
               >
                 <div className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isActive ? 'text-blue-600' : 'text-slate-600'}`}>{pConfig?.icon}</div>
                 <span className="hidden sm:inline">{pConfig?.name}</span>
                 <span className="sm:hidden">{pConfig?.name.split('/')[0]}</span>
                 <span className={`text-[9px] px-1.5 rounded-full ${score >= 90 ? 'bg-emerald-600 text-white' : 'bg-slate-400 text-white group-hover:bg-slate-500'}`}>
                     {score}
                 </span>
               </button>
             );
          })}
        </div>
      </div>

      <div className="flex-grow flex flex-col relative bg-white group overflow-visible">
        <div className="px-4 py-3 sm:px-6 sm:py-4 bg-slate-50/50 border-b-2 border-slate-100 flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-3 sm:gap-4">
                <div className={`flex flex-col items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg border-2 shadow-sm ${getScoreColor(scores.total)}`}>
                    <span className="text-xl sm:text-2xl font-black leading-none">{scores.total}</span>
                    <span className="text-[8px] sm:text-[10px] uppercase font-black tracking-widest opacity-80">Total</span>
                </div>
                <div className="flex gap-3 sm:gap-4 py-1.5 sm:py-2">
                    <div className="flex flex-col justify-center">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">Hook</span>
                        <span className="text-xs sm:text-sm font-black text-slate-950">{scores.hook}/100</span>
                    </div>
                    <div className="w-[2px] bg-slate-200"></div>
                    <div className="flex flex-col justify-center">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">Virality</span>
                        <span className="text-xs sm:text-sm font-black text-slate-950">{scores.virality}/100</span>
                    </div>
                </div>
            </div>
            
            <button 
                onClick={handleShareScore}
                className="text-[10px] sm:text-xs font-black text-slate-900 hover:text-blue-700 flex items-center gap-1.5 transition-colors uppercase tracking-widest"
            >
                <Icons.Share className="w-3.5 h-3.5" /> Share Score
            </button>
        </div>

        <div className="px-4 py-2 sm:px-6 sm:py-2 bg-white border-b border-slate-100">
             <p className="text-[10px] sm:text-xs text-slate-950 font-bold italic">
                 <span className="font-black not-italic text-blue-700 mr-2 uppercase text-[9px] tracking-widest">Critic Analysis:</span>
                 "{scores.reasoning}"
             </p>
        </div>

        <div className="relative flex-grow flex flex-col">
            <div className="absolute top-4 right-4 z-20 hidden lg:flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {onSchedule && (
                     <button 
                        onClick={() => onSchedule(activeResult.content, activeResult.platformId)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black bg-white text-slate-950 border-2 border-slate-200 hover:border-blue-500 hover:text-blue-700 shadow-sm transition-all"
                    >
                        <Icons.Calendar className="w-4 h-4" />
                        <span>SCHEDULE</span>
                    </button>
                )}
                <button 
                    onClick={() => onMakeGraphic(activeResult.content.substring(0, 150))}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black bg-white text-slate-950 border-2 border-slate-200 hover:border-blue-500 hover:text-blue-700 shadow-sm transition-all"
                >
                    <Icons.Image className="w-4 h-4" />
                    <span>VISUAL</span>
                </button>
                <button 
                    onClick={handleCopy}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black transition-all shadow-md transform active:scale-95 ${
                        copied 
                        ? 'bg-emerald-600 text-white border-2 border-emerald-700' 
                        : 'bg-slate-950 text-white hover:bg-slate-900 border-2 border-slate-950'
                    }`}
                >
                    {copied ? <Icons.Check className="w-3.5 h-3.5" /> : <Icons.Copy className="w-3.5 h-3.5" />}
                    {copied ? 'COPIED' : 'COPY'}
                </button>
            </div>
            <textarea
                readOnly
                className="w-full flex-grow p-4 sm:p-6 resize-none outline-none text-slate-950 text-sm sm:text-base leading-relaxed bg-white font-bold no-scrollbar min-h-[300px]"
                value={activeResult.content}
            />
        </div>
        
        <div className="lg:hidden p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap gap-2 justify-end sticky bottom-0 z-30">
             {onSchedule && (
                 <button 
                    onClick={() => onSchedule(activeResult.content, activeResult.platformId)}
                    className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-white text-slate-950 border-2 border-slate-300 shadow-sm active:scale-95 text-[10px] font-black uppercase tracking-tighter"
                >
                    <Icons.Calendar className="w-4 h-4" /> PLAN
                </button>
             )}
             <button 
                onClick={() => onMakeGraphic(activeResult.content.substring(0, 150))}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-white text-slate-950 border-2 border-slate-300 shadow-sm active:scale-95 text-[10px] font-black uppercase tracking-tighter"
            >
                <Icons.Image className="w-4 h-4" /> VISUAL
            </button>
             <button 
                onClick={handleCopy}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[10px] font-black transition-all shadow-md active:scale-95 uppercase tracking-tighter border-2 ${
                    copied 
                    ? 'bg-emerald-600 text-white border-emerald-700' 
                    : 'bg-blue-600 text-white border-blue-700'
                }`}
            >
                {copied ? <Icons.Check className="w-4 h-4" /> : <Icons.Copy className="w-4 h-4" />}
                {copied ? 'COPIED' : 'COPY ALL'}
            </button>
        </div>
      </div>
    </div>

    {quotables && quotables.length > 0 && (
        <div className="bg-slate-950 rounded-xl p-4 sm:p-6 shadow-xl border-2 border-white/10">
             <div className="flex items-center gap-2 mb-4">
                 <div className="bg-orange-500 p-2 rounded-lg text-white shadow-lg">
                     <Icons.Quote className="w-4 h-4" />
                 </div>
                 <h3 className="text-white font-black uppercase tracking-widest text-xs sm:text-sm">Abundance Nuggets</h3>
             </div>
             <div className="grid gap-3">
                 {quotables.map((quote, idx) => (
                     <div key={idx} className="bg-slate-900 p-4 rounded-xl border-2 border-slate-800 hover:border-blue-500 transition-all flex justify-between items-center group shadow-inner">
                         <p className="text-slate-100 font-bold text-xs sm:text-sm pr-4 line-clamp-2 italic leading-relaxed pr-2 flex-grow">"{quote}"</p>
                         <button 
                            onClick={() => onMakeGraphic(quote)}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest whitespace-nowrap lg:opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1.5 shadow-lg border-b-2 border-blue-800"
                         >
                             <Icons.Image className="w-3 h-3" /> CREATE
                         </button>
                     </div>
                 ))}
             </div>
        </div>
    )}
    </div>
  );
};