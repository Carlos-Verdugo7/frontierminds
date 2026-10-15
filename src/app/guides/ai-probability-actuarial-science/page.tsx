import type { Metadata } from 'next';
import Link from 'next/link';
import CourseShell from '@/components/learning/CourseShell';

const title = 'AI, Probability & the Future Actuary';
const description =
  'Use AI thoughtfully while studying Exam P: check probability reasoning, build independent skills, and explore the opportunities and risks for actuarial work.';

export const metadata: Metadata = {
  title: `${title} | FrontierMinds`,
  description,
  openGraph: { title, description, type: 'article' },
  twitter: { card: 'summary', title, description },
};

const sources = [
  {
    id: 'nist',
    title: 'NIST — Generative AI Risk Management Profile (2024)',
    href: 'https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf',
    note: 'Background on fabricated answers, privacy, bias, and human oversight; not an exam policy.',
  },
  {
    id: 'soa-primer',
    title: 'SOA — A Primer on Generative AI for Actuaries (2024)',
    href: 'https://www.soa.org/resources/research-reports/2024/generative-ai-for-actuaries/',
    note: 'A technical introduction, explicitly presented as a point-in-time view.',
  },
  {
    id: 'soa-ethics',
    title: 'SOA — Ethical Use of Artificial Intelligence for Actuaries (2019)',
    href: 'https://www.soa.org/resources/research-reports/2019/ethical-artificial-intelligence/',
    note: 'Foundational discussion of ethical risks in actuarial AI, predating today’s chatbots.',
  },
  {
    id: 'soa-rules',
    title: 'SOA — Examples of Improper Examination Conduct',
    href: 'https://www.soa.org/education/general-info/discipline/edu-disciplinary-examples/',
    note: 'Official guidance on assistance, unauthorized aids, and confidential exam material.',
  },
];

const sections = [
  ['study', 'Study with AI'],
  ['check', 'Check the reasoning'],
  ['work', 'Actuarial implications'],
  ['next', 'Build lasting skills'],
  ['sources', 'Sources & exam rules'],
];
const linkStyle = 'text-teal-300 underline underline-offset-4 hover:text-teal-100';
const headingStyle = 'text-2xl font-semibold text-slate-100';

