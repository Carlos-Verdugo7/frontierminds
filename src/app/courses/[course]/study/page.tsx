import { notFound } from 'next/navigation';
import { isCourse } from '@/content/catalog';
import StudyDesk from '@/components/learning/StudyDesk';
export default async function Page({
  params,
}: {
  params: Promise<{ course: string }>;
}) {
  const { course } = await params;
  if (!isCourse(course)) notFound();
  return <StudyDesk course={course} />;
}
