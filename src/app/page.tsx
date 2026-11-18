import type { Metadata } from 'next';
import HomePage from '@/components/home/HomePage';
import { allQuestions, courses } from '@/content/catalog';

export const metadata: Metadata = {
  title: 'FrontierMinds | Actuarial math, AI and Salesforce labs',
  description: 'Train a payout model, audit AI replies in a Salesforce case queue, study for Exam P, and find Spanish community resources in West Palm Beach.',
  alternates: { canonical: 'https://www.frontierminds.io/' },
  openGraph: {
    title: 'FrontierMinds | Actuarial math and AI in practice',
    description: 'Try an insurance model, review a Salesforce case, or explore community guides in Spanish.',
    url: 'https://www.frontierminds.io/',
    siteName: 'FrontierMinds',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FrontierMinds | Actuarial math and AI in practice',
    description: 'Hands-on probability and Salesforce labs, with community guides in Spanish.',
  },
};

export default function Home() {
  return <HomePage
    examChapters={courses['exam-p'].chapters.length}
    examQuestions={allQuestions('exam-p').length}
    salesforceLessons={courses.salesforce.lessons.length}
  />;
}
