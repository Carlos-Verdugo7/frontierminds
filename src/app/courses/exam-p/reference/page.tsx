import Link from 'next/link';
import CourseShell from '@/components/learning/CourseShell';
import { courses, lessonHref } from '@/content/catalog';
const fundamentals = [
  ['1.1', 'Addition rule', 'P(A ∪ B) = P(A) + P(B) − P(A ∩ B)'],
  ['1.2', 'Counting', 'C(n,r)=n!/[r!(n−r)!]; P(n,r)=n!/(n−r)!'],
  ['1.3', 'Conditional probability', 'P(A | B)=P(A ∩ B)/P(B), if P(B)>0'],
  [
    '1.5',
    'Bayes’ theorem',
    'P(Aᵢ | B)=P(B | Aᵢ)P(Aᵢ)/Σⱼ P(B | Aⱼ)P(Aⱼ), for a partition {Aⱼ}',
  ],
  [
    '2.2',
    'Expectation',
    'E[g(X)]=Σg(x)p(x); for a density, integrate g(x)f(x)',
  ],
  ['2.3', 'Variance', 'Var(X)=E[X²]−E[X]²; Var(aX+b)=a²Var(X)'],
  ['2.4', 'Binomial', 'P(X=k)=C(n,k)pᵏ(1−p)ⁿ⁻ᵏ; E[X]=np; Var(X)=np(1−p)'],
  [
    '2.5',
    'Geometric: trials until success',
    'P(X=k)=p(1−p)ᵏ⁻¹; E[X]=1/p; Var(X)=(1−p)/p²',
  ],
  ['2.6', 'Poisson', 'P(X=k)=e^(−λ)λᵏ/k!; E[X]=Var(X)=λ'],
  [
    '3.1',
    'Continuous probability',
    'P(a<X≤b)=F(b)−F(a); f(x)=F′(x) where differentiable',
  ],
  ['3.2', 'Exponential: rate λ', 'P(X>x)=e^(−λx), x≥0; E[X]=1/λ; Var(X)=1/λ²'],
  ['3.3', 'Standardization', 'Z=(X−μ)/σ for a normal X; Φ(z)=P(Z≤z)'],
];
export default function Page() {
  const formulas = [
    ...fundamentals,
    ...courses['exam-p'].lessons
      .filter((l) => l.formula)
      .map((l) => [l.id, l.title, l.formula!]),
  ];
  return (
    <CourseShell course="exam-p">
      <h1 className="text-4xl font-bold">Formula reference</h1>
      <p className="mt-4 text-slate-400">
        A study companion. Follow each link for the assumptions, worked
        examples, and practice. This is not an official exam exhibit.
      </p>
      <div className="grid md:grid-cols-2 gap-4 mt-8">
        {formulas.map(([id, title, formula]) => (
          <article
            key={id}
            className="rounded-xl border border-slate-700 bg-slate-900 p-6"
          >
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="font-mono leading-relaxed my-4 break-words text-teal-100">
              {formula}
            </p>
            <Link
              href={lessonHref('exam-p', id)}
              className="text-sm text-teal-300"
            >
              Lesson {id}: learn & practice →
            </Link>
          </article>
        ))}
      </div>
    </CourseShell>
  );
}
