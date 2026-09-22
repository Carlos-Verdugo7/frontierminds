import ChapterOverview from '@/components/learning/ChapterOverview';
import { examChapters } from '@/content/catalog';
export default function Page(){return <ChapterOverview course="exam-p" chapter={examChapters[0]}/>;}
