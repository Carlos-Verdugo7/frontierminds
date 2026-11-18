import type { Metadata } from 'next';
import HomePage from '@/components/home/HomePage';

export const metadata: Metadata = {
  title: 'FrontierMinds | Field guides for math, Salesforce & community',
  description: 'Train a payout model, audit AI replies in a Salesforce case queue, study for Exam P, and find Spanish community resources in West Palm Beach.',
  alternates: { canonical: 'https://www.frontierminds.io/' },
  openGraph: {
    title: 'FrontierMinds | Actuarial math, Salesforce & Comunidad',
    description: 'Try an insurance model, review a Salesforce case, or explore community guides in Spanish.',
    url: 'https://www.frontierminds.io/',
    siteName: 'FrontierMinds',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FrontierMinds | Actuarial math, Salesforce & Comunidad',
    description: 'Hands-on probability and Salesforce labs, with community guides in Spanish.',
  },
};

export default function Home() {
  return <HomePage />;
}
