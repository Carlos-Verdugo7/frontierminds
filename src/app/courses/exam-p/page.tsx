import { courseMetadata } from '@/lib/course-metadata';
import CourseOverview from '@/components/learning/CourseOverview';

export const metadata = courseMetadata('/courses/exam-p');

export default function Page() {
  return <CourseOverview course="exam-p" />;
}
