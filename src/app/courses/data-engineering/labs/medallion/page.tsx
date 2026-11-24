import Link from 'next/link';
import CourseShell from '@/components/learning/CourseShell';
import MedallionLab from '@/components/labs/MedallionLab';
import { pageMetadata } from '@/lib/page-metadata';

export const metadata = pageMetadata({
  title: 'Medallion data quality lab',
  description: 'Explore Bronze, Silver and Gold with a free, interactive synthetic orders pipeline. Practice deduplication, data quality and verified revenue reporting.',
  path: '/courses/data-engineering/labs/medallion',
  locale: 'en_US',
});

export default function Page() {
  return <CourseShell course="data-engineering">
    <header className="max-w-4xl mb-10">
      <p className="text-[#203ead] uppercase tracking-widest text-xs font-semibold">Data Engineering & AI / Free lab</p>
      <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight mt-3">Medallion data quality lab</h1>
      <p className="text-slate-600 text-lg mt-4">Take one fictional dataset from raw ingestion to a trusted metric. Remove a quality check to discover why an AI-written report can be confidently wrong.</p>
      <p className="mt-4 text-sm text-slate-600">No signup, key, warehouse, connection, or external data required.</p>
    </header>
    <MedallionLab />
    <p className="mt-10 text-sm"><Link className="text-[#203ead] underline" href="/courses/data-engineering">← Back to the Data Engineering course</Link></p>
  </CourseShell>;
}
