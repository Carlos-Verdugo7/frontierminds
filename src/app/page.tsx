import type { Metadata } from 'next';
import HomePage from '@/components/home/HomePage';
import { allQuestions, courses } from '@/content/catalog';

export const metadata: Metadata = {
  title: 'FrontierMinds | Learn, explore, and take your next step',
  description: 'Explore interactive probability and Salesforce courses, or find Spanish guides for family resources in West Palm Beach. Practical learning and community support from FrontierMinds.',
  openGraph: {
    title: 'FrontierMinds | Learning and community',
    description: 'Build a skill. Find your next step. Interactive courses and practical community guides in one place.',
    url: 'https://frontierminds.io',
    siteName: 'FrontierMinds',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FrontierMinds | Learning and community',
    description: 'Interactive learning paths and Spanish community resources for West Palm Beach families.',
  },
};

export default function Home() {
  return <HomePage
    examChapters={courses['exam-p'].chapters.length}
    examQuestions={allQuestions('exam-p').length}
    salesforceLessons={courses.salesforce.lessons.length}
  />;
}
