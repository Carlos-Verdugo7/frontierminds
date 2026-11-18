import { notFound } from 'next/navigation';
import { courses, isCourse } from '@/content/catalog';
import LessonPage from '@/components/learning/LessonPage';
import { pageMetadata } from '@/lib/page-metadata';
import { emailCaseLab } from '@/content/activities';

type LessonParams = { params: Promise<{ course: string; chapter: string; section: string }> };

export async function generateMetadata({ params }: LessonParams) {
  const { course, chapter, section } = await params;
  if (!isCourse(course)) return {};
  const lesson = courses[course].lessons.find(item => item.id === chapter + '.' + section);
  if (!lesson) return {};
  const image = course === 'salesforce' && lesson.id === '2.1' ? emailCaseLab.path + '/opengraph-image' : undefined;
  return pageMetadata({ title: lesson.title, description: lesson.summary, locale: 'en_US',
    path: `/courses/${course}/chapter/${chapter}/section/${section}` }, image);
}
export default async function Page({
  params,
}: LessonParams) {
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
      aiEnabled={Boolean(process.env.OPENAI_API_KEY)}
    />
  );
}
