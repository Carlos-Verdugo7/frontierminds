import { courses, lessonHref } from '@/content/catalog';
import { communityGuides } from '@/content/community';
import { deductibleLab, emailCaseLab, responseLab, schoolCall, medallionLab } from '@/content/activities';
import type { CourseId } from '@/lib/learning/types';

type Area = CourseId | 'comunidad';
export type GuideEntry = { title: string; path: string; area: Area; detail: string; keywords: string; featured?: boolean };

const communityWords = {
  luz: 'luz electricidad electricity electric power utility utilities bill payment FPL',
  escuela: 'escuela escolar inscripción inscribir school registration enroll children',
  empleo: 'empleo trabajo job jobs career employment',
  ingles: 'inglés English literacy aprender clases classes library biblioteca',
};
const studyResources: GuideEntry[] = [
  { title: 'Formula reference', path: '/courses/exam-p/reference', area: 'exam-p', detail: 'Exam P formulas and related lessons.', keywords: 'formulas fórmula reference sheet' },
  { title: 'Practice & exams', path: '/courses/exam-p/practice', area: 'exam-p', detail: 'Mixed practice and timed Exam P exams.', keywords: 'timed quiz examen preguntas', featured: true },
  { title: 'Field guide to AI and probability', path: '/guides/ai-probability-actuarial-science', area: 'exam-p', detail: 'Explore base rates, model assumptions, and actuarial applications.', keywords: 'AI probability actuarial science Bayes' },
  ...Object.entries(courses).map(([id, course]) => ({ title: course.title + ' study desk', path: '/courses/' + id + '/study', area: id as CourseId, detail: 'Return to your lessons and review recent practice.', keywords: 'study desk progress resume repasar' })),
];
const activities: GuideEntry[] = [
  { ...deductibleLab, area: 'exam-p', detail: deductibleLab.description, keywords: 'insurance loss simulation deductible payout actuarial ai model', featured: true },
  { ...responseLab, area: 'salesforce', detail: responseLab.description, keywords: 'AI model case customer service review evidence agent', featured: true },
  { ...medallionLab, area: 'data-engineering', detail: medallionLab.description, keywords: 'data engineering bronze silver gold medallion pipeline ingestion SQL Fivetran DuckDB dbt reporting AI', featured: true },
  { ...emailCaseLab, area: 'salesforce', detail: emailCaseLab.description, keywords: 'email flow automation duplicate missing acknowledgement' },
  { ...schoolCall, area: 'comunidad', detail: schoolCall.description, keywords: communityWords.escuela + ' llamada phone call practice', featured: true },
];
export const guideIndex: GuideEntry[] = [];
for (const area of ['exam-p', 'salesforce', 'data-engineering'] as const) {
  const course = courses[area];
  const base = '/courses/' + area;
  guideIndex.push({ title: course.title, path: base, detail: course.description, area, keywords: 'course curriculum guide curso', featured: true });
  for (const chapter of course.chapters) {
    const prefix = 'Chapter ' + chapter.id;
    guideIndex.push({ title: chapter.title, path: base + '/chapter/' + chapter.id, detail: prefix + ' · ' + chapter.description, area, keywords: 'chapter capítulo' });
    for (const lesson of chapter.lessons) {
      const full = course.lessons.find(item => item.id === lesson.id);
      guideIndex.push({ title: lesson.title, path: lessonHref(area, lesson.id), detail: 'Lesson ' + lesson.id + ' · ' + chapter.title, area, keywords: [full?.summary, ...(full?.objectives ?? [])].join(' ') });
    }
  }
}
const refresher = courses['exam-p'].lessons.find(lesson => lesson.id === '0.1');
if (refresher) guideIndex.push({ title: refresher.title, path: lessonHref('exam-p', refresher.id), detail: refresher.summary, area: 'exam-p', keywords: 'calculus diagnostic refresher' });
guideIndex.push(...activities, ...studyResources,
  { title: 'Comunidad en español', path: '/comunidad', detail: 'Guías para familias de West Palm Beach.', area: 'comunidad', keywords: 'community Spanish local help recursos español', featured: true },
  ...communityGuides.map(guide => ({ title: guide.title, path: '/comunidad#guia-' + guide.id, detail: guide.description, area: 'comunidad' as const, keywords: guide.label + ' ' + communityWords[guide.id] })),
);

function normalize(text: string) {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9.]+/g, ' ').trim();
}
const areas = { 'exam-p': 'Exam P actuarial math probability', salesforce: 'Salesforce AI', 'data-engineering': 'Data engineering Fivetran dbt DuckDB Snowflake Claude Codex medallion PDF', comunidad: 'Comunidad español West Palm Beach' };
const indexed = guideIndex.map(entry => ({
  entry,
  title: normalize(entry.title),
  context: normalize(entry.detail + ' ' + entry.keywords + ' ' + areas[entry.area]),
}));

export function findGuides(query: string): GuideEntry[] {
  const input = normalize(query);
  if (!query.trim()) return guideIndex.filter(item => item.featured);
  if (!input) return [];
  const words = input.split(/\s+/);
  return indexed.map(({ entry, title, context }) => {
    const score = words.every(word => title.includes(word) || context.includes(word))
      ? words.reduce((sum, word) => sum + (title.includes(word) ? 4 : 1), title.includes(input) ? 6 : 0)
      : 0;
    return { entry, score };
  }).filter(item => item.score > 0).sort((a, b) => b.score - a.score).map(item => item.entry);
}
