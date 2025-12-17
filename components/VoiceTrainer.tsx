import React, { useState } from 'react';
import { Icons } from '../constants';
import { analyzeVoiceStyle } from '../services/geminiService';
import { VoiceProfile } from '../types';

interface VoiceTrainerProps {
  onSaveProfile: (profile: VoiceProfile) => void;
  existingProfile: VoiceProfile | null;
}

export const VoiceTrainer: React.FC<VoiceTrainerProps> = ({ onSaveProfile, existingProfile }) => {
  const [samples, setSamples] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(existingProfile?.description || null);

  const handleAnalyze = async () => {
    if (samples.length < 50) return;
    setIsAnalyzing(true);
    try {
        const result = await analyzeVoiceStyle(samples);
        setAnalysisResult(result);
        
        // Auto save
        const newProfile: VoiceProfile = {
            id: Date.now().toString(),
            name: "My Custom Voice",
            description: result,
            sampleText: samples
        };
        onSaveProfile(newProfile);
    } catch (error) {
        console.error(error);
    } finally {
        setIsAnalyzing(false);
    }
  };

  return (
    <div className="h-full flex flex-col gap-6 animate-fade-in-up">
      <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
        <Icons.Sparkles className="absolute -top-4 -right-4 w-24 h-24 text-slate-800 opacity-50" />
        <h2 className="text-xl font-black uppercase tracking-tight mb-2 flex items-center gap-2">
            <Icons.Robot className="w-6 h-6 text-blue-400" />
            Voice Trainer
        </h2>
        <p className="text-slate-200 text-sm font-medium leading-relaxed max-w-lg">
            Stop sounding like generic AI. Paste 3-5 examples of your best previous posts below. 
            We'll analyze your unique style—sentence length, vocabulary, and tone—to train the AI to write exactly like you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-grow">
         {/* Input Side */}
         <div className="flex flex-col gap-4">
             <div className="bg-white rounded-xl shadow-md border-2 border-slate-200 flex flex-col h-full overflow-hidden focus-within:border-blue-600 transition-colors">
                 <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                    <span className="text-xs font-black text-slate-700 uppercase tracking-widest">Training Data</span>
                    <span className="text-[10px] font-bold bg-slate-200 text-slate-600 px-2 py-1 rounded">Paste ~300 words</span>
                 </div>
                 <textarea 
                    value={samples}
                    onChange={(e) => setSamples(e.target.value)}
                    placeholder="Paste your past LinkedIn posts, tweets, or emails here..."
                    className="flex-grow p-4 resize-none outline-none text-sm leading-relaxed text-slate-800 placeholder:text-slate-500 font-medium"
                 />
                 <div className="p-4 border-t border-slate-100 bg-slate-50">
                    <button 
                        onClick={handleAnalyze}
                        disabled={isAnalyzing || samples.length < 50}
                        className={`w-full py-3 rounded-lg font-black text-sm uppercase tracking-wide transition-all flex items-center justify-center gap-2
                        ${samples.length >= 50 
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700 hover:translate-y-[-1px]' 
                            : 'bg-slate-200 text-slate-500 cursor-not-allowed'}
                        `}
                    >
                        {isAnalyzing ? (
                            <><Icons.Refresh className="w-4 h-4 animate-spin"/> Analyzing Style...</>
                        ) : (
                            <><Icons.MagicWand className="w-4 h-4"/> Train Voice Model</>
                        )}
                    </button>
                 </div>
             </div>
         </div>

         {/* Result Side */}
         <div className="flex flex-col gap-4">
            {analysisResult ? (
                <div className="bg-white rounded-xl shadow-md border-2 border-emerald-100 flex flex-col h-full overflow-hidden animate-fade-in-up">
                    <div className="px-4 py-3 bg-emerald-50 border-b border-emerald-100 flex justify-between items-center">
                        <span className="text-xs font-black text-emerald-900 uppercase tracking-widest flex items-center gap-2">
                            <Icons.Check className="w-4 h-4 text-emerald-500" />
                            Voice Model Active
                        </span>
                        <button 
                            onClick={() => { setAnalysisResult(null); setSamples(''); }}
                            className="text-[10px] font-bold text-emerald-600 hover:text-emerald-800"
                        >
                            RESET
                        </button>
                    </div>
                    <div className="p-6 flex-grow flex flex-col gap-4">
                        <div>
                            <div className="text-xs font-bold text-emerald-600 uppercase tracking-wide mb-1">Detected Style</div>
                            <p className="text-emerald-950 font-medium text-lg leading-relaxed">
                                "{analysisResult}"
                            </p>
                        </div>
                        <div className="mt-auto bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                            <p className="text-xs font-bold text-emerald-800">
                                <span className="mr-2">💡</span>
                                Your future generations will now automatically use this voice profile.
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="h-full border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-400 gap-4 bg-slate-50">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <Icons.Mic className="w-8 h-8 text-slate-300" />
                    </div>
                    <p className="text-sm font-bold">Analysis results will appear here</p>
                </div>
            )}
         </div>
      </div>
    </div>
  );
};