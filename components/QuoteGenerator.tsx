import React, { useState, useRef, useEffect } from 'react';
import { Icons, QUOTE_TEMPLATES, DEFAULT_VISUAL_SETTINGS, QUOTE_FONTS } from '../constants';
import { VisualSettings, QuoteTemplateId, AspectRatio } from '../types';

interface QuoteGeneratorProps {
  initialText?: string;
}

export const QuoteGenerator: React.FC<QuoteGeneratorProps> = ({ initialText = '' }) => {
  const [text, setText] = useState(initialText);
  const [settings, setSettings] = useState<VisualSettings>(DEFAULT_VISUAL_SETTINGS);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [scale, setScale] = useState(0.4);

  useEffect(() => {
    if (initialText) setText(initialText);
    
    // Load saved settings
    const saved = localStorage.getItem('visualSettings');
    if (saved) {
        setSettings({ ...JSON.parse(saved), templateId: settings.templateId });
    }
  }, [initialText]);

  // Handle responsive scaling for the preview
  useEffect(() => {
    const handleResize = () => {
        if (window.innerWidth < 640) {
            setScale(0.28); // Smaller scale for mobile
        } else if (window.innerWidth < 1024) {
            setScale(0.35); // Tablet scale
        } else {
            setScale(0.4); // Desktop scale
        }
    };
    
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const updateSetting = <K extends keyof VisualSettings>(key: K, value: VisualSettings[K]) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    
    const toSave = {
        backgroundColor: newSettings.backgroundColor,
        textColor: newSettings.textColor,
        accentColor: newSettings.accentColor,
        fontFamily: newSettings.fontFamily,
        showHandle: newSettings.showHandle,
        handleText: newSettings.handleText
    };
    localStorage.setItem('visualSettings', JSON.stringify(toSave));
  };

  const downloadImage = async () => {
    if (!cardRef.current || !(window as any).html2canvas) return;
    setIsDownloading(true);

    try {
        const canvas = await (window as any).html2canvas(cardRef.current, {
            scale: 2, // Retina quality
            useCORS: true,
            backgroundColor: null, 
        });

        const link = document.createElement('a');
        link.download = `quote-card-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    } catch (error) {
        console.error("Image generation failed", error);
        alert("Failed to generate image. Please try again.");
    } finally {
        setIsDownloading(false);
    }
  };

  // Template Styles Logic
  const getContainerStyle = () => {
      const baseStyle: React.CSSProperties = {
          backgroundColor: settings.backgroundColor,
          color: settings.textColor,
          fontFamily: 'inherit',
      };

      if (settings.templateId === 'gradient') {
          baseStyle.backgroundImage = `linear-gradient(135deg, ${settings.backgroundColor}, ${settings.accentColor})`;
          baseStyle.backgroundColor = 'transparent';
      }

      return baseStyle;
  };

  const getBaseDimensions = () => {
      switch (settings.aspectRatio) {
          case 'portrait': return { w: 1080, h: 1920, class: 'aspect-[9/16]' };
          case 'landscape': return { w: 1200, h: 628, class: 'aspect-[1.91/1]' };
          case 'square': default: return { w: 1080, h: 1080, class: 'aspect-square' };
      }
  };

  const baseDims = getBaseDimensions();

  return (
    // flex-col-reverse on mobile puts the Preview (2nd child) visually at the top
    <div className="h-auto lg:h-full flex flex-col-reverse lg:flex-row gap-6 animate-fade-in-up pb-10 lg:pb-0">
      
      {/* CONTROLS SIDEBAR */}
      <div className="w-full lg:w-1/3 flex flex-col gap-6 lg:overflow-y-auto no-scrollbar lg:pr-2 shrink-0">
         {/* Text Input */}
         <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
             <div className="flex justify-between items-center mb-2">
                 <label className="text-xs font-black text-slate-800 uppercase">Quote Text</label>
                 <span className={`text-[10px] font-bold ${text.length > 150 ? 'text-red-600' : 'text-slate-600'}`}>
                     {text.length}/150 chars
                 </span>
             </div>
             <textarea 
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full h-24 p-2 text-sm border border-slate-200 rounded-lg resize-none outline-none focus:border-blue-500"
                placeholder="Type your quote here..."
             />
         </div>

         {/* Templates */}
         <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
             <label className="text-xs font-black text-slate-800 uppercase mb-3 block">Template</label>
             <div className="grid grid-cols-3 gap-2">
                 {QUOTE_TEMPLATES.map(t => (
                     <button
                        key={t.id}
                        onClick={() => updateSetting('templateId', t.id)}
                        className={`text-[10px] font-bold py-2 px-1 rounded border-2 transition-all ${
                            settings.templateId === t.id 
                            ? 'border-blue-600 bg-blue-50 text-blue-700' 
                            : 'border-slate-100 bg-slate-50 text-slate-700 hover:border-slate-300'
                        }`}
                     >
                         {t.name}
                     </button>
                 ))}
             </div>
         </div>

         {/* Brand Settings */}
         <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 space-y-4">
             <label className="text-xs font-black text-slate-800 uppercase block flex items-center gap-2">
                 <Icons.Palette className="w-4 h-4" /> Brand Style
             </label>
             
             {/* Colors */}
             <div className="flex gap-4">
                 <div className="flex-1 space-y-1">
                     <span className="text-[10px] font-bold text-slate-500">Background</span>
                     <div className="flex items-center gap-2">
                         <input type="color" value={settings.backgroundColor} onChange={(e) => updateSetting('backgroundColor', e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0 p-0" />
                         <span className="text-[10px] font-mono">{settings.backgroundColor}</span>
                     </div>
                 </div>
                 <div className="flex-1 space-y-1">
                     <span className="text-[10px] font-bold text-slate-500">Text</span>
                     <div className="flex items-center gap-2">
                         <input type="color" value={settings.textColor} onChange={(e) => updateSetting('textColor', e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0 p-0" />
                         <span className="text-[10px] font-mono">{settings.textColor}</span>
                     </div>
                 </div>
                 <div className="flex-1 space-y-1">
                     <span className="text-[10px] font-bold text-slate-500">Accent</span>
                     <div className="flex items-center gap-2">
                         <input type="color" value={settings.accentColor} onChange={(e) => updateSetting('accentColor', e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0 p-0" />
                         <span className="text-[10px] font-mono">{settings.accentColor}</span>
                     </div>
                 </div>
             </div>

             {/* Font & Size */}
             <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1">
                     <span className="text-[10px] font-bold text-slate-500">Font Family</span>
                     <select 
                        value={settings.fontFamily}
                        onChange={(e) => updateSetting('fontFamily', e.target.value)}
                        className="w-full text-xs font-bold p-2 rounded bg-slate-50 border border-slate-200 outline-none text-slate-800"
                     >
                         {QUOTE_FONTS.map(f => (
                             <option key={f.value} value={f.value}>{f.name}</option>
                         ))}
                     </select>
                 </div>
                 <div className="space-y-1">
                     <span className="text-[10px] font-bold text-slate-500">Text Size</span>
                     <input 
                        type="range" min="1" max="4" step="0.1" 
                        value={settings.fontSize}
                        onChange={(e) => updateSetting('fontSize', parseFloat(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                     />
                 </div>
             </div>

             {/* Handle */}
             <div className="space-y-2 pt-2 border-t border-slate-100">
                 <div className="flex items-center gap-2">
                     <input 
                        type="checkbox" 
                        checked={settings.showHandle}
                        onChange={(e) => updateSetting('showHandle', e.target.checked)}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                     />
                     <span className="text-xs font-bold text-slate-700">Show Handle</span>
                 </div>
                 {settings.showHandle && (
                     <input 
                        type="text" 
                        value={settings.handleText}
                        onChange={(e) => updateSetting('handleText', e.target.value)}
                        className="w-full p-2 text-xs border border-slate-200 rounded bg-slate-50 outline-none text-slate-800"
                        placeholder="@username"
                     />
                 )}
             </div>
         </div>
      </div>

      {/* PREVIEW AREA */}
      <div className="w-full lg:w-2/3 flex flex-col gap-4 shrink-0">
         {/* Export Buttons */}
         <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between bg-white p-3 rounded-xl shadow-sm border border-slate-200">
             <div className="flex items-center justify-center gap-2 w-full sm:w-auto">
                 {(['square', 'portrait', 'landscape'] as AspectRatio[]).map(ratio => (
                     <button
                        key={ratio}
                        onClick={() => updateSetting('aspectRatio', ratio)}
                        className={`flex-1 sm:flex-none px-3 py-2 sm:py-1.5 rounded text-[10px] font-bold uppercase tracking-wide border transition-all text-center ${
                            settings.aspectRatio === ratio 
                            ? 'bg-slate-800 text-white border-slate-900' 
                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                        }`}
                     >
                         {ratio}
                     </button>
                 ))}
             </div>
             <button 
                onClick={downloadImage}
                disabled={isDownloading}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 sm:py-2 rounded-lg text-xs font-black uppercase tracking-wide transition-all shadow-md active:scale-95 disabled:opacity-50"
             >
                {isDownloading ? <Icons.Refresh className="w-4 h-4 animate-spin"/> : <Icons.Download className="w-4 h-4" />}
                Download PNG
             </button>
         </div>

         {/* Canvas Wrapper */}
         <div className="flex-grow bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center p-4 lg:p-8 overflow-hidden relative">
             {/* 
                SCALING STRATEGY: 
                We create a wrapper div with explicit width/height matching the SCALED dimensions.
                Then we place the full-size card inside and scale it down from the top-left.
                This ensures the parent container flows correctly and nothing is cut off.
             */}
             <div 
                style={{ 
                    width: baseDims.w * scale, 
                    height: baseDims.h * scale,
                    transition: 'all 0.3s ease'
                }}
                className="relative"
             >
                 <div 
                    ref={cardRef}
                    className={`relative shadow-2xl transition-all duration-300 flex flex-col ${baseDims.class} ${settings.fontFamily}`}
                    style={{ 
                        ...getContainerStyle(),
                        width: baseDims.w,
                        height: baseDims.h,
                        transform: `scale(${scale})`, 
                        transformOrigin: 'top left',
                    }}
                 >
                     {/* Template Logic */}
                     <div className={`flex-grow flex flex-col p-16 relative overflow-hidden
                        ${settings.templateId === 'minimal' ? 'justify-center text-center' : ''}
                        ${settings.templateId === 'bold' ? 'justify-center font-black uppercase tracking-tight' : ''}
                        ${settings.templateId === 'tweet' ? 'bg-white rounded-3xl m-16 shadow-lg p-12 text-black justify-start' : ''}
                        ${settings.templateId === 'carousel' ? 'pt-32 px-16 pb-16 justify-center' : ''}
                     `}
                     style={settings.templateId === 'tweet' ? { color: '#000' } : {}}
                     >  
                        {/* Carousel Header */}
                        {settings.templateId === 'carousel' && (
                            <div className="absolute top-0 left-0 right-0 h-24 bg-black/10 flex items-center px-12 gap-4">
                                <div className="w-12 h-12 rounded-full bg-current opacity-20"></div>
                                <span className="font-bold opacity-60 text-2xl">{settings.handleText}</span>
                            </div>
                        )}

                        {/* Tweet Header */}
                        {settings.templateId === 'tweet' && (
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-16 h-16 rounded-full bg-slate-200"></div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-2xl text-slate-900">Author Name</span>
                                    <span className="text-xl text-slate-500">{settings.handleText}</span>
                                </div>
                            </div>
                        )}

                        {/* Quote Content */}
                        <div className="relative z-10">
                            {settings.templateId !== 'minimal' && settings.templateId !== 'tweet' && (
                                <Icons.Quote 
                                    className="w-24 h-24 mb-6 opacity-20" 
                                    style={{ color: settings.accentColor }} 
                                />
                            )}
                            <h1 
                                style={{ 
                                    fontSize: `${settings.fontSize * 3}rem`, 
                                    lineHeight: 1.2,
                                    color: settings.templateId === 'tweet' ? '#0f172a' : 'inherit'
                                }}
                            >
                                {text || "Your quote goes here..."}
                            </h1>
                        </div>

                        {/* Footer / Handle */}
                        {settings.showHandle && settings.templateId !== 'tweet' && settings.templateId !== 'carousel' && (
                            <div className={`mt-12 flex items-center gap-3 ${settings.templateId === 'minimal' ? 'justify-center' : ''}`}>
                                <div className="h-1 w-12" style={{ backgroundColor: settings.accentColor }}></div>
                                <span className="font-bold text-2xl opacity-80">{settings.handleText}</span>
                            </div>
                        )}
                        
                        {/* Tweet Footer */}
                        {settings.templateId === 'tweet' && (
                            <div className="mt-8 pt-8 border-t border-slate-100 flex justify-between text-slate-500 text-xl font-medium">
                                <span>10:30 AM · Oct 24, 2024</span>
                                <span>Twitter for iPhone</span>
                            </div>
                        )}

                        {/* Carousel Dots */}
                        {settings.templateId === 'carousel' && (
                            <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-current"></div>
                                <div className="w-3 h-3 rounded-full bg-current opacity-30"></div>
                                <div className="w-3 h-3 rounded-full bg-current opacity-30"></div>
                            </div>
                        )}

                     </div>
                 </div>
             </div>
         </div>
         <p className="text-center text-xs text-slate-500 font-medium">
             Preview scaled to fit. Export will be high resolution.
         </p>
      </div>
    </div>
  );
};