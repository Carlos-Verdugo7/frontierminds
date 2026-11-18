import { courseMetadata } from '@/lib/course-metadata';
import ExamPractice from '@/components/learning/ExamPractice';

export const metadata = courseMetadata('/courses/exam-p/practice');

export default function Page() {
  return <ExamPractice />;
}