export default function AIProbabilityGuide() {
  return (
    <CourseShell course="exam-p">
      <article className="mx-auto max-w-3xl space-y-12 text-slate-300 leading-relaxed">
        <header>
          <p className="text-sm font-semibold tracking-widest text-teal-300">FRONTIERMINDS FIELD GUIDE</p>
          <h1 className="mt-3 text-4xl font-bold leading-tight text-white sm:text-5xl">{title}</h1>
          <p className="mt-5 text-xl">Let AI support your learning. Keep the reasoning yours.</p>
          <p className="mt-4">
            AI can help you explore a difficult idea, but a convincing explanation is not proof.
            This guide connects probability study to questions about actuarial work—without
            predicting that every career will follow the same route.
          </p>
          <p className="mt-4 text-sm text-slate-400">
            By FrontierMinds · Sources checked <time dateTime="2026-10-15">October 15, 2026</time>
            {' '}· Optional perspective, not an Exam P syllabus section
          </p>
          <nav aria-label="On this page" className="mt-7 flex flex-wrap gap-x-5 gap-y-3 border-y border-slate-700 py-5 text-sm">
            {sections.map(([id, label]) => <a key={id} href={`#${id}`} className={linkStyle}>{label}</a>)}
          </nav>
        </header>

        <section id="study" className="scroll-mt-6 space-y-5">
          <h2 className={headingStyle}>1. A study partner, not an answer key</h2>
          <p>
            Try AI for a smaller hint, a different explanation, or a draft simulation.
            Treat its output as something to check. NIST describes how generative AI can
            confidently produce false answers, faulty reasoning, and invented citations.
            {' '}<a href="#nist" className={linkStyle}>Read the risk profile</a>.
          </p>
          <div className="rounded-2xl border border-teal-800 bg-teal-950/30 p-6">
            <h3 className="font-semibold text-teal-200">Our suggested practice loop</h3>
            <ol className="mt-4 list-decimal space-y-3 pl-5">
              <li><strong>Attempt first.</strong> Define the events or random variable and write your assumptions.</li>
              <li><strong>Ask for one hint.</strong> Keep the next calculation yours.</li>
              <li><strong>Verify independently.</strong> Check the formula, arithmetic, support, and probability bounds against a trusted lesson.</li>
              <li><strong>Repeat without AI.</strong> Solve a fresh problem and explain why the method applies.</li>
            </ol>
          </div>
          <details className="rounded-xl border border-slate-700 p-5">
            <summary className="cursor-pointer font-semibold text-slate-100">Try a hint-first prompt</summary>
            <blockquote className="mt-4 border-l-2 border-teal-400 pl-4">
              I am practicing conditional probability. Here is my attempt: [add your work].
              Ask me one question that helps me check my assumptions. Do not give the final
              answer yet. Point out any step that needs verification.
            </blockquote>
            <p className="mt-3 text-sm">Use your own or publicly released practice material, not confidential exam questions.</p>
          </details>
          <p>
            Feeling familiar with a solution is different from solving it independently.
            Track unaided accuracy and recurring mistakes, not just how many explanations you read.
          </p>
        </section>

        <section id="check" className="scroll-mt-6 space-y-5">
          <h2 className={headingStyle}>2. Probability helps you challenge an AI answer</h2>
          <p>
            Generative AI produces content; a predictive model might estimate a claim probability.
            These are different tasks. A chatbot sounding certain is not the same as a
            probability estimate validated against real outcomes.
          </p>
          <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
            <p className="text-sm font-semibold text-teal-300">TRY IT · A BASE-RATE TRAP</p>
            <h3 className="mt-3 text-xl font-semibold text-white">Does a flag mean a 90% chance of a defect?</h3>
            <p className="mt-3">
              In a hypothetical batch, 1% of items are defective. A detector flags 90% of
              defective items and 5% of non-defective items. An item is flagged.
              What is the probability it is defective?
            </p>
            <p className="mt-3">Try a population of 10,000 items before opening the explanation.</p>
            <details className="mt-5 border-t border-slate-700 pt-4">
              <summary className="cursor-pointer font-semibold text-teal-200">Reveal the independent check</summary>
              <div className="mt-4 space-y-3">
                <p>Of 100 defective items, 90 are flagged. Of 9,900 non-defective items, 495 are flagged.</p>
                <p className="rounded-lg bg-slate-950 p-4 font-semibold text-white">
                  P(defective | flagged) = 90 / (90 + 495) ≈ 15.38%
                </p>
                <p>
                  The 90% detection rate is P(flagged | defective), not its reverse.
                  Most items were not defective to begin with. Any answer that ignores that
                  base rate misses the denominator—even if it reads confidently.
                </p>
              </div>
            </details>
          </div>
          <p>
            For a generated simulation, also check the distribution, parameters, and whether
            independence was justified. Agreement with a simulation is a useful check, not
            proof: the code can repeat the same mistaken assumptions.
          </p>
          <Link href="/courses/exam-p/chapter/1/section/5" className={linkStyle}>Build the foundation: Bayes’ theorem →</Link>
        </section>

        <section id="work" className="scroll-mt-6 space-y-5">
          <h2 className={headingStyle}>3. What could change in actuarial work?</h2>
          <p>
            The SOA provides a <a href="#soa-primer" className={linkStyle}>generative AI primer</a> and
            research on <a href="#soa-ethics" className={linkStyle}>ethical risks</a>.
            The following are illustrative workflows to evaluate—not promises about adoption,
            job security, or the quality of a particular tool.
          </p>
          <div className="grid gap-4">
            {[
              ['Data and coding', 'AI could draft a data-cleaning script or explain unfamiliar code.', 'Check source data, missing values, units, leakage, and tests before trusting the output.'],
              ['Models and scenarios', 'AI could help brainstorm scenarios or draft simulation code.', 'Choose defensible assumptions. Examine rare losses, dependence, and sensitivity; generated scenarios are not observed evidence.'],
              ['Reports and communication', 'AI could produce a first summary of approved material.', 'Trace claims to sources, preserve uncertainty, and have a qualified person review the conclusions.'],
            ].map(([label, opportunity, responsibility]) => (
              <div key={label} className="rounded-xl border border-slate-700 bg-slate-900 p-5">
                <h3 className="font-semibold text-white">{label}</h3>
                <p className="mt-2">{opportunity}</p>
                <p className="mt-3 text-teal-100"><strong>Your check:</strong> {responsibility}</p>
              </div>
            ))}
          </div>
          <p>
            Before using AI at work, follow your organization’s approved-tool and data policies.
            Do not paste confidential policyholder, employer, or client data into an unapproved
            tool. Check performance across relevant groups and document limitations, assumptions,
            and review decisions. NIST highlights privacy, harmful bias, and overreliance among
            the risks to manage. <a href="#nist" className={linkStyle}>Source: NIST</a>.
          </p>
          <p className="text-sm text-slate-400">
            These are general learning considerations, not jurisdiction-specific professional
            guidance. Applicable standards and obligations depend on your role and location.
          </p>
        </section>

        <section id="next" className="scroll-mt-6 space-y-5">
          <h2 className={headingStyle}>4. Build skills that travel across paths</h2>
          <p>
            Our recommendation: pair probability with data skills, clear communication, and
            critical review. Learn to ask what a model assumes, when it fails, and how you would
            explain its uncertainty. Exam P is a foundation—not a complete education in AI or
            actuarial practice.
          </p>
          <p>
            Actuarial work, analytics, and business systems can lead in different directions.
            Our Salesforce path offers a separate way to practice data structure and workflows;
            it is not an actuarial credential. Snowflake remains a planned learning path.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/courses/exam-p/practice" className="rounded-lg bg-teal-300 px-5 py-3 font-semibold text-slate-950 hover:bg-teal-200">Practice probability →</Link>
            <Link href="/courses/salesforce" className="rounded-lg border border-slate-600 px-5 py-3 text-white hover:border-teal-300">Explore Salesforce →</Link>
          </div>
        </section>

        <section id="sources" className="scroll-mt-6 space-y-5 border-t border-slate-700 pt-8">
          <h2 className={headingStyle}>Sources & exam boundaries</h2>
          <aside className="rounded-xl border border-amber-800 bg-amber-950/20 p-5 text-amber-100">
            <h3 className="font-semibold">Study assistance is not exam permission</h3>
            <p className="mt-2">
              SOA rules prohibit giving or receiving assistance during an examination and using
              unauthorized aids. Do not use AI during Exam P or share confidential exam content.
              Check the current rules for your specific exam and sitting; other exam bodies
              and assessments have their own policies. <a href="#soa-rules" className="underline underline-offset-4">Read the SOA guidance below</a>.
            </p>
          </aside>
          <ul className="space-y-5">
            {sources.map((source) => (
              <li key={source.id} id={source.id} className="scroll-mt-6">
                <a href={source.href} className={linkStyle}>{source.title} ↗</a>
                <p className="mt-1 text-sm text-slate-400">{source.note}</p>
              </li>
            ))}
          </ul>
          <p className="text-sm text-slate-400">
            The practice loop and worked example are FrontierMinds teaching suggestions.
            This independent guide is not endorsed by the SOA or NIST. Tools and policies
            change; consult the linked primary sources for updates.
          </p>
        </section>
      </article>
    </CourseShell>
  );
}
