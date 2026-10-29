'use client';

import type { CommunityTopic } from '@/content/community';

type CommunityEvent =
  | { action: 'guide_open'; topic: CommunityTopic }
  | { action: 'resource_click'; topic: CommunityTopic; resource: number }
  | { action: 'helpfulness'; topic: CommunityTopic; value: 'yes' | 'needs_help' }
  | { action: 'ai_request' | 'ai_success' | 'ai_error'; topic: CommunityTopic; task: 'pasos' | 'lista' | 'preguntas' }
  | { action: 'feedback_email_open'; topic: CommunityTopic | 'otro' };

// Deliberately no email, prompt, message, search text, or arbitrary URL parameters.
export function trackCommunity(event: CommunityEvent) {
  if (typeof window === 'undefined') return;
  const analytics = window as Window & { gtag?: (command: string, name: string, params: Record<string, string | number>) => void };
  const { action, ...params } = event;
  analytics.gtag?.('event', `community_${action}`, { ...params, language: 'es', area: 'west_palm_beach' });
}
