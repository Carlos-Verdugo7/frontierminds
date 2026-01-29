'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import VarianceCalculator from '@/components/VarianceCalculator';
import PracticeProblems from '@/components/PracticeProblems';

type TabType = 'learn' | 'simulate' | 'practice';

export default function Section2_3Page() {
  const [activeTab, setActiveTab] = useState<TabType>('learn');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/chapter/2" className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-400" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-white">2.3 Special Mathematical Expectations</h1>
              <p className="text-sm text-slate-400">Variance, standard deviation, moments, and MGFs</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            {(['learn', 'simulate', 'practice'] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-green-500 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {tab === 'learn' && '📚 Learn'}
                {tab === 'simulate' && '🧮 Simulate'}
                {tab === 'practice' && '✏️ Practice'}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {activeTab === 'learn' && <LearnContent />}
        {activeTab === 'simulate' && <SimulateContent />}
        {activeTab === 'practice' && <PracticeProblems section="2.3" />}
      </main>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-sm border-t border-slate-700 p-4">
        <div className="max-w-6xl mx-auto flex justify-between">
          <Link
            href="/chapter/2/section/2"
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            2.2 Expectation
          </Link>
          <Link
            href="/chapter/2/section/4"
            className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm transition-colors"
          >
            Next: 2.4 Binomial Distribution
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ─── LEARN TAB ─── */
function LearnContent() {
  return (
    <div className="space-y-8 pb-20">
      {/* 1. Variance Definition */}
      <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-4">1. Variance and Standard Deviation</h2>
        <p className="text-slate-300 mb-4">
          The <span className="text-purple-400 font-semibold">variance</span> measures the spread or dispersion of
          a distribution around its mean &mu;. It is the second moment about the mean:
        </p>
        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg p-4 border border-purple-500/20 mb-4">
          <p className="text-purple-400 font-mono text-sm mb-2">Definition</p>
          <p className="text-white font-mono">
            &sigma;&sup2; = Var(X) = E[(X - &mu;)&sup2;] = &Sigma; (x - &mu;)&sup2; f(x)
          </p>
          <p className="text-slate-400 text-sm mt-2">
            The <span className="text-cyan-400 font-semibold">standard deviation</span> is &sigma; = &radic;&sigma;&sup2;.
          </p>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-4">
          <p className="text-sm text-slate-400 mb-2">Example: f(1) = 3/6, f(2) = 2/6, f(3) = 1/6</p>
          <p className="text-white font-mono text-sm mb-1">
            &mu; = 1(3/6) + 2(2/6) + 3(1/6) = 10/6 = 5/3
          </p>
          <p className="text-white font-mono text-sm mb-1">
            &sigma;&sup2; = (1 - 5/3)&sup2;(3/6) + (2 - 5/3)&sup2;(2/6) + (3 - 5/3)&sup2;(1/6) = 120/216 = <span className="text-yellow-400">5/9</span>
          </p>
          <p className="text-white font-mono text-sm">
            &sigma; = &radic;(5/9) &asymp; <span className="text-yellow-400">0.745</span>
          </p>
        </div>
      </section>

      {/* 2. Variance Shortcut */}
      <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-4">2. Variance Shortcut Formula</h2>
        <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg p-4 border border-yellow-500/20 mb-4">
          <p className="text-yellow-400 font-mono text-sm mb-2">Shortcut (Exam Favorite!)</p>
          <p className="text-white font-mono text-lg">
            &sigma;&sup2; = E(X&sup2;) - [E(X)]&sup2; = E(X&sup2;) - &mu;&sup2;
          </p>
        </div>
        <p className="text-slate-300 mb-3">
          This is often faster than the definition, since you avoid computing (x - &mu;) for every term.
        </p>
        <div className="bg-slate-700/50 rounded-lg p-4">
          <p className="text-sm text-slate-400 mb-2">Same example verified:</p>
          <p className="text-white font-mono text-sm mb-1">
            E(X&sup2;) = 1&sup2;(3/6) + 2&sup2;(2/6) + 3&sup2;(1/6) = 20/6
          </p>
          <p className="text-white font-mono text-sm">
            &sigma;&sup2; = 20/6 - (10/6)&sup2; = 20/6 - 100/36 = 120/216 = <span className="text-yellow-400">5/9</span> ✓
          </p>
        </div>
      </section>

      {/* 3. Fair Die Example */}
      <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-4">3. Example: Fair Six-Sided Die (Ex 2.3-1)</h2>
        <p className="text-slate-300 mb-4">
          Let X be the number of spots on a fair die. The PMF is f(x) = 1/6 for x = 1, 2, 3, 4, 5, 6.
        </p>
        <div className="bg-slate-700/50 rounded-lg p-4">
          <p className="text-white font-mono text-sm mb-1">
            &mu; = (1 + 2 + 3 + 4 + 5 + 6)/6 = 7/2 = 3.5
          </p>
          <p className="text-white font-mono text-sm mb-1">
            E(X&sup2;) = (1 + 4 + 9 + 16 + 25 + 36)/6 = 91/6
          </p>
          <p className="text-white font-mono text-sm mb-1">
            &sigma;&sup2; = 91/6 - (7/2)&sup2; = 91/6 - 49/4 = (182 - 147)/12 = <span className="text-yellow-400">35/12</span>
          </p>
          <p className="text-white font-mono text-sm">
            &sigma; = &radic;(35/12) &asymp; <span className="text-yellow-400">1.708</span>
          </p>
        </div>
      </section>

      {/* 4. Dispersion Comparison */}
      <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-4">4. Standard Deviation Measures Spread (Ex 2.3-2)</h2>
        <p className="text-slate-300 mb-4">
          Compare two distributions with the same mean &mu; = 0:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <p className="text-blue-400 font-semibold mb-2">X ~ Uniform {'{-1, 0, 1}'}</p>
            <p className="text-white font-mono text-sm">
              &sigma;&sup2;<sub>X</sub> = 2/3, &nbsp; &sigma;<sub>X</sub> = &radic;(2/3)
            </p>
          </div>
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
            <p className="text-orange-400 font-semibold mb-2">Y ~ Uniform {'{-2, 0, 2}'}</p>
            <p className="text-white font-mono text-sm">
              &sigma;&sup2;<sub>Y</sub> = 8/3, &nbsp; &sigma;<sub>Y</sub> = 2&radic;(2/3)
            </p>
          </div>
        </div>
        <p className="text-slate-300">
          Y = 2X, so &sigma;<sub>Y</sub> = 2&sigma;<sub>X</sub>. The standard deviation doubles because
          the probability is spread out twice as much.
        </p>
      </section>

      {/* 5. Linear Transformation */}
      <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-4">5. Variance Under Linear Transformation</h2>
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-4 border border-blue-500/20 mb-4">
          <p className="text-blue-400 font-mono text-sm mb-2">Theorem: Y = aX + b</p>
          <div className="space-y-2 text-white font-mono text-sm">
            <p>&mu;<sub>Y</sub> = a&mu;<sub>X</sub> + b</p>
            <p>&sigma;&sup2;<sub>Y</sub> = a&sup2;&sigma;&sup2;<sub>X</sub></p>
            <p>&sigma;<sub>Y</sub> = |a| &sigma;<sub>X</sub></p>
          </div>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-4">
          <p className="text-sm text-slate-400 mb-2">Key implications:</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li>Adding/subtracting a constant does <span className="text-yellow-400">not</span> change variance: Var(X - 1) = Var(X)</li>
            <li>Var(-X) = Var(X) since a = -1, a&sup2; = 1</li>
            <li>Var(cX) = c&sup2;Var(X)</li>
          </ul>
        </div>
      </section>

      {/* 6. Moments & Factorial Moments */}
      <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-4">6. Moments and Factorial Moments</h2>
        <div className="bg-gradient-to-r from-green-500/10 to-teal-500/10 rounded-lg p-4 border border-green-500/20 mb-4">
          <div className="space-y-3">
            <div>
              <p className="text-green-400 font-mono text-sm mb-1">rth Moment About the Origin</p>
              <p className="text-white font-mono text-sm">E(X<sup>r</sup>) = &Sigma; x<sup>r</sup> f(x)</p>
            </div>
            <div>
              <p className="text-green-400 font-mono text-sm mb-1">rth Factorial Moment</p>
              <p className="text-white font-mono text-sm">E[(X)<sub>r</sub>] = E[X(X-1)(X-2)&middot;&middot;&middot;(X-r+1)]</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-4">
          <p className="text-sm text-slate-400 mb-2">Variance via factorial moment:</p>
          <p className="text-white font-mono text-sm mb-1">
            E[X(X-1)] = E(X&sup2;) - E(X)
          </p>
          <p className="text-white font-mono text-sm">
            &sigma;&sup2; = E[X(X-1)] + E(X) - [E(X)]&sup2;
          </p>
        </div>
      </section>

      {/* 7. Moment-Generating Function */}
      <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-4">7. Moment-Generating Function (MGF)</h2>
        <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-lg p-4 border border-red-500/20 mb-4">
          <p className="text-red-400 font-mono text-sm mb-2">Definition 2.3-1</p>
          <p className="text-white font-mono">
            M(t) = E(e<sup>tX</sup>) = &Sigma; e<sup>tx</sup> f(x)
          </p>
          <p className="text-slate-400 text-sm mt-2">
            Exists for -h {'<'} t {'<'} h for some h {'>'} 0.
          </p>
        </div>
        <div className="space-y-3">
          <div className="bg-slate-700/50 rounded-lg p-4">
            <p className="text-sm text-slate-400 mb-2">Key Properties</p>
            <ul className="text-white font-mono text-sm space-y-1 list-disc list-inside">
              <li>M(0) = 1</li>
              <li>M&prime;(0) = E(X) = &mu;</li>
              <li>M&Prime;(0) = E(X&sup2;)</li>
              <li>M<sup>(r)</sup>(0) = E(X<sup>r</sup>)</li>
              <li>&sigma;&sup2; = M&Prime;(0) - [M&prime;(0)]&sup2;</li>
            </ul>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <p className="text-yellow-400 font-semibold text-sm mb-2">Uniqueness Property (Exam Important!)</p>
            <p className="text-slate-300 text-sm">
              If two random variables have the same MGF, they have the <span className="text-yellow-400 font-semibold">same distribution</span>.
              The MGF uniquely determines the distribution.
            </p>
          </div>
        </div>
      </section>

      {/* 8. MGF Examples */}
      <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-4">8. MGF Examples</h2>
        <div className="space-y-4">
          <div className="bg-slate-700/50 rounded-lg p-4">
            <p className="text-sm text-slate-400 mb-2">Example 2.3-5: Read off the PMF</p>
            <p className="text-white font-mono text-sm mb-1">
              M(t) = (3/6)e<sup>t</sup> + (2/6)e<sup>2t</sup> + (1/6)e<sup>3t</sup>
            </p>
            <p className="text-slate-300 text-sm">
              Coefficients of e<sup>bi·t</sup> give P(X = b<sub>i</sub>): f(1) = 3/6, f(2) = 2/6, f(3) = 1/6
            </p>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-4">
            <p className="text-sm text-slate-400 mb-2">Example 2.3-7: Geometric MGF</p>
            <p className="text-white font-mono text-sm mb-1">
              f(x) = q<sup>x-1</sup>p, x = 1, 2, 3, ...
            </p>
            <p className="text-white font-mono text-sm mb-1">
              M(t) = pe<sup>t</sup> / (1 - qe<sup>t</sup>), &nbsp; t {'<'} -ln(q)
            </p>
            <p className="text-white font-mono text-sm">
              M&prime;(0) = 1/p = &mu;, &nbsp; &sigma;&sup2; = q/p&sup2;
            </p>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-4">
            <p className="text-sm text-slate-400 mb-2">Hypergeometric Variance (Ex 2.3-4)</p>
            <p className="text-white font-mono text-sm">
              &sigma;&sup2; = n(N₁/N)(N₂/N)[(N-n)/(N-1)] = np(1-p)[(N-n)/(N-1)]
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ─── SIMULATE TAB ─── */
function SimulateContent() {
  return (
    <div className="space-y-8 pb-20">
      <VarianceCalculator />
    </div>
  );
}
