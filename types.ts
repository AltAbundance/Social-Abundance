import React from 'react';

export enum PlatformId {
  TWITTER = 'twitter',
  LINKEDIN = 'linkedin',
  INSTAGRAM = 'instagram',
  TIKTOK = 'tiktok',
  YOUTUBE_SHORTS = 'youtube_shorts',
  FACEBOOK = 'facebook',
  EMAIL = 'email',
  QUOTES = 'quotes',
}

export type IntegrationServiceId = 'buffer' | 'hootsuite' | 'zapier' | 'make' | 'custom_webhook';

export interface IntegrationConfig {
  id: IntegrationServiceId;
  name: string;
  connected: boolean;
  apiKey?: string;
  webhookUrl?: string;
}

export interface PlatformConfig {
  id: PlatformId;
  name: string;
  icon: React.ReactNode;
  description: string;
}

export interface ToneSettings {
  formality: number; // 0 (Casual) to 100 (Formal)
  emojiUsage: number; // 0 (None) to 100 (Heavy)
  humor: number; // 0 (Serious) to 100 (Witty/Funny)
  comprehensionLevel: number; // 0 (6th Grade) to 100 (PhD)
  perspective: 'first' | 'second' | 'third';
}

export interface ContentScore {
  hook: number;
  virality: number;
  total: number;
  reasoning: string;
}

export interface GenerationResult {
  platformId: PlatformId;
  content: string;
  scores: ContentScore;
}

export interface GeneratedContentResponse {
  results: GenerationResult[];
  quotables: string[];
}

export interface VoiceProfile {
  id: string;
  name: string;
  description: string; // The AI generated analysis of the style
  sampleText: string;
}

export interface SavedContent {
  id: string;
  date: number;
  sourcePreview: string;
  results: GenerationResult[];
  quotables?: string[];
  tags: string[];
}

export interface CalendarEvent {
  id: string;
  date: number; // Timestamp for the day
  contentId: string; // Reference to SavedContent.id
  platformId: PlatformId;
  contentSnippet: string;
}

export interface ViralAnalysis {
  originalText: string;
  hookType: string;
  psychologicalTriggers: string[];
  structureTemplate: string;
  repurposedExample: string;
}

export interface AudiencePersona {
  id: string;
  name: string;
  role: string;
  painPoints: string[];
  desires: string[];
  description: string; // AI generated deep profile
}

export interface ContentDNAReport {
  archetype: string; // e.g., "The Visionary Architect"
  voiceFingerprint: string;
  strengths: string[];
  blindSpots: string[];
  growthRoadmap: string[];
}

export interface IdeaCompoundResult {
  angle: string; // e.g., "Contrarian", "Actionable", "Story"
  content: string;
}

export interface IdeaMatrix {
  topic: string;
  results: IdeaCompoundResult[];
}

export interface TrendIdea {
  headline: string;
  description: string;
  angle: string; // e.g., "Contrarian", "Newsjack", "Educational"
}

export interface TrendReport {
  niche: string;
  sources: { title: string; url: string }[];
  trends: TrendIdea[];
}

export type QuoteTemplateId = 'minimal' | 'dark' | 'gradient' | 'bold' | 'tweet' | 'carousel';
export type AspectRatio = 'square' | 'portrait' | 'landscape';

export interface VisualSettings {
  templateId: QuoteTemplateId;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  fontFamily: string;
  fontSize: number;
  showHandle: boolean;
  handleText: string;
  aspectRatio: AspectRatio;
}