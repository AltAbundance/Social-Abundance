export const PRICING_PLANS = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    priceId: '', // No Stripe price ID for free tier
    features: [
      '10 AI-generated posts per month',
      'Basic content types (text posts only)',
      '2 social platforms (Twitter/X & LinkedIn)',
      'Basic tone settings',
      'Save up to 5 content templates',
      'Preview generated content',
      'Basic hashtag suggestions'
    ],
    limitations: [
      'No scheduled posting',
      'No content calendar',
      'No analytics or performance tracking',
      'No viral content features',
      'Watermark on generated content'
    ],
    limits: {
      postsPerMonth: 10,
      platforms: ['twitter', 'linkedin'],
      contentTypes: ['text'],
      savedTemplates: 5,
      scheduling: false,
      analytics: false,
      viralLab: false,
      trendHunter: false,
      contentDNA: false,
      audiencePersonas: false,
      teamMembers: 1,
      contentCalendar: false,
      watermark: true
    }
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 29,
    priceId: 'price_1Sg8faLRc0VbwZ9yZEJ41Hgl', // Monthly price ID
    annualPriceId: 'price_1Sg8kDLRc0VbwZ9y1Xj4x37J', // Annual price ID
    features: [
      'Unlimited AI-generated content',
      'All content types (text, images, carousels, threads)',
      'All social platforms',
      'Advanced AI tone & voice customization',
      'Content DNA™ - Your unique content fingerprint',
      'Viral Lab - Test & optimize for virality',
      'Trend Hunter - Real-time trending topics',
      'Audience Personas - Target specific segments',
      'Content Calendar with scheduling',
      'Performance analytics & insights',
      'Unlimited saved templates',
      'Bulk content generation',
      'CSV export of content',
      'Priority AI processing',
      'No watermarks'
    ],
    limits: {
      postsPerMonth: -1, // unlimited
      platforms: ['all'],
      contentTypes: ['all'],
      savedTemplates: -1,
      scheduling: true,
      analytics: true,
      viralLab: true,
      trendHunter: true,
      contentDNA: true,
      audiencePersonas: true,
      teamMembers: 3,
      contentCalendar: true,
      watermark: false
    }
  }
} as const;

export type PlanId = keyof typeof PRICING_PLANS;
export type Plan = typeof PRICING_PLANS[PlanId];