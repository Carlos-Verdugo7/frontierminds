'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import DistributionComparator from '@/components/DistributionComparator';
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

      {/* 1. WHY WE NEED VARIANCE — the story hook */}
      <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-4">1. Why the Mean Isn&apos;t Enough</h2>
        <p className="text-slate-300 mb-4">
          Imagine two carnival games. Both cost $5 to play:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-5">
            <p className="text-blue-400 font-semibold text-lg mb-2">Game A: &quot;The Sure Thing&quot;</p>
            <p className="text-slate-300 text-sm mb-3">You always win exactly $5 back.</p>
            <p className="text-white font-mono text-sm">Average payout = <span className="text-yellow-400">$5.00</span></p>
          </div>
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-5">
            <p className="text-orange-400 font-semibold text-lg mb-2">Game B: &quot;The Coin Flip&quot;</p>
            <p className="text-slate-300 text-sm mb-3">Flip a coin: Heads = $10, Tails = $0.</p>
            <p className="text-white font-mono text-sm">Average payout = <span className="text-yellow-400">$5.00</span></p>
          </div>
        </div>
        <p className="text-slate-300 mb-3">
          Both games have the <span className="text-yellow-400 font-semibold">same average payout</span> (&mu; = $5).
          But they <em>feel</em> completely different. Game A is safe. Game B is risky — you might walk away
          with nothing or double your money.
        </p>
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
          <p className="text-purple-300 text-sm">
            <span className="font-semibold">The mean tells you the center.</span> But it says nothing about
            how spread out the outcomes are. We need a new number that captures this &quot;spread&quot; or &quot;risk.&quot;
            That number is the <span className="text-purple-400 font-bold">variance</span>.
          </p>
        </div>
      </section>

      {/* 2. BUILDING INTUITION — what spread looks like */}
      <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-4">2. What Does &quot;Spread&quot; Look Like?</h2>
        <p className="text-slate-300 mb-4">
          Picture dots on a number line. Each dot is a possible outcome, and its size represents
          its probability. The <span className="text-yellow-400 font-semibold">mean &mu;</span> is the balance point.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-slate-700/50 rounded-lg p-4">
            <p className="text-green-400 font-semibold text-sm mb-3">Low spread: values cluster near &mu;</p>
            {/* Simple visual: dots close together */}
            <div className="relative h-12 bg-slate-800 rounded-lg">
              <div className="absolute inset-x-0 top-1/2 h-px bg-slate-600" />
              {/* Dots clustered */}
              {[
                { pos: 38, size: 10 },
                { pos: 46, size: 16 },
                { pos: 50, size: 20 },
                { pos: 54, size: 16 },
                { pos: 62, size: 10 },
              ].map((d, i) => (
                <div key={i} className="absolute top-1/2 -translate-y-1/2 rounded-full bg-green-400"
                  style={{ left: `${d.pos}%`, width: d.size, height: d.size, marginLeft: -d.size/2 }} />
              ))}
              {/* mu marker */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 text-yellow-400 text-[10px] font-mono">
                &mu;
              </div>
            </div>
            <p className="text-slate-400 text-xs mt-2 text-center">Small variance</p>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-4">
            <p className="text-red-400 font-semibold text-sm mb-3">High spread: values are far from &mu;</p>
            {/* Dots far apart */}
            <div className="relative h-12 bg-slate-800 rounded-lg">
              <div className="absolute inset-x-0 top-1/2 h-px bg-slate-600" />
              {[
                { pos: 10, size: 14 },
                { pos: 30, size: 10 },
                { pos: 50, size: 10 },
                { pos: 70, size: 10 },
                { pos: 90, size: 14 },
              ].map((d, i) => (
                <div key={i} className="absolute top-1/2 -translate-y-1/2 rounded-full bg-red-400"
                  style={{ left: `${d.pos}%`, width: d.size, height: d.size, marginLeft: -d.size/2 }} />
              ))}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 text-yellow-400 text-[10px] font-mono">
                &mu;
              </div>
            </div>
            <p className="text-slate-400 text-xs mt-2 text-center">Large variance</p>
          </div>
        </div>
        <p className="text-slate-300 text-sm">
          Variance answers: <span className="text-white font-semibold">&quot;On average, how far are the outcomes from the mean?&quot;</span> (Specifically,
          the average <em>squared</em> distance — we&apos;ll see why squared in a moment.)
        </p>
      </section>

      {/* 3. THE FORMULA — derived from the intuition */}
      <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-4">3. Building the Variance Formula Step by Step</h2>
        <p className="text-slate-300 mb-4">
          Let&apos;s measure spread systematically. We want to know &quot;how far is each outcome from the mean?&quot;
        </p>

        <div className="space-y-4">
          {/* Step 1 */}
          <div className="bg-slate-700/50 rounded-lg p-4">
            <p className="text-green-400 font-semibold text-sm mb-2">Step 1: Distance from the mean</p>
            <p className="text-slate-300 text-sm mb-2">
              For each outcome x, the distance from &mu; is: <span className="text-white font-mono">(x - &mu;)</span>
            </p>
            <p className="text-slate-400 text-xs">
              Problem: Some distances are positive (x {'>'} &mu;) and some are negative (x {'<'} &mu;).
              If we just average them, they cancel out and we always get zero. Not helpful!
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-slate-700/50 rounded-lg p-4">
            <p className="text-blue-400 font-semibold text-sm mb-2">Step 2: Square the distances</p>
            <p className="text-slate-300 text-sm mb-2">
              Squaring makes all distances positive: <span className="text-white font-mono">(x - &mu;)&sup2;</span>
            </p>
            <p className="text-slate-400 text-xs">
              Now big deviations (far from the mean) get amplified, which is exactly what we want —
              an outcome 4 units away contributes 16 to variance, not just 4.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-slate-700/50 rounded-lg p-4">
            <p className="text-purple-400 font-semibold text-sm mb-2">Step 3: Weight by probability and add up</p>
            <p className="text-slate-300 text-sm mb-2">
              Multiply each squared distance by its probability, then sum everything:
            </p>
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg p-4 border border-purple-500/20">
              <p className="text-white font-mono text-center">
                &sigma;&sup2; = &Sigma; (x - &mu;)&sup2; &middot; f(x)
              </p>
            </div>
            <p className="text-slate-400 text-xs mt-2">
              This is the <span className="text-purple-400 font-semibold">variance</span>: the average squared distance from the mean, weighted by probability.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-slate-700/50 rounded-lg p-4">
            <p className="text-cyan-400 font-semibold text-sm mb-2">Step 4: Standard deviation undoes the squaring</p>
            <p className="text-slate-300 text-sm">
              Since we squared the distances, variance is in &quot;squared units.&quot; To get back to the
              original units, take the square root. This is the{' '}
              <span className="text-cyan-400 font-semibold">standard deviation</span>:
            </p>
            <p className="text-white font-mono text-center mt-2">
              &sigma; = &radic;&sigma;&sup2;
            </p>
          </div>
        </div>
      </section>

      {/* 4. WORKED EXAMPLE — walked through conversationally */}
      <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-4">4. Worked Example: A Loaded Die</h2>
        <p className="text-slate-300 mb-4">
          A weighted game piece has outcomes 1, 2, 3 with probabilities 3/6, 2/6, 1/6.
          Let&apos;s compute the variance.
        </p>
        <div className="space-y-3">
          <div className="bg-slate-700/50 rounded-lg p-4">
            <p className="text-yellow-400 font-semibold text-sm mb-2">First, find the mean:</p>
            <p className="text-white font-mono text-sm">
              &mu; = 1(3/6) + 2(2/6) + 3(1/6) = 10/6 = 5/3 &asymp; 1.667
            </p>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-4">
            <p className="text-purple-400 font-semibold text-sm mb-2">Now compute each squared distance times probability:</p>
            <table className="w-full text-sm mb-2">
              <thead>
                <tr className="text-slate-400 border-b border-slate-600">
                  <th className="text-center py-1">x</th>
                  <th className="text-center py-1">x - &mu;</th>
                  <th className="text-center py-1">(x - &mu;)&sup2;</th>
                  <th className="text-center py-1">f(x)</th>
                  <th className="text-center py-1">(x-&mu;)&sup2; &middot; f(x)</th>
                </tr>
              </thead>
              <tbody className="text-white font-mono text-xs">
                <tr className="border-b border-slate-700/50">
                  <td className="text-center py-1">1</td>
                  <td className="text-center py-1">-2/3</td>
                  <td className="text-center py-1 text-blue-400">4/9</td>
                  <td className="text-center py-1">3/6</td>
                  <td className="text-center py-1 text-purple-400">12/54</td>
                </tr>
                <tr className="border-b border-slate-700/50">
                  <td className="text-center py-1">2</td>
                  <td className="text-center py-1">+1/3</td>
                  <td className="text-center py-1 text-blue-400">1/9</td>
                  <td className="text-center py-1">2/6</td>
                  <td className="text-center py-1 text-purple-400">2/54</td>
                </tr>
                <tr>
                  <td className="text-center py-1">3</td>
                  <td className="text-center py-1">+4/3</td>
                  <td className="text-center py-1 text-blue-400">16/9</td>
                  <td className="text-center py-1">1/6</td>
                  <td className="text-center py-1 text-purple-400">16/54</td>
                </tr>
              </tbody>
            </table>
            <p className="text-white font-mono text-sm">
              &sigma;&sup2; = 12/54 + 2/54 + 16/54 = 30/54 = <span className="text-yellow-400">5/9 &asymp; 0.556</span>
            </p>
            <p className="text-white font-mono text-sm mt-1">
              &sigma; = &radic;(5/9) &asymp; <span className="text-yellow-400">0.745</span>
            </p>
          </div>
          <p className="text-slate-400 text-sm">
            On average, outcomes are about 0.745 units away from the mean of 1.667.
          </p>
        </div>
      </section>

      {/* 5. THE SHORTCUT — presented as a discovery */}
      <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-4">5. A Shortcut That Saves Real Time</h2>
        <p className="text-slate-300 mb-4">
          Computing (x - &mu;) for every value gets tedious, especially when &mu; is a fraction.
          There&apos;s a much faster way. Here&apos;s the algebra trick:
        </p>
        <div className="bg-slate-700/50 rounded-lg p-4 mb-4">
          <p className="text-slate-400 text-xs mb-2">Start with the definition and expand:</p>
          <div className="space-y-1 text-white font-mono text-sm">
            <p>&sigma;&sup2; = E[(X - &mu;)&sup2;]</p>
            <p className="text-slate-400">&nbsp;&nbsp; = E[X&sup2; - 2&mu;X + &mu;&sup2;]</p>
            <p className="text-slate-400">&nbsp;&nbsp; = E(X&sup2;) - 2&mu;E(X) + &mu;&sup2;</p>
            <p className="text-slate-400">&nbsp;&nbsp; = E(X&sup2;) - 2&mu;&sup2; + &mu;&sup2;</p>
            <p>&nbsp;&nbsp; = <span className="text-yellow-400">E(X&sup2;) - &mu;&sup2;</span></p>
          </div>
        </div>
        <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg p-4 border border-yellow-500/20 mb-4">
          <p className="text-yellow-400 font-mono text-sm mb-2">The Shortcut (memorize this!)</p>
          <p className="text-white font-mono text-lg text-center">
            &sigma;&sup2; = E(X&sup2;) - [E(X)]&sup2;
          </p>
          <p className="text-slate-400 text-xs mt-2 text-center">
            &quot;The mean of the square minus the square of the mean.&quot;
          </p>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-4">
          <p className="text-sm text-slate-400 mb-2">Verify with our loaded die example:</p>
          <p className="text-white font-mono text-sm mb-1">
            E(X&sup2;) = 1&sup2;(3/6) + 2&sup2;(2/6) + 3&sup2;(1/6) = (3 + 8 + 9)/6 = 20/6
          </p>
          <p className="text-white font-mono text-sm">
            &sigma;&sup2; = 20/6 - (5/3)&sup2; = 20/6 - 25/9 = (60 - 50)/18 = 10/18 = <span className="text-yellow-400">5/9</span> ✓
          </p>
          <p className="text-green-400 text-xs mt-2">Same answer, but we never had to compute (x - &mu;) for each row!</p>
        </div>
      </section>

      {/* 6. SD MEASURES SPREAD — concrete comparison */}
      <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-4">6. Seeing Standard Deviation in Action</h2>
        <p className="text-slate-300 mb-4">
          Two distributions, both centered at 0, but with different spreads:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-5">
            <p className="text-blue-400 font-semibold mb-2">X: values {'{-1, 0, 1}'}</p>
            <p className="text-slate-300 text-sm mb-2">Each equally likely (probability 1/3)</p>
            <p className="text-white font-mono text-sm">&mu; = 0</p>
            <p className="text-white font-mono text-sm">&sigma;&sup2; = 2/3</p>
            <p className="text-white font-mono text-sm">&sigma; = &radic;(2/3) &asymp; <span className="text-blue-400">0.816</span></p>
          </div>
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-5">
            <p className="text-orange-400 font-semibold mb-2">Y: values {'{-2, 0, 2}'}</p>
            <p className="text-slate-300 text-sm mb-2">Each equally likely (probability 1/3)</p>
            <p className="text-white font-mono text-sm">&mu; = 0</p>
            <p className="text-white font-mono text-sm">&sigma;&sup2; = 8/3</p>
            <p className="text-white font-mono text-sm">&sigma; = 2&radic;(2/3) &asymp; <span className="text-orange-400">1.633</span></p>
          </div>
        </div>
        <p className="text-slate-300 mb-3">
          Y = 2X — every value is doubled. The standard deviation also doubles: &sigma;<sub>Y</sub> = 2&sigma;<sub>X</sub>.
          The variance <em>quadruples</em>: &sigma;&sup2;<sub>Y</sub> = 4&sigma;&sup2;<sub>X</sub>.
        </p>
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-4 border border-blue-500/20">
          <p className="text-blue-400 font-mono text-sm mb-2">General rule: Y = aX + b</p>
          <div className="space-y-1 text-white font-mono text-sm">
            <p>&mu;<sub>Y</sub> = a&mu;<sub>X</sub> + b &nbsp;&nbsp;<span className="text-slate-400">(shifting and scaling moves the center)</span></p>
            <p>&sigma;&sup2;<sub>Y</sub> = a&sup2;&sigma;&sup2;<sub>X</sub> &nbsp;&nbsp;<span className="text-slate-400">(only scaling affects spread — adding b does nothing!)</span></p>
            <p>&sigma;<sub>Y</sub> = |a|&sigma;<sub>X</sub></p>
          </div>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-4 mt-3">
          <p className="text-slate-400 text-sm mb-1">Why doesn&apos;t adding a constant change variance?</p>
          <p className="text-slate-300 text-sm">
            Think about it: if you add 100 to every outcome, the mean also shifts by 100.
            Every outcome is <em>still the same distance</em> from the new mean.
            Nothing about the spread changed — you just slid everything along the number line.
          </p>
        </div>
      </section>

      {/* 7. FAIR DIE — classic example */}
      <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-4">7. Classic Example: Fair Six-Sided Die</h2>
        <p className="text-slate-300 mb-3">
          f(x) = 1/6 for x = 1, 2, 3, 4, 5, 6. For the uniform distribution on {'{1, ..., m}'}:
        </p>
        <div className="bg-gradient-to-r from-green-500/10 to-teal-500/10 rounded-lg p-4 border border-green-500/20 mb-4">
          <p className="text-green-400 font-mono text-sm mb-2">Uniform {'{1, ..., m}'} Formulas</p>
          <div className="space-y-1 text-white font-mono text-sm">
            <p>&mu; = (m + 1) / 2</p>
            <p>&sigma;&sup2; = (m&sup2; - 1) / 12</p>
          </div>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-4">
          <p className="text-slate-400 text-sm mb-2">For m = 6 (a fair die):</p>
          <p className="text-white font-mono text-sm mb-1">&mu; = 7/2 = 3.5</p>
          <p className="text-white font-mono text-sm mb-1">&sigma;&sup2; = (36 - 1)/12 = <span className="text-yellow-400">35/12 &asymp; 2.917</span></p>
          <p className="text-white font-mono text-sm">&sigma; = &radic;(35/12) &asymp; <span className="text-yellow-400">1.708</span></p>
        </div>
      </section>

      {/* 8. MOMENTS & FACTORIAL MOMENTS */}
      <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-4">8. Moments: A Family of Summaries</h2>
        <p className="text-slate-300 mb-4">
          The mean is the &quot;first moment&quot; and variance uses the &quot;second moment.&quot;
          In general, the <span className="text-green-400 font-semibold">rth moment about the origin</span> is:
        </p>
        <div className="bg-slate-700/50 rounded-lg p-4 mb-4">
          <p className="text-white font-mono text-sm">E(X<sup>r</sup>) = &Sigma; x<sup>r</sup> &middot; f(x)</p>
          <p className="text-slate-400 text-xs mt-2">
            r = 1 gives E(X) = &mu;. &nbsp; r = 2 gives E(X&sup2;), which we need for the variance shortcut.
          </p>
        </div>

        <p className="text-slate-300 mb-3">
          There&apos;s also a <span className="text-green-400 font-semibold">factorial moment</span> trick that
          can simplify certain variance calculations:
        </p>
        <div className="bg-slate-700/50 rounded-lg p-4 mb-4">
          <p className="text-green-400 font-mono text-xs mb-2">Second factorial moment</p>
          <p className="text-white font-mono text-sm mb-1">E[X(X - 1)] = E(X&sup2;) - E(X)</p>
          <p className="text-slate-400 text-xs mt-2">
            So: &sigma;&sup2; = E[X(X - 1)] + E(X) - &mu;&sup2;
          </p>
        </div>

        <div className="bg-slate-700/50 rounded-lg p-4">
          <p className="text-slate-400 text-xs mb-2">Hypergeometric variance (via factorial moments)</p>
          <p className="text-white font-mono text-sm">
            &sigma;&sup2; = n(N₁/N)(N₂/N)[(N-n)/(N-1)] = np(1-p)[(N-n)/(N-1)]
          </p>
          <p className="text-slate-400 text-xs mt-2">
            The factor (N-n)/(N-1) is called the &quot;finite population correction.&quot; It makes variance smaller
            than what you&apos;d get with replacement, because sampling without replacement reduces variability.
          </p>
        </div>
      </section>

      {/* 9. MGF — motivated as a power tool */}
      <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-4">9. The Moment-Generating Function (MGF)</h2>
        <p className="text-slate-300 mb-4">
          What if there was a single function that packaged the <em>entire distribution</em> into one formula —
          and you could extract any moment just by taking derivatives?
        </p>
        <p className="text-slate-300 mb-4">
          That&apos;s exactly what the <span className="text-red-400 font-semibold">moment-generating function</span> does.
        </p>
        <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-lg p-4 border border-red-500/20 mb-4">
          <p className="text-red-400 font-mono text-sm mb-2">Definition</p>
          <p className="text-white font-mono text-center text-lg">
            M(t) = E(e<sup>tX</sup>) = &Sigma; e<sup>tx</sup> f(x)
          </p>
        </div>

        <p className="text-slate-300 mb-3">Here&apos;s the magic — the derivatives at t = 0 give you the moments:</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <div className="bg-slate-700/50 rounded-lg p-3 text-center">
            <p className="text-slate-400 text-xs mb-1">Plug in t = 0</p>
            <p className="text-white font-mono text-sm">M(0) = 1</p>
            <p className="text-slate-500 text-xs mt-1">Always equals 1</p>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-3 text-center">
            <p className="text-slate-400 text-xs mb-1">First derivative</p>
            <p className="text-white font-mono text-sm">M&prime;(0) = E(X) = &mu;</p>
            <p className="text-slate-500 text-xs mt-1">Gives the mean</p>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-3 text-center">
            <p className="text-slate-400 text-xs mb-1">Second derivative</p>
            <p className="text-white font-mono text-sm">M&Prime;(0) = E(X&sup2;)</p>
            <p className="text-slate-500 text-xs mt-1">Then: &sigma;&sup2; = M&Prime;(0) - [M&prime;(0)]&sup2;</p>
          </div>
        </div>

        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-4">
          <p className="text-yellow-400 font-semibold text-sm mb-2">The Uniqueness Property (Exam Important!)</p>
          <p className="text-slate-300 text-sm">
            If two random variables have the <span className="text-yellow-400 font-semibold">same MGF</span>, they must have
            the <span className="text-yellow-400 font-semibold">same distribution</span>. The MGF is like a fingerprint —
            it uniquely identifies the distribution. This will be very useful when we prove things about
            sums of random variables later.
          </p>
        </div>

        {/* Concrete MGF example */}
        <div className="bg-slate-700/50 rounded-lg p-4 mb-4">
          <p className="text-slate-400 text-sm mb-2">Example: Reading a PMF from an MGF</p>
          <p className="text-white font-mono text-sm mb-2">
            M(t) = (3/6)e<sup>t</sup> + (2/6)e<sup>2t</sup> + (1/6)e<sup>3t</sup>
          </p>
          <p className="text-slate-300 text-sm">
            The coefficient of e<sup>xt</sup> is f(x). So: f(1) = 3/6, f(2) = 2/6, f(3) = 1/6.
            It&apos;s our loaded die distribution, encoded in one formula!
          </p>
        </div>

        <div className="bg-slate-700/50 rounded-lg p-4">
          <p className="text-slate-400 text-sm mb-2">Geometric distribution MGF and variance</p>
          <p className="text-white font-mono text-sm mb-1">
            f(x) = q<sup>x-1</sup>p, &nbsp; x = 1, 2, 3, ...
          </p>
          <p className="text-white font-mono text-sm mb-1">
            M(t) = pe<sup>t</sup> / (1 - qe<sup>t</sup>)
          </p>
          <p className="text-white font-mono text-sm">
            Differentiating gives: &mu; = 1/p, &nbsp; &sigma;&sup2; = q/p&sup2;
          </p>
          <p className="text-slate-400 text-xs mt-2">
            For example, if p = 1/6 (rolling a 6): &mu; = 6 trials on average, &sigma;&sup2; = (5/6)/(1/36) = 30, &sigma; &asymp; 5.48.
          </p>
        </div>
      </section>

      {/* 10. EXAM CHEAT SHEET */}
      <section className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-xl p-6 border border-yellow-500/20">
        <h2 className="text-xl font-bold text-white mb-4">Quick Reference: Key Formulas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-slate-800/80 rounded-lg p-3">
            <p className="text-yellow-400 font-mono text-xs mb-1">Variance (definition)</p>
            <p className="text-white font-mono text-sm">&sigma;&sup2; = &Sigma;(x - &mu;)&sup2; f(x)</p>
          </div>
          <div className="bg-slate-800/80 rounded-lg p-3">
            <p className="text-yellow-400 font-mono text-xs mb-1">Variance (shortcut)</p>
            <p className="text-white font-mono text-sm">&sigma;&sup2; = E(X&sup2;) - &mu;&sup2;</p>
          </div>
          <div className="bg-slate-800/80 rounded-lg p-3">
            <p className="text-blue-400 font-mono text-xs mb-1">Linear transform</p>
            <p className="text-white font-mono text-sm">Var(aX + b) = a&sup2;Var(X)</p>
          </div>
          <div className="bg-slate-800/80 rounded-lg p-3">
            <p className="text-blue-400 font-mono text-xs mb-1">Uniform {'{1,...,m}'}</p>
            <p className="text-white font-mono text-sm">&sigma;&sup2; = (m&sup2; - 1)/12</p>
          </div>
          <div className="bg-slate-800/80 rounded-lg p-3">
            <p className="text-green-400 font-mono text-xs mb-1">Geometric variance</p>
            <p className="text-white font-mono text-sm">&sigma;&sup2; = q/p&sup2;</p>
          </div>
          <div className="bg-slate-800/80 rounded-lg p-3">
            <p className="text-green-400 font-mono text-xs mb-1">Hypergeometric variance</p>
            <p className="text-white font-mono text-sm">&sigma;&sup2; = np(1-p)(N-n)/(N-1)</p>
          </div>
          <div className="bg-slate-800/80 rounded-lg p-3">
            <p className="text-red-400 font-mono text-xs mb-1">MGF</p>
            <p className="text-white font-mono text-sm">M(t) = E(e<sup>tX</sup>)</p>
          </div>
          <div className="bg-slate-800/80 rounded-lg p-3">
            <p className="text-red-400 font-mono text-xs mb-1">Moments from MGF</p>
            <p className="text-white font-mono text-sm">M<sup>(r)</sup>(0) = E(X<sup>r</sup>)</p>
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
      <DistributionComparator />
      <VarianceCalculator />
    </div>
  );
}
