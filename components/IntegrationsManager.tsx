import React, { useState } from 'react';
import { Icons } from '../constants';
import { IntegrationServiceId, IntegrationConfig } from '../types';
import { simulateOAuth } from '../services/integrationService';

interface IntegrationsManagerProps {
    integrations: IntegrationConfig[];
    onUpdateIntegration: (config: IntegrationConfig) => void;
}

export const IntegrationsManager: React.FC<IntegrationsManagerProps> = ({ integrations, onUpdateIntegration }) => {
    const [isConnecting, setIsConnecting] = useState<IntegrationServiceId | null>(null);

    const handleToggleConnection = async (id: IntegrationServiceId) => {
        const current = integrations.find(i => i.id === id);
        if (current?.connected) {
            // Disconnect
            onUpdateIntegration({ ...current, connected: false });
        } else {
            // Connect
            setIsConnecting(id);
            const success = await simulateOAuth(id);
            if (success) {
                onUpdateIntegration({ id, name: id.charAt(0).toUpperCase() + id.slice(1), connected: true });
            }
            setIsConnecting(null);
        }
    };

    const handleWebhookUpdate = (id: IntegrationServiceId, url: string) => {
        const current = integrations.find(i => i.id === id) || { id, name: 'Custom Webhook', connected: false };
        onUpdateIntegration({ ...current, webhookUrl: url, connected: !!url });
    };

    const SERVICE_CARDS = [
        { 
            id: 'buffer' as IntegrationServiceId, 
            name: 'Buffer', 
            icon: <Icons.Buffer className="w-8 h-8" />, 
            desc: 'The best way to manage multiple social accounts.',
            color: 'bg-[#2c3338]',
            logoColor: 'text-white'
        },
        { 
            id: 'hootsuite' as IntegrationServiceId, 
            name: 'Hootsuite', 
            icon: <Icons.Hootsuite className="w-8 h-8" />, 
            desc: 'Powerful scheduling for professional teams.',
            color: 'bg-[#ffcf30]',
            logoColor: 'text-slate-900'
        },
        { 
            id: 'zapier' as IntegrationServiceId, 
            name: 'Zapier', 
            icon: <Icons.Zapier className="w-8 h-8" />, 
            desc: 'Connect to 6,000+ apps and automate workflows.',
            color: 'bg-[#ff4f00]',
            logoColor: 'text-white'
        },
        { 
            id: 'make' as IntegrationServiceId, 
            name: 'Make', 
            icon: <Icons.Make className="w-8 h-8" />, 
            desc: 'Visual workflow automation for complex tasks.',
            color: 'bg-[#7147f2]',
            logoColor: 'text-white'
        }
    ];

    return (
        <div className="h-full flex flex-col gap-6 animate-fade-in-up pb-32 lg:pb-0">
            <div className="bg-slate-900 text-white p-8 rounded-xl shadow-lg relative overflow-hidden">
                <Icons.Plus className="absolute -top-6 -right-6 w-32 h-32 text-white opacity-10 rotate-12" />
                <h2 className="text-2xl font-black uppercase tracking-tight mb-2 flex items-center gap-2 relative z-10">
                    <Icons.Grid className="w-7 h-7 text-blue-400" />
                    App Integrations
                </h2>
                <p className="text-slate-200 text-sm font-medium leading-relaxed max-w-lg relative z-10">
                    Connect Social Abundance to your favorite tools. Instantly push your generated threads, posts, and captions to your publishing queue.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {SERVICE_CARDS.map(service => {
                    const config = integrations.find(i => i.id === service.id);
                    const isLinked = config?.connected;
                    const loading = isConnecting === service.id;

                    return (
                        <div key={service.id} className="bg-white rounded-xl border-2 border-slate-200 shadow-sm overflow-hidden flex flex-col hover:border-blue-300 transition-all group">
                            <div className={`p-6 flex items-center gap-4 ${service.color}`}>
                                <div className={`p-3 rounded-xl bg-white/20 backdrop-blur-md ${service.logoColor}`}>
                                    {service.icon}
                                </div>
                                <div className="flex-grow">
                                    <h3 className="text-xl font-black text-white">{service.name}</h3>
                                    {isLinked ? (
                                        <span className="flex items-center gap-1 text-[10px] font-black text-white/80 bg-white/10 px-2 py-0.5 rounded-full w-fit uppercase tracking-widest mt-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                                            Active
                                        </span>
                                    ) : (
                                        <span className="text-[10px] font-black text-white/50 uppercase tracking-widest mt-1">Disconnected</span>
                                    )}
                                </div>
                            </div>
                            <div className="p-6 flex-grow flex flex-col justify-between gap-6">
                                <p className="text-sm text-slate-600 font-medium leading-relaxed">
                                    {service.desc}
                                </p>
                                <button 
                                    onClick={() => handleToggleConnection(service.id)}
                                    disabled={loading}
                                    className={`
                                        w-full py-3 rounded-lg font-black text-sm uppercase tracking-wide transition-all flex items-center justify-center gap-2
                                        ${isLinked 
                                            ? 'bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-700 border border-slate-200' 
                                            : 'bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700'
                                        }
                                        ${loading ? 'opacity-50 cursor-wait' : ''}
                                    `}
                                >
                                    {loading ? (
                                        <><Icons.Refresh className="w-4 h-4 animate-spin" /> Authenticating...</>
                                    ) : isLinked ? (
                                        'Disconnect'
                                    ) : (
                                        <>Connect {service.name}</>
                                    )}
                                </button>
                            </div>
                        </div>
                    );
                })}

                {/* Webhook Card */}
                <div className="bg-white rounded-xl border-2 border-slate-200 shadow-sm overflow-hidden flex flex-col md:col-span-2 hover:border-blue-300 transition-all group">
                    <div className="p-6 flex items-center gap-4 bg-slate-800">
                        <div className="p-3 rounded-xl bg-white/20 backdrop-blur-md text-white">
                            <Icons.Send className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-white">Custom Webhook</h3>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Power User Tool</p>
                        </div>
                    </div>
                    <div className="p-6 space-y-4">
                        <p className="text-sm text-slate-600 font-medium leading-relaxed">
                            Send content to a custom endpoint (e.g., N8N, ActiveCampaign, or your own backend). We'll send a POST request with the content and metadata.
                        </p>
                        <div className="flex gap-2">
                            <input 
                                type="url" 
                                value={integrations.find(i => i.id === 'custom_webhook')?.webhookUrl || ''}
                                onChange={(e) => handleWebhookUpdate('custom_webhook', e.target.value)}
                                placeholder="https://your-webhook-url.com/incoming"
                                className="flex-grow p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono outline-none focus:border-blue-500"
                            />
                            <div className="px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg flex items-center gap-2 text-xs font-black uppercase">
                                <Icons.Check className="w-4 h-4" /> Ready
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};