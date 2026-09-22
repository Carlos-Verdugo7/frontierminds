import type { Problem } from '@/content/exam-p/problems';
export type CourseId = 'exam-p' | 'salesforce';
export type TopicGroup =
  'general' | 'univariate' | 'multivariate' | 'foundation';
export interface Lesson {
  id: string;
  title: string;
  summary: string;
  group: TopicGroup;
  minutes: number;
  objectives: string[];
  blocks: { title: string; body: string }[];
  example: { question: string; solution: string };
  lab: string[];
  simulator?: 'joint' | 'sampling' | 'insurance' | 'salesforce';
  formula?: string;
  source?: { title: string; url: string };
  problems: Problem[];
}
export interface Chapter {
  id: number;
  title: string;
  description: string;
  lessons: { id: string; title: string; enrichment?: string }[];
}
