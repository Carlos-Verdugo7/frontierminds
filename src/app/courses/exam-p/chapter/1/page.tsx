import { courseMetadata } from '@/lib/course-metadata';
import ChapterOverview from '@/components/learning/ChapterOverview';
import { examChapters } from '@/content/catalog';

export const metadata = courseMetadata('/courses/exam-p/chapter/1');

export default function Page(){return <ChapterOverview course="exam-p" chapter={examChapters[0]}/>;}
