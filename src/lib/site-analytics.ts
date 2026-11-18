'use client';

type EventParams = Record<string, string | number>;

export function sendEvent(name: string, params: EventParams) {
  if (typeof window === 'undefined') return;
  const w = window as Window & {
    gtag?: (command: string, name: string, params: EventParams) => void;
    dataLayer?: unknown[];
  };
  w.gtag ??= function () {
    // eslint-disable-next-line prefer-rest-params -- Google's bootstrap queues Arguments objects.
    (w.dataLayer ??= []).push(arguments);
  };
  w.gtag('event', name, params);
}

export function trackActivity(name: 'school_rehearsal_start' | 'school_script_copy' | 'salesforce_lab_start' | 'salesforce_lab_pass') {
  sendEvent(name, { activity: name.startsWith('school_') ? 'school_call' : 'email_to_case' });
}
