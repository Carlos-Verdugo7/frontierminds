import { courseMetadata } from '@/lib/course-metadata';
import { notFound } from 'next/navigation';
import { courses, isCourse } from '@/content/catalog';
import ChapterOverview from '@/components/learning/ChapterOverview';
type PageProps = { params: Promise<{ course: string; chapter: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { course, chapter } = await params;
  return courseMetadata('/courses/' + course + '/chapter/' + chapter);
}

export default async function Page({ params }: PageProps) {
  const { course, chapter } = await params;
  if (!isCourse(course)) notFound();
  const data = courses[course].chapters.find((c) => String(c.id) === chapter);
  if (!data) notFound();
  return <ChapterOverview course={course} chapter={data} />;
}
