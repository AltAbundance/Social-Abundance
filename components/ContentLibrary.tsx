import React, { useState } from 'react';
import { Icons, PLATFORMS } from '../constants';
import { SavedContent, PlatformId } from '../types';

interface ContentLibraryProps {
  savedContent: SavedContent[];
  onDelete: (id: string) => void;
  onMakeGraphic?: (text: string) => void;
  onSchedule?: (content: string, platformId: PlatformId, contentId: string) => void;
}

export const ContentLibrary: React.FC<ContentLibraryProps> = ({ savedContent, onDelete, onMakeGraphic, onSchedule }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add toast here
  };

  if (savedContent.length === 0) {
      return (
        <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-6 animate-fade-in-up">
            <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center">
                <Icons.Archive className="w-10 h-10 text-slate-400" />
            </div>
            <div className="text-center space-y-2">
                <h3 className="text-xl font-black text-slate-800">Library Empty</h3>
                <p className="max-w-xs mx-auto text-sm font-medium text-slate-600">Generated content will be automatically saved here for future use.</p>
            </div>
        </div>
      );
  }

  return (
    <div className="h-full flex flex-col gap-6 animate-fade-in-up overflow-hidden">
        <div className="flex items-center justify-between">
            <h2 className="text-xl font-black uppercase tracking-tight text-slate-900 flex items-center gap-2">
                <Icons.Archive className="w-6 h-6 text-blue-600" />
                Content Library
            </h2>
            <span className="text-xs font-bold bg-slate-200 text-slate-700 px-3 py-1 rounded-full">
                {savedContent.length} items
            </span>
        </div>

        <div className="flex-grow overflow-y-auto no-scrollbar space-y-4 pb-24">
            {savedContent.map((item) => (
                <div key={item.id} className="bg-white rounded-xl shadow-sm border-2 border-slate-200 overflow-hidden group hover:border-blue-300 transition-colors">
                    {/* Header */}
                    <div 
                        onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                        className="p-4 cursor-pointer bg-slate-50 hover:bg-white transition-colors flex items-center justify-between"
                    >
                        <div className="flex flex-col gap-1 overflow-hidden">
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                                {formatDate(item.date)}
                            </span>
                            <h4 className="font-bold text-slate-900 truncate pr-4 text-sm">
                                {item.sourcePreview}...
                            </h4>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex -space-x-2">
                                {item.results.slice(0, 3).map((r, idx) => {
                                    const p = PLATFORMS.find(pl => pl.id === r.platformId);
                                    return (
                                        <div key={idx} className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700 shadow-sm z-10">
                                            <div className="w-3 h-3">{p?.icon}</div>
                                        </div>
                                    )
                                })}
                                {item.results.length > 3 && (
                                    <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[8px] font-bold text-slate-700 z-0">
                                        +{item.results.length - 3}
                                    </div>
                                )}
                            </div>
                            <Icons.ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${expandedId === item.id ? 'rotate-180' : ''}`} />
                        </div>
                    </div>

                    {/* Expanded Content */}
                    {expandedId === item.id && (
                        <div className="border-t border-slate-200 bg-white p-4 space-y-4">
                             {item.results.map((result, idx) => {
                                 const p = PLATFORMS.find(pl => pl.id === result.platformId);
                                 return (
                                     <div key={idx} className="space-y-2">
                                         <div className="flex items-center justify-between">
                                             <span className="flex items-center gap-2 text-xs font-black text-blue-700 uppercase">
                                                 <div className="w-4 h-4">{p?.icon}</div>
                                                 {p?.name}
                                             </span>
                                             <div className="flex gap-2">
                                                 {onSchedule && (
                                                     <button
                                                        onClick={(e) => { e.stopPropagation(); onSchedule(result.content, result.platformId, item.id); }}
                                                        className="text-[10px] font-bold text-slate-700 hover:text-blue-700 flex items-center gap-1"
                                                     >
                                                         <Icons.Calendar className="w-3 h-3" /> Schedule
                                                     </button>
                                                 )}
                                                 {onMakeGraphic && (
                                                     <button
                                                        onClick={(e) => { e.stopPropagation(); onMakeGraphic(result.content.substring(0, 150)); }}
                                                        className="text-[10px] font-bold text-slate-700 hover:text-blue-700 flex items-center gap-1"
                                                     >
                                                         <Icons.Image className="w-3 h-3" /> Visual
                                                     </button>
                                                 )}
                                                 <button 
                                                    onClick={(e) => { e.stopPropagation(); copyToClipboard(result.content); }}
                                                    className="text-[10px] font-bold text-slate-700 hover:text-blue-700 flex items-center gap-1"
                                                >
                                                    <Icons.Copy className="w-3 h-3" /> Copy
                                                </button>
                                             </div>
                                         </div>
                                         <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-sm text-slate-800 whitespace-pre-wrap font-medium">
                                             {result.content}
                                         </div>
                                     </div>
                                 )
                             })}
                             
                             {/* Quotables from history if available */}
                             {item.quotables && item.quotables.length > 0 && (
                                 <div className="mt-4 pt-4 border-t border-slate-100">
                                     <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest block mb-2">Quotables</span>
                                     <div className="flex flex-wrap gap-2">
                                         {item.quotables.map((q, i) => (
                                             <button 
                                                key={i}
                                                onClick={() => onMakeGraphic && onMakeGraphic(q)}
                                                className="text-xs bg-slate-100 hover:bg-blue-50 text-slate-800 hover:text-blue-800 px-3 py-1 rounded-full border border-slate-200 transition-colors"
                                             >
                                                 "{q.substring(0, 30)}..."
                                             </button>
                                         ))}
                                     </div>
                                 </div>
                             )}

                             <div className="pt-2 flex justify-end">
                                 <button 
                                    onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                                    className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 px-3 py-2 rounded hover:bg-red-50"
                                 >
                                     <Icons.Trash className="w-4 h-4" /> Delete Entry
                                 </button>
                             </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    </div>
  );
};