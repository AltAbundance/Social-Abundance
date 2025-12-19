import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Header } from './components/Header';
import { InputSection } from './components/InputSection';
import { PlatformSelector } from './components/PlatformSelector';
import { ToneSettings } from './components/ToneSettings';
import { ResultsSection } from './components/ResultsSection';
import { VoiceTrainer } from './components/VoiceTrainer';
import { ContentLibrary } from './components/ContentLibrary';
import { ViralLab } from './components/ViralLab';
import { ContentDNA } from './components/ContentDNA';
import { AudiencePersonas } from './components/AudiencePersonas';
import { IdeaCompounding } from './components/IdeaCompounding';
import { QuoteGenerator } from './components/QuoteGenerator';
import { TrendHunter } from './components/TrendHunter';
import { ContentCalendar } from './components/ContentCalendar';
import { ScheduleModal } from './components/ScheduleModal';
import { OnboardingTour, TourStep } from './components/OnboardingTour';
import { IntegrationsManager } from './components/IntegrationsManager';
import { AuthModal } from './components/AuthModal';
import { Pricing } from './components/Pricing';
import { UsageTracker } from './components/UsageTracker';
import { StreakTracker } from './components/StreakTracker';
import { UserProvider, useUser } from './contexts/UserContext';
import { Icons, INITIAL_TONE_SETTINGS } from './constants';
import { PlatformId, ToneSettings as ToneSettingsType, GenerationResult, VoiceProfile, SavedContent, AudiencePersona, CalendarEvent, IntegrationConfig, IntegrationServiceId } from './types';
import { generatePlatformContent } from './services/geminiService';
import { publishToService } from './services/integrationService';

type ViewMode = 'generator' | 'voice' | 'library' | 'viral-lab' | 'dna' | 'personas' | 'matrix' | 'visuals' | 'trend-hunter' | 'calendar' | 'integrations' | 'pricing';

const TOUR_STEPS: TourStep[] = [
    {
        title: "The Content Engine",
        description: "This is your main dashboard. Input any raw idea, select your target platforms, and watch as it multiplies into tailored posts in seconds.",
        viewId: 'generator',
        icon: <Icons.Sparkles />
    },
    {
        title: "Trend Hunter",
        description: "Never run out of timely ideas. Scan the web for breaking news in your niche and get instant angles to newsjack trends.",
        viewId: 'trend-hunter',
        icon: <Icons.Radar />
    },
    {
        title: "Viral Lab",
        description: "Don't guess—reverse engineer. Paste a successful post to deconstruct its psychological triggers and get a reusable template.",
        viewId: 'viral-lab',
        icon: <Icons.Lab />
    },
    {
        title: "Idea Matrix",
        description: "The cure for writer's block. Turn a single topic into 20+ unique content angles (contrarian, educational, personal stories, etc.).",
        viewId: 'matrix',
        icon: <Icons.Layers />
    },
    {
        title: "Voice AI",
        description: "Clone yourself. Train the AI on your past writing so every generated post sounds authentically like you, not a robot.",
        viewId: 'voice',
        icon: <Icons.Mic />
    },
    {
        title: "Content Calendar",
        description: "Visualize your abundance. Drag, drop, and organize your content plan to ensure consistency across all channels.",
        viewId: 'calendar',
        icon: <Icons.Calendar />
    }
];

