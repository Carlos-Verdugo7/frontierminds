import { courseMetadata } from '@/lib/course-metadata';
import { notFound } from 'next/navigation';
import { isCourse } from '@/content/catalog';
import StudyDesk from '@/components/learning/StudyDesk';
type PageProps = { params: Promise<{ course: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { course } = await params;
  return courseMetadata('/courses/' + course + '/study');
}

export default async function Page({ params }: PageProps) {
  const { course } = await params;
  if (!isCourse(course)) notFound();
  return <StudyDesk course={course} />;
}
