'use client';

import { createContext } from 'react';

export const TutorAvailability = createContext(false);

export function TutorSettings({ enabled, children }: { enabled: boolean; children: React.ReactNode }) {
  return <TutorAvailability.Provider value={enabled}>{children}</TutorAvailability.Provider>;
}
