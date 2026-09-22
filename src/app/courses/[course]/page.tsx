import { notFound } from 'next/navigation';
import { isCourse } from '@/content/catalog';
import CourseOverview from '@/components/learning/CourseOverview';
export default async function Page({
  params,
}: {
  params: Promise<{ course: string }>;
}) {
  const { course } = await params;
  if (!isCourse(course)) notFound();
  return <CourseOverview course={course} />;
}
