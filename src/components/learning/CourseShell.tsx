import CourseNav from '@/components/site/CourseNav';
import type { CourseId } from '@/lib/learning/types';

export default function CourseShell({ course, children }: { course: CourseId; children: React.ReactNode }) {
  return <div className="course-shell"><CourseNav course={course} /><main className="site-width course-body">{children}</main></div>;
}
