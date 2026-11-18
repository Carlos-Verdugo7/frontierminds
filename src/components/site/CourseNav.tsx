'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { deductibleLab, responseLab, emailCaseLab } from '@/content/activities';
import type { CourseId } from '@/lib/learning/types';

export default function CourseNav({ course }: { course: CourseId }) {
  const path = usePathname();
  const base = '/courses/' + course;
  const exam = course === 'exam-p';
  const links = [
    [exam ? 'Exam P guide' : 'Salesforce guide', base],
    ['Study desk', base + '/study'],
    ...(exam ? [['Deductible lab', deductibleLab.path], ['Practice exams', base + '/practice'], ['Formulas', base + '/reference']] : [['AI response review', responseLab.path], ['Email-to-Case lab', emailCaseLab.path]]),
  ];
  return <div className="course-nav-wrap"><nav className="course-nav site-width" aria-label="Course navigation">
    {links.map(([label, href]) => <Link key={href} href={href} aria-current={path === href ? 'page' : undefined}>{label}</Link>)}
  </nav></div>;
}
