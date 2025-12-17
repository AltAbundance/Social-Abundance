import { IntegrationServiceId, PlatformId } from '../types';

export const publishToService = async (
  serviceId: IntegrationServiceId,
  content: string,
  platformId: PlatformId,
  scheduledTime?: number,
  webhookUrl?: string
): Promise<{ success: boolean; message: string }> => {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 1500));

  console.log(`[Integration Service] Publishing to ${serviceId}...`, {
    content,
    platformId,
    scheduledTime: scheduledTime ? new Date(scheduledTime).toISOString() : 'Immediate',
    webhookUrl
  });

  if (serviceId === 'custom_webhook' && webhookUrl) {
    try {
      // Real attempt to hit the webhook if provided
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'Social Abundance',
          platform: platformId,
          content,
          scheduled_for: scheduledTime
        })
      });
      if (response.ok) return { success: true, message: `Successfully sent to webhook!` };
    } catch (e) {
      console.warn("Webhook delivery failed (this is expected if URL is invalid)", e);
    }
  }

  // Fallback for mock behavior
  const serviceNames = {
    buffer: 'Buffer',
    hootsuite: 'Hootsuite',
    zapier: 'Zapier',
    make: 'Make',
    custom_webhook: 'Webhook'
  };

  return {
    success: true,
    message: `Successfully scheduled in ${serviceNames[serviceId]} queue!`
  };
};

export const simulateOAuth = async (serviceId: IntegrationServiceId): Promise<boolean> => {
    return new Promise((resolve) => {
        // Mock a popup window behavior
        const width = 600;
        const height = 700;
        const left = (window.innerWidth / 2) - (width / 2);
        const top = (window.innerHeight / 2) - (height / 2);
        
        console.log(`Opening OAuth window for ${serviceId}...`);
        
        // We don't actually open a window to stay in-app, we'll simulate it with a promise
        setTimeout(() => {
            resolve(true);
        }, 2000);
    });
};