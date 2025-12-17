import React, { useState } from 'react';
import { Icons, PLATFORMS } from '../constants';
import { SavedContent, CalendarEvent, PlatformId } from '../types';

interface ContentCalendarProps {
    savedContent: SavedContent[];
    events: CalendarEvent[];
    onAddEvent: (event: CalendarEvent) => void;
    onRemoveEvent: (id: string) => void;
}

export const ContentCalendar: React.FC<ContentCalendarProps> = ({ savedContent, events, onAddEvent, onRemoveEvent }) => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEmailing, setIsEmailing] = useState(false);
    const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
    
    // Current focus date (defaults to today)
    const [currentDate, setCurrentDate] = useState(new Date());

    // Helper to get start of week (Monday)
    const getStartOfWeek = (date: Date) => {
        const d = new Date(date);
        const day = d.getDay(); // 0 is Sunday
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
        return new Date(d.setDate(diff));
    };

    // Week View Logic
    const getWeekDays = () => {
        const startOfWeek = getStartOfWeek(currentDate);
        const days = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(startOfWeek);
            d.setDate(startOfWeek.getDate() + i);
            days.push(d);
        }
        return days;
    };

    // Month View Logic
    const getMonthDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 Sun, 1 Mon...
        
        // Calculate empty slots for Monday start
        // Mon(1)=>0, Tue(2)=>1... Sun(0)=>6
        const startOffset = (firstDayOfMonth + 6) % 7;

        const days: (Date | null)[] = [];
        for (let i = 0; i < startOffset; i++) days.push(null);
        for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));
        
        return days;
    };

    const handlePrev = () => {
        const d = new Date(currentDate);
        if (viewMode === 'week') d.setDate(d.getDate() - 7);
        else d.setMonth(d.getMonth() - 1);
        setCurrentDate(d);
    };

    const handleNext = () => {
        const d = new Date(currentDate);
        if (viewMode === 'week') d.setDate(d.getDate() + 7);
        else d.setMonth(d.getMonth() + 1);
        setCurrentDate(d);
    };

    const handleDayClick = (date: Date) => {
        setSelectedDate(date);
        setIsModalOpen(true);
    };

    const handleQuickSchedule = () => {
        setSelectedDate(new Date()); // Default to today
        setIsModalOpen(true);
    };

    const handleScheduleContent = (content: SavedContent, resultIndex: number) => {
        if (!selectedDate) return;
        
        const result = content.results[resultIndex];
        const newEvent: CalendarEvent = {
            id: Date.now().toString(),
            date: selectedDate.getTime(),
            contentId: content.id,
            platformId: result.platformId,
            contentSnippet: result.content
        };
        
        onAddEvent(newEvent);
        setIsModalOpen(false);
    };

    const handleSyncToEmail = async () => {
        setIsEmailing(true);
        // Simulate network call
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsEmailing(false);
        alert(`Schedule synced! check your email.`);
    };

    const getEventsForDay = (date: Date) => {
        return events.filter(e => {
            const eDate = new Date(e.date);
            return eDate.getDate() === date.getDate() && 
                   eDate.getMonth() === date.getMonth() && 
                   eDate.getFullYear() === date.getFullYear();
        });
    };

    const weekDays = getWeekDays();
    const monthDays = getMonthDays();
    const displayDate = viewMode === 'week' ? weekDays[0] : currentDate;

    return (
        <div className="h-full flex flex-col gap-2 sm:gap-6 animate-fade-in-up pb-32 lg:pb-0 no-scrollbar overflow-y-auto lg:overflow-hidden">
             {/* High Contrast Header */}
             <div className="bg-slate-950 text-white p-3 sm:p-8 rounded-xl shadow-xl relative overflow-hidden flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2 sm:gap-4 border border-white/10">
                <div className="relative z-10 flex items-center justify-between sm:block">
                    <h2 className="text-[12px] sm:text-2xl font-black uppercase tracking-tight flex items-center gap-2">
                        <Icons.Calendar className="w-4 h-4 sm:w-8 sm:h-8 text-blue-400" />
                        <span className="text-white">Content Pipeline</span>
                    </h2>
                    <Icons.Calendar className="sm:hidden w-4 h-4 text-white opacity-20" />
                    <p className="hidden sm:block text-slate-400 text-sm font-bold leading-relaxed max-w-lg mt-1 uppercase tracking-wider">
                        Visualize and deploy your social strategy.
                    </p>
                </div>
                
                <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-row relative z-10">
                    <button 
                        onClick={handleQuickSchedule}
                        className="bg-blue-600 text-white px-3 py-2 sm:px-6 sm:py-3 rounded-lg font-black text-[10px] sm:text-sm shadow-xl flex items-center justify-center gap-1.5 transition-all active:scale-95 hover:bg-blue-500 whitespace-nowrap border-b-4 border-blue-800"
                    >
                        <Icons.Plus className="w-3 h-3 sm:w-5 sm:h-5"/>
                        <span>SCHEDULE</span>
                    </button>
                    <button 
                        onClick={handleSyncToEmail}
                        disabled={isEmailing}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 sm:px-6 sm:py-3 rounded-lg font-black text-[10px] sm:text-sm shadow-xl flex items-center justify-center gap-1.5 transition-all active:scale-95 border-b-4 border-emerald-800 disabled:opacity-50 whitespace-nowrap"
                    >
                        {isEmailing ? <Icons.Refresh className="w-3 h-3 sm:w-5 sm:h-5 animate-spin"/> : <Icons.Send className="w-3 h-3 sm:w-5 sm:h-5"/>}
                        <span>{isEmailing ? 'SYNCING' : 'SYNC CALENDAR'}</span>
                    </button>
                </div>
            </div>

            <div className="flex-grow flex flex-col bg-white rounded-xl shadow-lg border-2 border-slate-300 overflow-hidden min-h-0">
                {/* High Contrast Navigation */}
                <div className="p-2 sm:p-5 border-b-2 border-slate-300 flex justify-between items-center bg-slate-100 gap-2">
                    <div className="flex items-center gap-3">
                        <div className="flex gap-1">
                            <button onClick={handlePrev} className="p-1.5 sm:p-2.5 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg text-slate-900 shadow-sm transition-all active:translate-y-px">
                                <Icons.ChevronDown className="w-4 h-4 sm:w-6 sm:h-6 rotate-90" />
                            </button>
                            <button onClick={handleNext} className="p-1.5 sm:p-2.5 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg text-slate-900 shadow-sm transition-all active:translate-y-px">
                                <Icons.ChevronDown className="w-4 h-4 sm:w-6 sm:h-6 -rotate-90" />
                            </button>
                        </div>
                        <span className="font-black text-slate-950 uppercase tracking-widest text-[11px] sm:text-base">
                            {displayDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </span>
                    </div>

                    <div className="flex bg-slate-300 p-1 rounded-xl shadow-inner">
                        <button 
                            onClick={() => setViewMode('week')}
                            className={`px-3 py-1.5 sm:px-5 sm:py-2 text-[10px] sm:text-xs font-black uppercase rounded-lg transition-all ${viewMode === 'week' ? 'bg-white text-blue-700 shadow-md ring-1 ring-slate-400/20' : 'text-slate-700 hover:text-slate-900'}`}
                        >
                            Week
                        </button>
                        <button 
                            onClick={() => setViewMode('month')}
                            className={`px-3 py-1.5 sm:px-5 sm:py-2 text-[10px] sm:text-xs font-black uppercase rounded-lg transition-all ${viewMode === 'month' ? 'bg-white text-blue-700 shadow-md ring-1 ring-slate-400/20' : 'text-slate-700 hover:text-slate-900'}`}
                        >
                            Month
                        </button>
                    </div>
                </div>

                {/* Grid Content */}
                <div className="flex-grow overflow-y-auto no-scrollbar">
                    {viewMode === 'week' ? (
                        <div className="grid grid-cols-1 md:grid-cols-7 h-full min-h-[500px] divide-y-2 md:divide-y-0 md:divide-x-2 divide-slate-300">
                            {weekDays.map((date, idx) => {
                                const isToday = new Date().toDateString() === date.toDateString();
                                const dayEvents = getEventsForDay(date);
                                
                                return (
                                    <div key={idx} className={`flex flex-col min-h-[100px] md:h-full ${isToday ? 'bg-blue-100/40' : 'bg-white'}`}>
                                        <div className="p-2.5 border-b-2 border-slate-100 flex justify-between items-center bg-slate-50/50">
                                            <div className="flex items-center gap-2">
                                                <span className={`text-[10px] font-black uppercase tracking-tighter ${isToday ? 'text-blue-700' : 'text-slate-500'}`}>
                                                    {date.toLocaleDateString('en-US', { weekday: 'short' })}
                                                </span>
                                                <span className={`text-sm sm:text-lg font-black ${isToday ? 'text-blue-700' : 'text-slate-950'}`}>
                                                    {date.getDate()}
                                                </span>
                                            </div>
                                            <button 
                                                onClick={() => handleDayClick(date)}
                                                className="w-6 h-6 flex items-center justify-center rounded-lg bg-white border border-slate-200 shadow-sm hover:border-blue-500 hover:text-blue-600 transition-colors"
                                            >
                                                <Icons.Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="flex-grow p-2 space-y-2">
                                            {dayEvents.map(event => {
                                                const platform = PLATFORMS.find(p => p.id === event.platformId);
                                                return (
                                                    <div key={event.id} className="group relative bg-white border-2 border-slate-200 rounded-xl p-2 shadow-sm hover:shadow-md hover:border-blue-300 transition-all">
                                                        <div className="flex items-center gap-2 mb-1.5">
                                                            <div className="w-3.5 h-3.5 text-blue-700 drop-shadow-sm">{platform?.icon}</div>
                                                            <span className="text-[9px] font-black text-slate-700 uppercase tracking-wide truncate">{platform?.name}</span>
                                                        </div>
                                                        <p className="text-[11px] text-slate-900 line-clamp-2 font-bold leading-tight">{event.contentSnippet}</p>
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); onRemoveEvent(event.id); }}
                                                            className="absolute top-1 right-1 p-1 bg-white rounded-full shadow-sm text-slate-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <Icons.Trash className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col">
                            <div className="grid grid-cols-7 border-b-2 border-slate-300 bg-slate-200">
                                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                                    <div key={i} className="p-2 text-center text-[10px] font-black text-slate-700 uppercase tracking-widest">{day}</div>
                                ))}
                            </div>
                            <div className="grid grid-cols-7 auto-rows-fr flex-grow bg-slate-300 gap-[2px] border-b-2 border-slate-300">
                                {monthDays.map((date, idx) => {
                                    if (!date) return <div key={idx} className="bg-slate-100/50" />;
                                    const isToday = new Date().toDateString() === date.toDateString();
                                    const dayEvents = getEventsForDay(date);
                                    return (
                                        <div 
                                            key={idx} 
                                            className={`bg-white min-h-[70px] flex flex-col p-1 cursor-pointer hover:bg-slate-50 transition-colors relative overflow-hidden ${isToday ? 'bg-blue-50/50 ring-2 ring-inset ring-blue-500/30' : ''}`} 
                                            onClick={() => handleDayClick(date)}
                                        >
                                            <div className="flex justify-between items-start mb-1 px-1">
                                                <span className={`text-[11px] font-black rounded-full w-5 h-5 flex items-center justify-center ${isToday ? 'bg-blue-600 text-white shadow-md' : 'text-slate-950'}`}>
                                                    {date.getDate()}
                                                </span>
                                            </div>
                                            {/* Icons for month view content */}
                                            <div className="flex flex-wrap gap-1 px-1">
                                                {dayEvents.slice(0, 4).map(event => {
                                                    const p = PLATFORMS.find(pl => pl.id === event.platformId);
                                                    return (
                                                        <div key={event.id} className="w-3.5 h-3.5 text-blue-700 bg-slate-100 rounded p-[2px] shadow-sm flex items-center justify-center" title={p?.name}>
                                                            {p?.icon}
                                                        </div>
                                                    )
                                                })}
                                                {dayEvents.length > 4 && (
                                                    <span className="text-[8px] font-black text-slate-500">+{dayEvents.length - 4}</span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* High Contrast Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
                    <div className="bg-white w-full max-w-2xl max-h-[85vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-fade-in-up border-4 border-white/20">
                        <div className="p-5 border-b-2 border-slate-200 flex justify-between items-center bg-slate-50">
                            <div>
                                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block mb-0.5">Scheduling For</span>
                                <h3 className="font-black text-slate-950 uppercase tracking-tight text-sm sm:text-lg">
                                    {selectedDate?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                                </h3>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-black text-[11px] uppercase px-4 py-2 rounded-xl transition-all">Close</button>
                        </div>
                        <div className="flex-grow overflow-y-auto p-5 space-y-6 no-scrollbar">
                            {savedContent.length === 0 ? (
                                <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300">
                                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                                        <Icons.Archive className="w-8 h-8 text-slate-300" />
                                    </div>
                                    <p className="text-base font-black text-slate-900 uppercase tracking-tight">Your Library is Empty</p>
                                    <p className="text-sm font-bold text-slate-500 max-w-xs mx-auto mt-2">Generate content in the Studio to start building your pipeline.</p>
                                </div>
                            ) : (
                                savedContent.map(item => (
                                    <div key={item.id} className="bg-white border-2 border-slate-300 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                        <div className="bg-slate-100 p-3 border-b-2 border-slate-200 flex justify-between items-center">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <div className="bg-white p-1.5 rounded-lg shadow-sm">
                                                    <Icons.Sparkles className="w-4 h-4 text-blue-600" />
                                                </div>
                                                <span className="text-xs font-black text-slate-950 uppercase truncate max-w-[200px]">{item.sourcePreview}</span>
                                            </div>
                                            <span className="text-[10px] font-black text-slate-500 whitespace-nowrap">{new Date(item.date).toLocaleDateString()}</span>
                                        </div>
                                        <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {item.results.map((res, idx) => {
                                                const p = PLATFORMS.find(pl => pl.id === res.platformId);
                                                return (
                                                    <button 
                                                        key={idx}
                                                        onClick={() => handleScheduleContent(item, idx)}
                                                        className="flex items-start gap-3 p-3 rounded-xl hover:bg-blue-50 border-2 border-slate-100 hover:border-blue-300 text-left transition-all group"
                                                    >
                                                        <div className="mt-0.5 text-blue-700 group-hover:scale-110 transition-transform shrink-0 drop-shadow-sm">{p?.icon}</div>
                                                        <div className="min-w-0">
                                                            <span className="text-[10px] font-black text-slate-500 block uppercase tracking-wide group-hover:text-blue-700">{p?.name}</span>
                                                            <p className="text-xs text-slate-900 line-clamp-2 font-bold leading-tight">{res.content}</p>
                                                        </div>
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};