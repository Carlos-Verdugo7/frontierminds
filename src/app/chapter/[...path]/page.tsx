import { notFound, permanentRedirect } from 'next/navigation';
import { courses } from '@/content/catalog';
export default async function Page({
  params,
}: {
  params: Promise<{ path: string[] }>;
}) {
  const { path } = await params;
  const chapter = courses['exam-p'].chapters.find(
    (c) => String(c.id) === path[0],
  );
  if (
    !chapter ||
    !(
      path.length === 1 ||
      (path.length === 3 &&
        path[1] === 'section' &&
        chapter.lessons.some((l) => l.id === `${path[0]}.${path[2]}`))
    )
  )
    notFound();
  permanentRedirect(`/courses/exam-p/chapter/${path.join('/')}`);
}
