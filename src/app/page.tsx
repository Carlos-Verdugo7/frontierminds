import type { Metadata } from 'next';
import HomePage from '@/components/home/HomePage';

export const metadata: Metadata = {
  title: 'FrontierMinds | Field guides for math, Data Engineering, Salesforce & community',
  description: 'Learn free Data Engineering with AI, medallion pipelines and Fivetran, alongside Salesforce and actuarial practice and Spanish community guides.',
  alternates: { canonical: 'https://www.frontierminds.io/' },
  openGraph: {
    title: 'FrontierMinds | Data Engineering, Salesforce, Actuarial Math & Comunidad',
    description: 'Build a free medallion pipeline lab, learn Fivetran and AI-assisted SQL, review Salesforce cases and practice actuarial math.',
    url: 'https://www.frontierminds.io/',
    siteName: 'FrontierMinds',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FrontierMinds | Actuarial math, Salesforce & Comunidad',
    description: 'Free Data Engineering, probability and Salesforce labs, plus community guides in Spanish.',
  },
};

export default function Home() {
  return <HomePage />;
}