const MainApp: React.FC = () => {
  const { user, loading, isProUser, getRemainingPosts } = useUser();
  const [currentView, setCurrentView] = useState<ViewMode>('generator');
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Show auth modal if user is not logged in
  useEffect(() => {
    if (!loading && !user) {
      setShowAuthModal(true);
    }
  }, [loading, user]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformId[]>([]);
  const [toneSettings, setToneSettings] = useState<ToneSettingsType>(INITIAL_TONE_SETTINGS);
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<GenerationResult[]>([]);
  const [currentQuotables, setCurrentQuotables] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [voiceProfile, setVoiceProfile] = useState<VoiceProfile | null>(null);
  const [savedContent, setSavedContent] = useState<SavedContent[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [streak, setStreak] = useState(0);
  const [personas, setPersonas] = useState<AudiencePersona[]>([]);
  const [activePersonaId, setActivePersonaId] = useState<string | null>(null);
  const [integrations, setIntegrations] = useState<IntegrationConfig[]>([
      { id: 'buffer', name: 'Buffer', connected: false },
      { id: 'hootsuite', name: 'Hootsuite', connected: false },
      { id: 'zapier', name: 'Zapier', connected: false },
      { id: 'make', name: 'Make', connected: false },
      { id: 'custom_webhook', name: 'Custom Webhook', connected: false }
  ]);
  const [quoteText, setQuoteText] = useState('');
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [pendingSchedule, setPendingSchedule] = useState<{content: string, platformId: PlatformId, contentId: string} | null>(null);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [tourStepIndex, setTourStepIndex] = useState(0);

  const resultsRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedVoice = localStorage.getItem('voiceProfile');
    if (savedVoice) setVoiceProfile(JSON.parse(savedVoice));
    const savedLib = localStorage.getItem('contentLibrary');
    if (savedLib) setSavedContent(JSON.parse(savedLib));
    const savedEvents = localStorage.getItem('calendarEvents');
    if (savedEvents) setCalendarEvents(JSON.parse(savedEvents));
    const savedStreak = localStorage.getItem('userStreak');
    if (savedStreak) setStreak(parseInt(savedStreak));
    const savedPersonas = localStorage.getItem('audiencePersonas');
    if (savedPersonas) setPersonas(JSON.parse(savedPersonas));
    const savedIntegrations = localStorage.getItem('integrations');
    if (savedIntegrations) setIntegrations(JSON.parse(savedIntegrations));
    const hasSeenTour = localStorage.getItem('hasSeenTour');
    if (!hasSeenTour) startTour();
  }, []);

  const startTour = () => {
      setIsTourOpen(true);
      setTourStepIndex(0);
      setCurrentView(TOUR_STEPS[0].viewId as ViewMode);
  };

  const handleTourNext = () => {
      const nextIndex = tourStepIndex + 1;
      if (nextIndex < TOUR_STEPS.length) {
          setTourStepIndex(nextIndex);
          setCurrentView(TOUR_STEPS[nextIndex].viewId as ViewMode);
      } else {
          closeTour();
      }
  };

  const handleTourPrev = () => {
      const prevIndex = tourStepIndex - 1;
      if (prevIndex >= 0) {
          setTourStepIndex(prevIndex);
          setCurrentView(TOUR_STEPS[prevIndex].viewId as ViewMode);
      }
  };

  const closeTour = () => {
      setIsTourOpen(false);
      localStorage.setItem('hasSeenTour', 'true');
  };

  const handleSaveVoice = (profile: VoiceProfile) => {
      setVoiceProfile(profile);
      localStorage.setItem('voiceProfile', JSON.stringify(profile));
      setCurrentView('generator');
  };

  const handleUpdateIntegration = (config: IntegrationConfig) => {
      const updated = integrations.map(i => i.id === config.id ? config : i);
      setIntegrations(updated);
      localStorage.setItem('integrations', JSON.stringify(updated));
  };

  const handleDeleteContent = (id: string) => {
      const newContent = savedContent.filter(c => c.id !== id);
      setSavedContent(newContent);
      localStorage.setItem('contentLibrary', JSON.stringify(newContent));
  };

  const handleAddPersona = (persona: AudiencePersona) => {
      const updated = [...personas, persona];
      setPersonas(updated);
      localStorage.setItem('audiencePersonas', JSON.stringify(updated));
  };

  const handleDeletePersona = (id: string) => {
      const updated = personas.filter(p => p.id !== id);
      setPersonas(updated);
      localStorage.setItem('audiencePersonas', JSON.stringify(updated));
      if (activePersonaId === id) setActivePersonaId(null);
  };

  const handleAddCalendarEvent = (event: CalendarEvent) => {
      const updated = [...calendarEvents, event];
      setCalendarEvents(updated);
      localStorage.setItem('calendarEvents', JSON.stringify(updated));
  };

  const handleRemoveCalendarEvent = (id: string) => {
      const updated = calendarEvents.filter(e => e.id !== id);
      setCalendarEvents(updated);
      localStorage.setItem('calendarEvents', JSON.stringify(updated));
  };

  const handleOpenSchedule = (content: string, platformId: PlatformId, contentId?: string) => {
      const id = contentId || savedContent[0]?.id;
      if (!id) {
          alert("Please save content first or generate something new.");
          return;
      }
      setPendingSchedule({ content, platformId, contentId: id });
      setIsScheduleModalOpen(true);
  };

  const handleConfirmPublish = async (date: number, serviceId?: IntegrationServiceId) => {
      if (!pendingSchedule) return;
      if (!serviceId) {
          const newEvent: CalendarEvent = {
              id: Date.now().toString(),
              date,
              contentId: pendingSchedule.contentId,
              platformId: pendingSchedule.platformId,
              contentSnippet: pendingSchedule.content
          };
          handleAddCalendarEvent(newEvent);
          alert("Added to Content Pipeline!");
      } else {
          const integration = integrations.find(i => i.id === serviceId);
          const result = await publishToService(serviceId, pendingSchedule.content, pendingSchedule.platformId, date, integration?.webhookUrl);
          if (result.success) alert(result.message);
      }
      setIsScheduleModalOpen(false);
      setPendingSchedule(null);
  };

  const handlePlatformToggle = (id: PlatformId) => {
    setSelectedPlatforms(prev => {
      const isSelecting = !prev.includes(id);
      const next = isSelecting ? [...prev, id] : prev.filter(p => p !== id);
      if (isSelecting && window.innerWidth < 1024 && settingsRef.current) {
          settingsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      return next;
    });
  };

  const incrementStreak = () => {
      const lastGenDate = localStorage.getItem('lastGenDate');
      const today = new Date().toDateString();
      if (lastGenDate !== today) {
          const newStreak = streak + 1;
          setStreak(newStreak);
          localStorage.setItem('userStreak', newStreak.toString());
          localStorage.setItem('lastGenDate', today);
      }
  };

  const handleOpenQuoteModal = (text: string) => {
      setQuoteText(text);
      setCurrentView('visuals');
  };

  const handleUseTrend = (text: string) => {
      setInputText(text);
      setCurrentView('generator');
  };

  const handleGenerate = useCallback(async (isSurprise: boolean = false) => {
    if (!inputText.trim()) {
      setError('Please enter some content first.');
      return;
    }
    if (selectedPlatforms.length === 0) {
      setError('Select at least one platform.');
      return;
    }
    setError(null);
    setIsGenerating(true);
    try {
      const activePersona = personas.find(p => p.id === activePersonaId);
      const response = await generatePlatformContent(inputText, selectedPlatforms, toneSettings, voiceProfile || undefined, isSurprise, activePersona);
      setResults(response.results);
      setCurrentQuotables(response.quotables || []);
      incrementStreak();
      const newItem: SavedContent = {
          id: Date.now().toString(),
          date: Date.now(),
          sourcePreview: inputText.substring(0, 50),
          results: response.results,
          quotables: response.quotables,
          tags: selectedPlatforms
      };
      const updatedLibrary = [newItem, ...savedContent];
      setSavedContent(updatedLibrary);
      localStorage.setItem('contentLibrary', JSON.stringify(updatedLibrary));
      if (window.innerWidth < 1024 && resultsRef.current) {
         setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  }, [inputText, selectedPlatforms, toneSettings, voiceProfile, savedContent, streak, activePersonaId, personas]);

  const NAV_SECTIONS = [
    {
        category: "Ideation & Trends",
        items: [
            { id: 'trend-hunter', label: 'Trend Hunter', icon: <Icons.Radar />, desc: "Find viral news" },
            { id: 'viral-lab', label: 'Viral Lab', icon: <Icons.Lab />, desc: "Analyze viral hits" },
            { id: 'matrix', label: 'Idea Matrix', icon: <Icons.Layers />, desc: "Multiply topics" },
        ]
    },
    {
        category: "Creation Studio",
        items: [
            { id: 'generator', label: 'Generator', icon: <Icons.Sparkles />, desc: "Write content" },
            { id: 'visuals', label: 'Visuals', icon: <Icons.Image />, desc: "Create graphics" },
            { id: 'voice', label: 'Voice AI', icon: <Icons.Mic />, desc: "Clone style" },
        ]
    },
    {
        category: "Publishing",
        items: [
            { id: 'calendar', label: 'Calendar', icon: <Icons.Calendar />, desc: "Visual schedule" },
            { id: 'integrations', label: 'Integrations', icon: <Icons.Grid />, desc: "Buffer, Zapier, etc" },
            { id: 'library', label: 'Library', icon: <Icons.Archive />, desc: "Saved drafts" },
        ]
    },
    {
        category: "Strategy",
        items: [
            { id: 'personas', label: 'Personas', icon: <Icons.Users />, desc: "Audience profiles" },
            { id: 'dna', label: 'Style Audit', icon: <Icons.DNA />, desc: "Style DNA" },
        ]
    },
    {
        category: "Account",
        items: [
            { id: 'pricing', label: 'Pricing', icon: <Icons.Trophy />, desc: "Upgrade to Pro" },
        ]
    }
  ];

  const PRIMARY_NAV_IDS = ['generator', 'library', 'calendar', 'viral-lab'];

  const renderContent = () => {
      if (currentView === 'pricing') return <Pricing />;
      if (currentView === 'voice') return <VoiceTrainer onSaveProfile={handleSaveVoice} existingProfile={voiceProfile} />;
      if (currentView === 'library') return <ContentLibrary savedContent={savedContent} onDelete={handleDeleteContent} onMakeGraphic={handleOpenQuoteModal} onSchedule={handleOpenSchedule} />;
      if (currentView === 'viral-lab') return <ViralLab />;
      if (currentView === 'dna') return <ContentDNA />;
      if (currentView === 'integrations') return <IntegrationsManager integrations={integrations} onUpdateIntegration={handleUpdateIntegration} />;
      if (currentView === 'personas') return <AudiencePersonas personas={personas} onAddPersona={handleAddPersona} onDeletePersona={handleDeletePersona} activePersonaId={activePersonaId} onSetActivePersona={setActivePersonaId} />;
      if (currentView === 'matrix') return <IdeaCompounding />;
      if (currentView === 'visuals') return <QuoteGenerator initialText={quoteText} />;
      if (currentView === 'trend-hunter') return <TrendHunter onUseIdea={handleUseTrend} />;
      if (currentView === 'calendar') return <ContentCalendar savedContent={savedContent} events={calendarEvents} onAddEvent={handleAddCalendarEvent} onRemoveEvent={handleRemoveCalendarEvent} />;

      return (
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 lg:h-full">
            <div className="lg:col-span-5 flex flex-col gap-6 lg:h-full lg:overflow-y-auto pb-32 lg:pb-6 no-scrollbar">
                <div className="lg:hidden"><h2 className="text-2xl font-black text-slate-900 leading-tight tracking-tight uppercase">Content <span className="text-blue-600">Multiplier.</span></h2></div>
                <div className="flex-grow lg:flex-shrink-0 lg:min-h-[200px]"><InputSection value={inputText} onChange={setInputText} onClear={() => setInputText('')} voiceActive={!!voiceProfile} activePersona={personas.find(p => p.id === activePersonaId)} /></div>
                <PlatformSelector selectedPlatforms={selectedPlatforms} onToggle={handlePlatformToggle} />
                <div ref={settingsRef}><ToneSettings settings={toneSettings} onChange={setToneSettings} /></div>
                {error && <div className="bg-red-50 text-red-900 text-sm font-bold p-4 rounded-xl border-2 border-red-200 flex items-center gap-3 animate-pulse shadow-sm"><Icons.Sparkles className="w-5 h-5 rotate-45" />{error}</div>}
                <div className="hidden lg:flex gap-4">
                     <button onClick={() => handleGenerate(true)} disabled={isGenerating} className="flex-1 px-4 py-3 rounded-xl bg-emerald-50 text-emerald-700 border-2 border-emerald-200 font-black uppercase text-xs tracking-wide hover:bg-emerald-100 transition-colors flex items-center justify-center gap-2"><Icons.Lightning className="w-4 h-4" /> Surprise Me</button>
                    <button onClick={() => handleGenerate(false)} disabled={isGenerating} className="flex-[2] px-6 py-3 rounded-xl bg-blue-600 text-white font-black uppercase text-xs tracking-wide shadow-lg shadow-blue-200 hover:bg-blue-700 hover:scale-[1.02] transition-all flex items-center justify-center gap-2">{isGenerating ? <Icons.Refresh className="w-4 h-4 animate-spin"/> : <Icons.Sparkles className="w-4 h-4" />}Generate Content</button>
                </div>
                <div className="lg:hidden grid grid-cols-[auto_1fr] gap-3 pt-2">
                     <button onClick={() => handleGenerate(true)} disabled={isGenerating} className="px-2 rounded-xl bg-emerald-400 text-emerald-900 border-b-4 border-emerald-600 active:border-b-0 active:translate-y-1 transition-all flex flex-col items-center justify-center gap-0.5 min-w-[80px]" title="Surprise Me!"><Icons.Lightning className="w-5 h-5" /><span className="text-[9px] font-black uppercase leading-none text-center">Surprise<br/>Me!</span></button>
                    <button onClick={() => handleGenerate(false)} disabled={isGenerating} className={`flex items-center justify-center gap-2 h-14 rounded-xl font-black text-white text-lg shadow-xl shadow-blue-500/25 transition-all transform active:scale-95 border-b-4 ${isGenerating ? 'bg-slate-800 border-slate-900 cursor-wait' : 'bg-blue-600 border-blue-800 hover:bg-blue-500 hover:border-blue-700'}`}>{isGenerating ? <><Icons.Refresh className="w-5 h-5 animate-spin" /><span className="text-base uppercase">Working...</span></> : <><Icons.Sparkles className="w-6 h-6" /><span className="uppercase">GENERATE</span></>}</button>
                </div>
            </div>
            <div className="lg:col-span-7 hidden lg:flex flex-col h-full overflow-hidden pb-6">
                {results.length > 0 ? (
                    <div className="h-full overflow-y-auto no-scrollbar"><ResultsSection results={results} quotables={currentQuotables} onMakeGraphic={handleOpenQuoteModal} onSchedule={handleOpenSchedule} /></div>
                ) : (
                   <div className="h-full border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-600 gap-5 bg-white shadow-sm"><div className="p-5 bg-slate-50 rounded-full shadow-inner border border-slate-200"><Icons.Sparkles className="w-10 h-10 text-slate-300" /></div><div className="text-center space-y-1"><p className="font-black text-lg text-slate-900 uppercase tracking-tight">Abundance Starts Here.</p><p className="text-sm text-slate-700 font-bold uppercase tracking-wider opacity-60">Select platforms and hit generate</p></div></div>
                )}
            </div>
            <div ref={resultsRef} className="lg:hidden pb-28">{results.length > 0 && <ResultsSection results={results} quotables={currentQuotables} onMakeGraphic={handleOpenQuoteModal} onSchedule={handleOpenSchedule} />}</div>
        </div>
      );
  };

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Icons.Sparkles className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-lg font-bold text-slate-700">Loading...</p>
        </div>
      </div>
    );
  }

  // Show minimal UI with auth modal if not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-200 selection:text-blue-900 flex flex-col">
        <Header 
          streak={0} 
          onShowAuth={() => setShowAuthModal(true)}
          onShowPricing={() => setShowAuthModal(true)}
        />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center max-w-2xl">
            <Icons.MultiplierLogo className="w-20 h-20 text-blue-600 mx-auto mb-6" />
            <h1 className="text-4xl font-black mb-4">Welcome to Social Abundance</h1>
            <p className="text-xl text-slate-600 mb-8">
              Create unlimited viral content for all your social media platforms with AI. 
              Sign in to start your free trial.
            </p>
            <button
              onClick={() => setShowAuthModal(true)}
              className="px-8 py-4 bg-blue-600 text-white font-bold rounded-lg text-lg hover:bg-blue-700 transition-colors"
            >
              Get Started Free
            </button>
          </div>
        </div>
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => {}} 
          onSuccess={() => setShowAuthModal(false)} 
          forceLogin={true}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-200 selection:text-blue-900 flex flex-col">
        <Header 
            streak={streak} 
            onStartTour={startTour} 
            onShowAuth={() => setShowAuthModal(true)}
            onShowPricing={() => setCurrentView('pricing')}
        />
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 pb-safe shadow-2xl">
            <div className="grid grid-cols-5 h-16">
                <button onClick={() => { setCurrentView('generator'); setIsMobileMenuOpen(false); }} className={`flex flex-col items-center justify-center gap-1 transition-colors border-t-2 ${currentView === 'generator' && !isMobileMenuOpen ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-transparent text-slate-600'}`}><Icons.Sparkles className="w-5 h-5" /><span className="text-[9px] font-black uppercase tracking-tighter">Create</span></button>
                 <button onClick={() => { setCurrentView('library'); setIsMobileMenuOpen(false); }} className={`flex flex-col items-center justify-center gap-1 transition-colors border-t-2 ${currentView === 'library' && !isMobileMenuOpen ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-transparent text-slate-600'}`}><Icons.Archive className="w-5 h-5" /><span className="text-[9px] font-black uppercase tracking-tighter">Saved</span></button>
                 <button onClick={() => { setCurrentView('calendar'); setIsMobileMenuOpen(false); }} className={`flex flex-col items-center justify-center gap-1 transition-colors border-t-2 ${currentView === 'calendar' && !isMobileMenuOpen ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-transparent text-slate-600'}`}><Icons.Calendar className="w-5 h-5" /><span className="text-[9px] font-black uppercase tracking-tighter">Plan</span></button>
                <button onClick={() => { setCurrentView('viral-lab'); setIsMobileMenuOpen(false); }} className={`flex flex-col items-center justify-center gap-1 transition-colors border-t-2 ${currentView === 'viral-lab' && !isMobileMenuOpen ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-transparent text-slate-600'}`}><Icons.Lab className="w-5 h-5" /><span className="text-[9px] font-black uppercase tracking-tighter">Viral</span></button>
                 <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className={`flex flex-col items-center justify-center gap-1 transition-colors border-t-2 ${isMobileMenuOpen || !PRIMARY_NAV_IDS.includes(currentView) ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-transparent text-slate-600'}`}><Icons.Grid className="w-5 h-5" /><span className="text-[9px] font-black uppercase tracking-tighter">Apps</span></button>
            </div>
        </div>
        {isMobileMenuOpen && (
            <div className="fixed inset-0 z-40 bg-slate-950/95 backdrop-blur-xl lg:hidden flex flex-col pt-20 px-6 pb-32 overflow-y-auto animate-fade-in-up">
                 <div className="flex justify-between items-center mb-8"><div><h2 className="text-2xl font-black text-white uppercase tracking-tight">App Studio</h2><p className="text-slate-400 text-sm font-bold uppercase tracking-widest opacity-60">Select a tool to launch</p></div><button onClick={() => setIsMobileMenuOpen(false)} className="p-3 bg-slate-800 rounded-full text-slate-400 hover:text-white border border-slate-700 shadow-xl"><Icons.Plus className="w-6 h-6 rotate-45" /></button></div>
                 <div className="space-y-10">
                     {NAV_SECTIONS.map((section, idx) => (
                         <div key={idx} className="space-y-4">
                             <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1 border-l-4 border-blue-600 pl-3">{section.category}</h3>
                             <div className="grid grid-cols-2 gap-3">
                                 {section.items.map(item => (
                                     <button key={item.id} onClick={() => { setCurrentView(item.id as ViewMode); setIsMobileMenuOpen(false); }} className={`flex flex-col items-start gap-3 p-4 rounded-2xl border-2 transition-all text-left relative overflow-hidden group ${currentView === item.id ? 'bg-blue-600 border-blue-400 text-white shadow-2xl shadow-blue-900/40' : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700'}`}><div className={`p-2 rounded-lg ${currentView === item.id ? 'bg-white/20 text-white' : 'bg-slate-950 text-blue-400 group-hover:text-blue-300'}`}>{React.cloneElement(item.icon as React.ReactElement, { className: 'w-6 h-6' })}</div><div><span className="text-sm font-black block mb-0.5 uppercase">{item.label}</span><span className={`text-[9px] font-bold block leading-tight ${currentView === item.id ? 'text-blue-100' : 'text-slate-500'}`}>{item.desc}</span></div></button>
                                 ))}
                             </div>
                         </div>
                     ))}
                 </div>
             </div>
        )}
        <div className="flex-grow max-w-[1600px] mx-auto w-full px-3 sm:px-4 py-4 lg:py-6 flex gap-6 min-h-0 h-auto lg:h-[calc(100vh-64px)] lg:overflow-hidden">
            <aside className="hidden lg:flex flex-col gap-6 w-64 shrink-0 overflow-y-auto no-scrollbar pb-10">
                {NAV_SECTIONS.map((section, idx) => (
                    <div key={idx} className="space-y-2">
                        <div className="px-3 text-[10px] font-black text-slate-600 uppercase tracking-widest">{section.category}</div>
                        {section.items.map(item => (
                             <button key={item.id} onClick={() => setCurrentView(item.id as ViewMode)} className={`w-full flex items-start gap-3 px-4 py-3 rounded-xl transition-all border-2 group ${currentView === item.id ? 'bg-blue-600 text-white shadow-md shadow-blue-200 border-blue-400' : 'bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-transparent hover:border-slate-200'}`}><div className={`mt-0.5 ${currentView === item.id ? 'text-white' : 'text-slate-600 group-hover:text-blue-500'}`}>{React.cloneElement(item.icon as React.ReactElement, { className: 'w-5 h-5' })}</div><div className="flex flex-col items-start"><span className="text-sm font-black uppercase tracking-tight">{item.label}</span><span className={`text-[10px] font-bold leading-tight ${currentView === item.id ? 'text-blue-100' : 'text-slate-500'}`}>{item.desc}</span></div></button>
                        ))}
                    </div>
                ))}
            </aside>
            <main className="flex-grow min-h-0 h-auto lg:h-full bg-white/50 rounded-2xl border-2 border-slate-300 p-2 sm:p-4 lg:p-6 relative shadow-sm overflow-visible lg:overflow-hidden">{renderContent()}</main>
        </div>
        <ScheduleModal 
            isOpen={isScheduleModalOpen} 
            onClose={() => setIsScheduleModalOpen(false)} 
            onConfirm={handleConfirmPublish} 
            connectedIntegrations={integrations}
        />
        <OnboardingTour isOpen={isTourOpen} stepIndex={tourStepIndex} steps={TOUR_STEPS} onNext={handleTourNext} onPrev={handleTourPrev} onClose={closeTour} />
        <AuthModal 
            isOpen={showAuthModal} 
            onClose={() => setShowAuthModal(false)} 
            onSuccess={() => setShowAuthModal(false)} 
        />
        <UsageTracker />
        {user && !isProUser() && <StreakTracker />}
    </div>
 );
};

export const App: React.FC = () => {
  return (
    <UserProvider>
      <MainApp />
    </UserProvider>
  );
};