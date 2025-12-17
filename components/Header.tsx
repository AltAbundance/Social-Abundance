import React from 'react';
import { Icons } from '../constants';

interface HeaderProps {
    streak?: number;
    onStartTour?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ streak = 0, onStartTour }) => {
  return (
    <header className="bg-white border-b border-slate-300 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3 text-primary">
          <div className="text-blue-600">
             <Icons.MultiplierLogo className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>
          <h1 className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 leading-none flex flex-col">
            <span>SOCIAL</span>
            <span className="text-blue-600 text-[10px] sm:text-sm tracking-[0.2em]">ABUNDANCE</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
            {/* Trending Badge */}
            <div className="hidden lg:flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1.5 rounded-full border border-green-200">
                <Icons.Lightning className="w-3.5 h-3.5 fill-current" />
                <span className="text-xs font-bold uppercase tracking-wide">Trending: "AI Agents"</span>
            </div>

            {/* Streak Counter */}
            <div className="hidden sm:flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200" title="Day Streak">
                <Icons.Flame className={`w-4 h-4 ${streak > 0 ? 'text-orange-500' : 'text-slate-400'}`} />
                <span className="text-xs font-black text-slate-700">{streak}</span>
            </div>

            {/* Tour Button */}
             {onStartTour && (
                <button 
                    onClick={onStartTour}
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition-colors border border-slate-200"
                    title="Start Tour"
                >
                    <span className="font-black text-xs">?</span>
                </button>
            )}

            {/* Auth Buttons */}
            <div className="flex items-center gap-2 sm:gap-5 text-sm font-bold ml-2">
                <button className="hidden sm:block text-slate-900 hover:text-blue-700 transition-colors text-xs uppercase tracking-wider font-black">Login</button>
                <button className="bg-slate-900 text-white px-3 py-2 sm:px-5 sm:py-2.5 rounded-lg text-[10px] sm:text-xs font-black hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10 border-2 border-transparent hover:border-slate-700/50 flex items-center gap-1 whitespace-nowrap">
                    <Icons.Trophy className="w-3 h-3 sm:hidden" />
                    GET PRO
                </button>
            </div>
        </div>
      </div>
    </header>
  );
};