import { notFound } from 'next/navigation';
import { courses, isCourse } from '@/content/catalog';
import LessonPage from '@/components/learning/LessonPage';
export default async function Page({
  params,
}: {
  params: Promise<{ course: string; chapter: string; section: string }>;
}) {
  const { course, chapter, section } = await params;
  if (!isCourse(course)) notFound();
  const lesson = courses[course].lessons.find(
    (l) => l.id === `${chapter}.${section}`,
  );
  if (!lesson) notFound();
  return (
    <LessonPage
      key={`${course}:${lesson.id}`}
      course={course}
      lesson={lesson}
    />
  );
}
