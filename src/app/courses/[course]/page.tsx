import { courseMetadata } from '@/lib/course-metadata';
import { notFound } from 'next/navigation';
import { isCourse } from '@/content/catalog';
import CourseOverview from '@/components/learning/CourseOverview';
type PageProps = { params: Promise<{ course: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { course } = await params;
  return courseMetadata('/courses/' + course);
}

export default async function Page({ params }: PageProps) {
  const { course } = await params;
  if (!isCourse(course)) notFound();
  return <CourseOverview course={course} />;
}
