import Link from 'next/link';
import CourseShell from '@/components/learning/CourseShell';
import EmailCaseLab from '@/components/learning/EmailCaseLab';
import { emailCaseLab } from '@/content/activities';
import { pageMetadata } from '@/lib/page-metadata';

export const metadata = pageMetadata(emailCaseLab, emailCaseLab.path + '/opengraph-image');

export default function EmailCasePage() {
  return <CourseShell course="salesforce">
    <Link href="/courses/salesforce/chapter/2/section/1" className="text-sm text-teal-300 underline">Back to lesson 2.1</Link>
    <h1 className="mb-3 mt-5 text-3xl font-bold sm:text-5xl">{emailCaseLab.title}</h1>
    <p className="mb-7 max-w-3xl text-lg text-slate-300">Find out why one person gets two replies and another gets none. Run the first test with the starting rules, then try a fix.</p>
    <EmailCaseLab />
  </CourseShell>;
}
