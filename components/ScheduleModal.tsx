import React, { useState } from 'react';
import { Icons } from '../constants';
import { IntegrationConfig, IntegrationServiceId } from '../types';

interface ScheduleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (date: number, serviceId?: IntegrationServiceId) => void;
    connectedIntegrations?: IntegrationConfig[];
}

export const ScheduleModal: React.FC<ScheduleModalProps> = ({ 
    isOpen, onClose, onConfirm, connectedIntegrations = [] 
}) => {
    const [date, setDate] = useState('');
    const [target, setTarget] = useState<'local' | IntegrationServiceId>('local');
    const [isPublishing, setIsPublishing] = useState(false);

    if (!isOpen) return null;

    const activeIntegrations = connectedIntegrations.filter(i => i.connected);

    const handleConfirm = async () => {
        if (!date && target === 'local') return;
        
        setIsPublishing(true);
        // Simulate local confirm behavior
        const timestamp = date ? new Date(date + 'T12:00:00').getTime() : Date.now();
        
        // Pass the selection up
        onConfirm(timestamp, target === 'local' ? undefined : target);
        
        // Reset and close (though App handles the close usually)
        setIsPublishing(false);
        setDate('');
        setTarget('local');
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in-up">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-fade-in-up">
                
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                        <Icons.Calendar className="w-5 h-5 text-blue-600" />
                        Publish Post
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                        <Icons.Plus className="w-5 h-5 rotate-45" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Destination Selection */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Select Destination</label>
                        <div className="grid grid-cols-1 gap-2">
                            <button 
                                onClick={() => setTarget('local')}
                                className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all ${target === 'local' ? 'border-blue-600 bg-blue-50' : 'border-slate-100 hover:border-slate-300'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${target === 'local' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                                        <Icons.Calendar className="w-4 h-4" />
                                    </div>
                                    <div className="text-left">
                                        <span className="text-sm font-bold block leading-none">Local Calendar</span>
                                        <span className="text-[10px] text-slate-500 font-medium">Keep it in Social Abundance</span>
                                    </div>
                                </div>
                                {target === 'local' && <Icons.Check className="w-4 h-4 text-blue-600" />}
                            </button>

                            {activeIntegrations.map(integration => {
                                const isSelected = target === integration.id;
                                return (
                                    <button 
                                        key={integration.id}
                                        onClick={() => setTarget(integration.id)}
                                        className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all ${isSelected ? 'border-blue-600 bg-blue-50' : 'border-slate-100 hover:border-slate-300'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                                                {integration.id === 'buffer' && <Icons.Buffer className="w-4 h-4" />}
                                                {integration.id === 'hootsuite' && <Icons.Hootsuite className="w-4 h-4" />}
                                                {integration.id === 'zapier' && <Icons.Zapier className="w-4 h-4" />}
                                                {integration.id === 'make' && <Icons.Make className="w-4 h-4" />}
                                                {integration.id === 'custom_webhook' && <Icons.Send className="w-4 h-4" />}
                                            </div>
                                            <div className="text-left">
                                                <span className="text-sm font-bold block leading-none">{integration.name}</span>
                                                <span className="text-[10px] text-slate-500 font-medium">Send to external queue</span>
                                            </div>
                                        </div>
                                        {isSelected && <Icons.Check className="w-4 h-4 text-blue-600" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    
                    {/* Date Picker (Only if local) */}
                    {target === 'local' && (
                        <div className="space-y-3 animate-fade-in-up">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Scheduled Date</label>
                            <input 
                                type="date" 
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full p-3 bg-slate-50 border-2 border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:border-blue-500"
                            />
                        </div>
                    )}
                </div>

                <div className="p-6 bg-slate-50 flex gap-3">
                    <button 
                        onClick={onClose}
                        className="flex-1 py-3 font-bold text-slate-500 hover:bg-slate-200 rounded-xl transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleConfirm}
                        disabled={isPublishing || (target === 'local' && !date)}
                        className="flex-[2] py-3 font-black text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isPublishing ? (
                            <><Icons.Refresh className="w-4 h-4 animate-spin"/> Sending...</>
                        ) : target === 'local' ? (
                            'Schedule Post'
                        ) : (
                            <>Send to {activeIntegrations.find(i => i.id === target)?.name}</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};