'use client';

import type { CommunityTopic } from '@/content/community';
import { sendEvent } from './site-analytics';

type CommunityEvent =
  | { action: 'guide_open'; topic: CommunityTopic }
  | { action: 'resource_click'; topic: CommunityTopic; resource: number }
  | { action: 'helpfulness'; topic: CommunityTopic; value: 'yes' | 'needs_help' }
  | { action: 'ai_request' | 'ai_success' | 'ai_error'; topic: CommunityTopic; task: 'pasos' | 'lista' | 'preguntas' }
  | { action: 'feedback_email_open'; topic: CommunityTopic | 'otro' };

// Deliberately no email, prompt, message, search text, or arbitrary URL parameters.
export function trackCommunity(event: CommunityEvent) {
  const { action, ...params } = event;
  sendEvent(`community_${action}`, { ...params, language: 'es', area: 'west_palm_beach' });
}
