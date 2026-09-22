import { notFound } from 'next/navigation';
import { courses, isCourse } from '@/content/catalog';
import ChapterOverview from '@/components/learning/ChapterOverview';
export default async function Page({
  params,
}: {
  params: Promise<{ course: string; chapter: string }>;
}) {
  const { course, chapter } = await params;
  if (!isCourse(course)) notFound();
  const data = courses[course].chapters.find((c) => String(c.id) === chapter);
  if (!data) notFound();
  return <ChapterOverview course={course} chapter={data} />;
}
