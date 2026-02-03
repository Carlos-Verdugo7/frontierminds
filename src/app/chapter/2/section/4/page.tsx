'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Play, Target, ChevronRight, ChevronLeft } from 'lucide-react';
import BinomialSimulator from '@/components/BinomialSimulator';
import PracticeProblems from '@/components/PracticeProblems';

type TabType = 'learn' | 'simulate' | 'practice';

export default function Section24Page() {
  const [activeTab, setActiveTab] = useState<TabType>('learn');
  const [learnSection, setLearnSection] = useState(0);

  const learnSections = [
    // Section 0: The Story Setup
    {
      title: 'The Free-Throw Challenge',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl p-6 border border-green-500/30">
            <h3 className="text-2xl font-bold text-white mb-4">🏀 A Basketball Story</h3>
            <p className="text-slate-300 text-lg leading-relaxed">
              Imagine a basketball player who makes <span className="text-green-400 font-bold">70% of their free throws</span>.
              They step up to shoot <span className="text-blue-400 font-bold">10 free throws</span> in a row.
            </p>
            <p className="text-slate-300 text-lg leading-relaxed mt-4">
              Here's what we want to know:
            </p>
            <ul className="text-slate-300 mt-4 space-y-2">
              <li>• What's the probability they make exactly 7 shots?</li>
              <li>• What's the probability they make at least 8?</li>
              <li>• On average, how many will they make?</li>
            </ul>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h4 className="text-lg font-semibold text-white mb-4">This is the Binomial Distribution!</h4>
            <p className="text-slate-300">
              Whenever you have a fixed number of independent trials, each with the same success probability,
              and you're counting successes — that's the <span className="text-green-400 font-bold">Binomial Distribution</span>.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="bg-slate-700/50 rounded-lg p-4">
                <p className="text-sm text-green-400 font-mono mb-1">n = 10</p>
                <p className="text-slate-400 text-sm">Number of trials (shots)</p>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-4">
                <p className="text-sm text-blue-400 font-mono mb-1">p = 0.70</p>
                <p className="text-slate-400 text-sm">Success probability</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <p className="text-yellow-200 text-sm">
              <strong>Real-world examples:</strong> Coin flips, quality control (defective items),
              medical trials (patients who respond), survey responses (yes/no), exam questions (correct/wrong)...
            </p>
          </div>
        </div>
      ),
    },

    // Section 1: Bernoulli - The Building Block
    {
      title: 'Bernoulli: The Single Trial',
      content: (
        <div className="space-y-6">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">Before Binomial, Meet Bernoulli</h3>
            <p className="text-slate-300 mb-4">
              A <span className="text-green-400 font-bold">Bernoulli trial</span> is the simplest possible random experiment:
            </p>
            <div className="flex gap-4 justify-center my-6">
              <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-6 text-center">
                <div className="text-4xl mb-2">✓</div>
                <p className="text-green-400 font-bold">Success</p>
                <p className="text-slate-400 text-sm">X = 1</p>
                <p className="text-slate-400 text-sm">Probability: p</p>
              </div>
              <div className="text-4xl text-slate-500 flex items-center">or</div>
              <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-6 text-center">
                <div className="text-4xl mb-2">✗</div>
                <p className="text-red-400 font-bold">Failure</p>
                <p className="text-slate-400 text-sm">X = 0</p>
                <p className="text-slate-400 text-sm">Probability: 1 - p = q</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-purple-500/30">
            <h4 className="text-lg font-semibold text-white mb-4">The Bernoulli PMF</h4>
            <p className="text-slate-300 mb-4">We can write both cases in one elegant formula:</p>
            <div className="bg-slate-900/80 rounded-lg p-4 text-center">
              <p className="text-2xl font-mono text-white">
                f(x) = p<sup>x</sup>(1-p)<sup>1-x</sup> , x ∈ {'{'}0, 1{'}'}
              </p>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-sm text-slate-400">When x = 1 (success):</p>
                <p className="text-green-400 font-mono">f(1) = p¹ · q⁰ = p</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-sm text-slate-400">When x = 0 (failure):</p>
                <p className="text-red-400 font-mono">f(0) = p⁰ · q¹ = q</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h4 className="text-lg font-semibold text-white mb-4">Bernoulli Mean and Variance</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
                <p className="text-sm text-slate-400 mb-2">Mean (Expected Value)</p>
                <p className="text-2xl font-mono text-green-400">μ = p</p>
                <p className="text-xs text-slate-500 mt-2">E[X] = 0·q + 1·p = p</p>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 text-center">
                <p className="text-sm text-slate-400 mb-2">Variance</p>
                <p className="text-2xl font-mono text-purple-400">σ² = pq</p>
                <p className="text-xs text-slate-500 mt-2">= p(1-p)</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm mt-4 text-center">
              Notice: Variance is maximized when p = 0.5 (most uncertain)
            </p>
          </div>
        </div>
      ),
    },

    // Section 2: From One Trial to Many
    {
      title: 'From One Trial to Many',
      content: (
        <div className="space-y-6">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">Building Up to Binomial</h3>
            <p className="text-slate-300 mb-4">
              Now let's do <span className="text-blue-400 font-bold">n independent Bernoulli trials</span>,
              each with the same success probability p.
            </p>
            <p className="text-slate-300">
              Let X = total number of successes. Then X follows a <span className="text-green-400 font-bold">Binomial Distribution</span>.
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-500/20 to-green-500/20 rounded-xl p-6 border border-blue-500/30">
            <h4 className="text-lg font-semibold text-white mb-4">Visual: 5 Coin Flips (p = 0.5)</h4>
            <p className="text-slate-300 mb-4">Here are all possible outcomes for n = 5 trials:</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-600">
                    <th className="text-left text-slate-400 py-2">X (successes)</th>
                    <th className="text-left text-slate-400 py-2">Ways to get X</th>
                    <th className="text-left text-slate-400 py-2">Count = C(5,X)</th>
                    <th className="text-left text-slate-400 py-2">P(X)</th>
                  </tr>
                </thead>
                <tbody className="text-slate-300">
                  <tr className="border-b border-slate-700">
                    <td className="py-2">0</td>
                    <td className="font-mono text-xs">FFFFF</td>
                    <td>C(5,0) = 1</td>
                    <td className="text-green-400">1/32</td>
                  </tr>
                  <tr className="border-b border-slate-700">
                    <td className="py-2">1</td>
                    <td className="font-mono text-xs">SFFFF, FSFFF, FFSFF, FFFSF, FFFFS</td>
                    <td>C(5,1) = 5</td>
                    <td className="text-green-400">5/32</td>
                  </tr>
                  <tr className="border-b border-slate-700">
                    <td className="py-2">2</td>
                    <td className="font-mono text-xs">SSFFF, SFSFF, ... (10 ways)</td>
                    <td>C(5,2) = 10</td>
                    <td className="text-green-400">10/32</td>
                  </tr>
                  <tr className="border-b border-slate-700">
                    <td className="py-2">3</td>
                    <td className="font-mono text-xs">SSSFF, SSFFS, ... (10 ways)</td>
                    <td>C(5,3) = 10</td>
                    <td className="text-green-400">10/32</td>
                  </tr>
                  <tr className="border-b border-slate-700">
                    <td className="py-2">4</td>
                    <td className="font-mono text-xs">SSSSF, SSSFS, SSFSS, SFSSS, FSSSS</td>
                    <td>C(5,4) = 5</td>
                    <td className="text-green-400">5/32</td>
                  </tr>
                  <tr>
                    <td className="py-2">5</td>
                    <td className="font-mono text-xs">SSSSS</td>
                    <td>C(5,5) = 1</td>
                    <td className="text-green-400">1/32</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <p className="text-yellow-200">
              <strong>Key Insight:</strong> The number of ways to get exactly x successes in n trials is the
              combination <span className="font-mono">C(n, x)</span> — this is why combinations appear in the binomial formula!
            </p>
          </div>
        </div>
      ),
    },

    // Section 3: The Binomial PMF
    {
      title: 'The Binomial PMF Formula',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl p-6 border border-green-500/30">
            <h3 className="text-xl font-bold text-white mb-4">The Formula</h3>
            <p className="text-slate-300 mb-4">For X ~ Binomial(n, p), the probability of exactly x successes is:</p>
            <div className="bg-slate-900/80 rounded-lg p-6 text-center">
              <p className="text-3xl font-mono text-white">
                f(x) = C(n, x) · p<sup>x</sup> · (1-p)<sup>n-x</sup>
              </p>
              <p className="text-slate-400 mt-2">for x = 0, 1, 2, ..., n</p>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h4 className="text-lg font-semibold text-white mb-4">Understanding Each Piece</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="bg-purple-500/20 rounded-lg px-4 py-2 text-purple-400 font-mono shrink-0">C(n, x)</div>
                <div>
                  <p className="text-slate-300">Number of ways to choose which x trials are successes</p>
                  <p className="text-slate-500 text-sm">"In which positions do the successes occur?"</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-green-500/20 rounded-lg px-4 py-2 text-green-400 font-mono shrink-0">p<sup>x</sup></div>
                <div>
                  <p className="text-slate-300">Probability of x successes happening</p>
                  <p className="text-slate-500 text-sm">Each success has probability p, and we need x of them</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-red-500/20 rounded-lg px-4 py-2 text-red-400 font-mono shrink-0">(1-p)<sup>n-x</sup></div>
                <div>
                  <p className="text-slate-300">Probability of (n-x) failures happening</p>
                  <p className="text-slate-500 text-sm">Each failure has probability q = 1-p, and we need n-x of them</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-blue-400 mb-4">Example: Free Throws</h4>
            <p className="text-slate-300 mb-4">
              Player makes 70% of free throws. In 10 attempts, P(exactly 7 makes)?
            </p>
            <div className="bg-slate-900/80 rounded-lg p-4 font-mono text-sm">
              <p className="text-slate-400">P(X = 7) = C(10, 7) × 0.7⁷ × 0.3³</p>
              <p className="text-slate-400 mt-2">= 120 × 0.0823543 × 0.027</p>
              <p className="text-green-400 mt-2">= 0.2668 ≈ 26.7%</p>
            </div>
          </div>
        </div>
      ),
    },

    // Section 4: Mean and Variance
    {
      title: 'Mean and Variance of Binomial',
      content: (
        <div className="space-y-6">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">The Beautiful Simplicity</h3>
            <p className="text-slate-300 mb-4">
              Since Binomial is just the sum of n independent Bernoulli trials,
              the mean and variance have elegant forms:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-xl p-6 border border-green-500/30 text-center">
                <p className="text-sm text-slate-400 mb-2">Mean (Expected Successes)</p>
                <p className="text-4xl font-mono text-green-400 mb-2">μ = np</p>
                <p className="text-slate-400 text-sm">Average of n × (average of one trial)</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-xl p-6 border border-purple-500/30 text-center">
                <p className="text-sm text-slate-400 mb-2">Variance</p>
                <p className="text-4xl font-mono text-purple-400 mb-2">σ² = np(1-p)</p>
                <p className="text-slate-400 text-sm">= npq (where q = 1-p)</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-500/20 to-green-500/20 rounded-xl p-6 border border-blue-500/30">
            <h4 className="text-lg font-semibold text-white mb-4">Why These Formulas Make Sense</h4>
            <div className="space-y-4">
              <div className="bg-slate-800/50 rounded-lg p-4">
                <p className="text-green-400 font-semibold mb-2">Mean = np</p>
                <p className="text-slate-300 text-sm">
                  If each trial has probability p of success, then in n trials,
                  you'd expect about np successes. Flip a fair coin 100 times? Expect ~50 heads.
                </p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4">
                <p className="text-purple-400 font-semibold mb-2">Variance = npq</p>
                <p className="text-slate-300 text-sm">
                  Each Bernoulli trial has variance pq. With n independent trials,
                  variances add up: n × pq = npq. More trials = more spread in possible outcomes.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <p className="text-yellow-200">
              <strong>Quick Check:</strong> For the basketball player (n=10, p=0.7):<br />
              μ = 10 × 0.7 = <span className="text-green-400 font-bold">7 expected makes</span><br />
              σ² = 10 × 0.7 × 0.3 = <span className="text-purple-400 font-bold">2.1</span>, so σ ≈ 1.45
            </p>
          </div>
        </div>
      ),
    },

    // Section 5: The MGF (optional advanced)
    {
      title: 'The Moment-Generating Function',
      content: (
        <div className="space-y-6">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">Binomial MGF</h3>
            <p className="text-slate-300 mb-4">
              The MGF of a Binomial(n, p) random variable is:
            </p>
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-6 text-center">
              <p className="text-3xl font-mono text-white">
                M(t) = (q + pe<sup>t</sup>)<sup>n</sup>
              </p>
              <p className="text-slate-400 mt-2">where q = 1 - p</p>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-blue-400 mb-4">Deriving Mean from MGF</h4>
            <div className="space-y-3 font-mono text-sm">
              <p className="text-slate-300">M(t) = (q + pe<sup>t</sup>)<sup>n</sup></p>
              <p className="text-slate-300">M'(t) = n(q + pe<sup>t</sup>)<sup>n-1</sup> · pe<sup>t</sup></p>
              <p className="text-green-400">M'(0) = n(q + p)<sup>n-1</sup> · p = n · 1 · p = np ✓</p>
            </div>
          </div>

          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-purple-400 mb-4">Why MGF is Useful</h4>
            <ul className="text-slate-300 space-y-2">
              <li>• Sum of independent binomials with same p is also binomial</li>
              <li>• If X ~ Bin(n₁, p) and Y ~ Bin(n₂, p), then X + Y ~ Bin(n₁ + n₂, p)</li>
              <li>• The MGF proves this: M<sub>X+Y</sub>(t) = M<sub>X</sub>(t) · M<sub>Y</sub>(t)</li>
            </ul>
          </div>

          <div className="bg-slate-700/50 rounded-lg p-4">
            <p className="text-slate-400 text-sm">
              <strong>Exam Tip:</strong> The MGF uniquely identifies a distribution.
              If you compute an MGF and it has the form (q + pe<sup>t</sup>)<sup>n</sup>,
              you know you have a Binomial(n, p).
            </p>
          </div>
        </div>
      ),
    },

    // Section 6: Common Exam Patterns
    {
      title: 'Common Exam Patterns',
      content: (
        <div className="space-y-6">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">Recognizing Binomial Problems</h3>
            <p className="text-slate-300 mb-4">
              On Exam P, look for these key ingredients:
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">✅</span>
                <p className="text-slate-300">Fixed number of trials (n)</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">✅</span>
                <p className="text-slate-300">Each trial is independent</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">✅</span>
                <p className="text-slate-300">Same success probability (p) for each trial</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">✅</span>
                <p className="text-slate-300">Counting the number of successes</p>
              </div>
            </div>
          </div>

          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-red-400 mb-4">⚠️ Watch Out: NOT Binomial</h4>
            <ul className="text-slate-300 space-y-2">
              <li>• <strong>Sampling without replacement</strong> (that's Hypergeometric from 2.1)</li>
              <li>• <strong>Trials until first success</strong> (that's Geometric — Section 2.5)</li>
              <li>• <strong>Different probabilities</strong> for each trial</li>
              <li>• <strong>Dependent trials</strong> (one affects another)</li>
            </ul>
          </div>

          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-green-400 mb-4">Common Problem Types</h4>
            <div className="space-y-4">
              <div className="bg-slate-800/50 rounded-lg p-4">
                <p className="text-white font-semibold mb-1">Type 1: Find P(X = k)</p>
                <p className="text-slate-400 text-sm">Use f(k) = C(n,k) p^k q^(n-k) directly</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4">
                <p className="text-white font-semibold mb-1">Type 2: Find P(X ≥ k)</p>
                <p className="text-slate-400 text-sm">Sometimes easier as 1 - P(X ≤ k-1)</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4">
                <p className="text-white font-semibold mb-1">Type 3: Find n or p given information</p>
                <p className="text-slate-400 text-sm">Set up equation using mean = np or given probabilities</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4">
                <p className="text-white font-semibold mb-1">Type 4: Expected value or variance</p>
                <p className="text-slate-400 text-sm">Use μ = np and σ² = npq formulas directly</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },

    // Section 7: Quick Reference
    {
      title: 'Quick Reference',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl p-6 border border-green-500/30">
            <h3 className="text-xl font-bold text-white mb-4">📋 Binomial Distribution Cheat Sheet</h3>

            <div className="space-y-4">
              <div className="bg-slate-900/80 rounded-lg p-4">
                <p className="text-sm text-slate-400 mb-1">Notation</p>
                <p className="text-white font-mono">X ~ Binomial(n, p) or X ~ b(n, p)</p>
              </div>

              <div className="bg-slate-900/80 rounded-lg p-4">
                <p className="text-sm text-slate-400 mb-1">Parameters</p>
                <p className="text-white">n = number of trials, p = success probability, q = 1-p</p>
              </div>

              <div className="bg-slate-900/80 rounded-lg p-4">
                <p className="text-sm text-slate-400 mb-1">Support</p>
                <p className="text-white font-mono">x ∈ {'{'}0, 1, 2, ..., n{'}'}</p>
              </div>

              <div className="bg-slate-900/80 rounded-lg p-4">
                <p className="text-sm text-slate-400 mb-1">PMF</p>
                <p className="text-white font-mono text-lg">f(x) = C(n,x) · p<sup>x</sup> · q<sup>n-x</sup></p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900/80 rounded-lg p-4 text-center">
                  <p className="text-sm text-slate-400 mb-1">Mean</p>
                  <p className="text-2xl font-mono text-green-400">μ = np</p>
                </div>
                <div className="bg-slate-900/80 rounded-lg p-4 text-center">
                  <p className="text-sm text-slate-400 mb-1">Variance</p>
                  <p className="text-2xl font-mono text-purple-400">σ² = npq</p>
                </div>
              </div>

              <div className="bg-slate-900/80 rounded-lg p-4">
                <p className="text-sm text-slate-400 mb-1">MGF</p>
                <p className="text-white font-mono">M(t) = (q + pe<sup>t</sup>)<sup>n</sup></p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <h4 className="text-yellow-300 font-semibold mb-2">Bernoulli is a Special Case</h4>
            <p className="text-yellow-200 text-sm">
              Bernoulli(p) = Binomial(1, p). A single trial is just the n=1 case.
            </p>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <h4 className="text-blue-300 font-semibold mb-2">Sum of Binomials</h4>
            <p className="text-blue-200 text-sm">
              If X ~ Bin(n₁, p) and Y ~ Bin(n₂, p) are independent, then:<br />
              X + Y ~ Bin(n₁ + n₂, p)
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/chapter/2" className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-slate-400" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-white">Section 2.4: Binomial Distribution</h1>
                <p className="text-sm text-slate-400">Bernoulli trials and counting successes</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-slate-700 bg-slate-800/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex gap-1">
            {[
              { id: 'learn' as TabType, label: 'Learn', icon: BookOpen },
              { id: 'simulate' as TabType, label: 'Simulate', icon: Play },
              { id: 'practice' as TabType, label: 'Practice', icon: Target },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Learn Tab */}
        {activeTab === 'learn' && (
          <div className="space-y-8">
            {/* Progress indicator */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                {learnSections.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setLearnSection(idx)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      idx === learnSection ? 'bg-green-500' : idx < learnSection ? 'bg-green-500/50' : 'bg-slate-600'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-slate-400">
                {learnSection + 1} of {learnSections.length}
              </span>
            </div>

            {/* Section Title */}
            <h2 className="text-2xl font-bold text-white">{learnSections[learnSection].title}</h2>

            {/* Section Content */}
            {learnSections[learnSection].content}

            {/* Navigation */}
            <div className="flex justify-between pt-6">
              <button
                onClick={() => setLearnSection(Math.max(0, learnSection - 1))}
                disabled={learnSection === 0}
                className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              <button
                onClick={() => setLearnSection(Math.min(learnSections.length - 1, learnSection + 1))}
                disabled={learnSection === learnSections.length - 1}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Simulate Tab */}
        {activeTab === 'simulate' && (
          <div className="space-y-8">
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <h2 className="text-2xl font-bold text-white mb-4">Binomial Distribution Simulator</h2>
              <p className="text-slate-400 mb-6">
                Experiment with different values of n (trials) and p (success probability).
                Run simulations to see how the observed frequencies compare to the theoretical PMF.
              </p>
            </div>

            <BinomialSimulator />

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <p className="text-yellow-200 text-sm">
                <strong>Experiment Idea:</strong> Set p = 0.5 and try different values of n.
                Notice how the distribution becomes more symmetric and "bell-shaped" as n increases!
              </p>
            </div>
          </div>
        )}

        {/* Practice Tab */}
        {activeTab === 'practice' && (
          <div className="space-y-8">
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <h2 className="text-2xl font-bold text-white mb-4">Practice Problems</h2>
              <p className="text-slate-400">
                Test your understanding with these Exam P-style problems on binomial distributions.
              </p>
            </div>

            <PracticeProblems section="2.4" />
          </div>
        )}
      </main>
    </div>
  );
}
