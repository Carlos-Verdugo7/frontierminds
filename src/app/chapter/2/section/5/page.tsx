'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Play, Target, ChevronRight, ChevronLeft } from 'lucide-react';
import NegativeBinomialSimulator from '@/components/NegativeBinomialSimulator';
import PracticeProblems from '@/components/PracticeProblems';

type TabType = 'learn' | 'simulate' | 'practice';

export default function Section25Page() {
  const [activeTab, setActiveTab] = useState<TabType>('learn');
  const [learnSection, setLearnSection] = useState(0);

  const learnSections = [
    // Section 0: The Story Setup
    {
      title: 'Waiting for Success',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-purple-500/30">
            <h3 className="text-2xl font-bold text-white mb-4">🎯 A Different Question</h3>
            <p className="text-slate-300 text-lg leading-relaxed">
              In the binomial distribution, we asked: "In n trials, how many successes?"
            </p>
            <p className="text-slate-300 text-lg leading-relaxed mt-4">
              Now we flip the question: <span className="text-purple-400 font-bold">"How many trials until we get r successes?"</span>
            </p>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h4 className="text-lg font-semibold text-white mb-4">Real-World Examples</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🎰</span>
                <p className="text-slate-300">How many slot machine pulls until you win?</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">📞</span>
                <p className="text-slate-300">How many calls until you reach a live person?</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🏀</span>
                <p className="text-slate-300">How many free throws until you make 10?</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🔍</span>
                <p className="text-slate-300">How many items to inspect until you find 3 defects?</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <p className="text-yellow-200">
              <strong>Key Difference from Binomial:</strong> Here the number of trials X is random,
              and we're counting trials (not successes). We keep going until we hit our target!
            </p>
          </div>
        </div>
      ),
    },

    // Section 1: Geometric - The Simplest Case
    {
      title: 'Geometric Distribution: First Success',
      content: (
        <div className="space-y-6">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">The Simplest "Waiting" Problem</h3>
            <p className="text-slate-300 mb-4">
              Let's start with the simplest case: <span className="text-green-400 font-bold">waiting for the FIRST success</span>.
            </p>
            <p className="text-slate-300">
              If each trial has probability p of success, what's the probability that the
              first success happens on trial X?
            </p>
          </div>

          <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl p-6 border border-green-500/30">
            <h4 className="text-lg font-semibold text-white mb-4">Building the PMF</h4>
            <p className="text-slate-300 mb-4">For the first success to happen on trial x, we need:</p>
            <div className="flex flex-wrap items-center gap-2 mb-4 text-lg">
              <div className="bg-red-500/20 rounded-lg px-3 py-2 text-red-400">Fail</div>
              <div className="bg-red-500/20 rounded-lg px-3 py-2 text-red-400">Fail</div>
              <div className="text-slate-400">...</div>
              <div className="bg-red-500/20 rounded-lg px-3 py-2 text-red-400">Fail</div>
              <div className="bg-green-500/20 rounded-lg px-3 py-2 text-green-400">Success!</div>
            </div>
            <p className="text-slate-400 text-sm mb-4">
              (x-1) failures, then 1 success
            </p>
            <div className="bg-slate-900/80 rounded-lg p-4 text-center">
              <p className="text-2xl font-mono text-white">
                P(X = x) = (1-p)<sup>x-1</sup> · p = q<sup>x-1</sup> · p
              </p>
              <p className="text-slate-400 mt-2">for x = 1, 2, 3, ...</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
              <p className="text-sm text-slate-400 mb-2">Example: x = 1</p>
              <p className="text-white">First try is a success</p>
              <p className="text-green-400 font-mono">P(X=1) = q⁰ · p = p</p>
            </div>
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
              <p className="text-sm text-slate-400 mb-2">Example: x = 4</p>
              <p className="text-white">3 failures, then success</p>
              <p className="text-green-400 font-mono">P(X=4) = q³ · p</p>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <p className="text-blue-200">
              <strong>Why "Geometric"?</strong> The probabilities p, qp, q²p, q³p, ... form a
              geometric sequence (each term is q times the previous).
            </p>
          </div>
        </div>
      ),
    },

    // Section 2: Geometric Mean and Variance
    {
      title: 'Geometric Mean and Variance',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-500/20 to-purple-500/20 rounded-xl p-6 border border-green-500/30">
            <h3 className="text-xl font-bold text-white mb-4">How Long Will You Wait?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900/80 rounded-xl p-6 text-center">
                <p className="text-sm text-slate-400 mb-2">Mean (Expected Trials)</p>
                <p className="text-4xl font-mono text-green-400 mb-2">μ = 1/p</p>
                <p className="text-slate-400 text-sm">"On average, wait 1/p trials"</p>
              </div>
              <div className="bg-slate-900/80 rounded-xl p-6 text-center">
                <p className="text-sm text-slate-400 mb-2">Variance</p>
                <p className="text-4xl font-mono text-purple-400 mb-2">σ² = q/p²</p>
                <p className="text-slate-400 text-sm">= (1-p)/p²</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h4 className="text-lg font-semibold text-white mb-4">Intuition Check</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="bg-green-500/20 rounded-lg px-4 py-2">
                  <p className="text-green-400 font-mono">p = 1/6</p>
                </div>
                <div className="text-slate-300">
                  Rolling a 6 on a die → expect <span className="text-white font-bold">6 rolls</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-blue-500/20 rounded-lg px-4 py-2">
                  <p className="text-blue-400 font-mono">p = 0.5</p>
                </div>
                <div className="text-slate-300">
                  Flipping heads → expect <span className="text-white font-bold">2 flips</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-purple-500/20 rounded-lg px-4 py-2">
                  <p className="text-purple-400 font-mono">p = 0.01</p>
                </div>
                <div className="text-slate-300">
                  1% lottery → expect <span className="text-white font-bold">100 tries</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <h4 className="text-yellow-300 font-semibold mb-2">Handy Formulas for Geometric</h4>
            <div className="grid grid-cols-2 gap-4 mt-3">
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-slate-400 text-sm">P(X &gt; k) = P(no success in first k)</p>
                <p className="text-white font-mono text-lg">= q<sup>k</sup></p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-slate-400 text-sm">P(X ≤ k) = 1 - P(X &gt; k)</p>
                <p className="text-white font-mono text-lg">= 1 - q<sup>k</sup></p>
              </div>
            </div>
          </div>
        </div>
      ),
    },

    // Section 3: Negative Binomial
    {
      title: 'Negative Binomial: Multiple Successes',
      content: (
        <div className="space-y-6">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">Generalizing to r Successes</h3>
            <p className="text-slate-300 mb-4">
              What if we want to know: how many trials until we get <span className="text-purple-400 font-bold">r successes</span> (not just 1)?
            </p>
            <p className="text-slate-300">
              This is the <span className="text-green-400 font-bold">Negative Binomial Distribution</span>.
            </p>
          </div>

          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-purple-500/30">
            <h4 className="text-lg font-semibold text-white mb-4">Building the PMF</h4>
            <p className="text-slate-300 mb-4">
              For the rth success to occur on trial x, we need:
            </p>
            <div className="bg-slate-900/80 rounded-lg p-4 mb-4">
              <ul className="text-slate-300 space-y-2">
                <li>• Exactly (r-1) successes in the first (x-1) trials</li>
                <li>• A success on trial x (the rth success)</li>
              </ul>
            </div>
            <div className="bg-slate-900/80 rounded-lg p-6 text-center">
              <p className="text-2xl font-mono text-white">
                g(x) = C(x-1, r-1) · p<sup>r</sup> · q<sup>x-r</sup>
              </p>
              <p className="text-slate-400 mt-2">for x = r, r+1, r+2, ...</p>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-blue-400 mb-4">Understanding Each Piece</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-4">
                <div className="bg-purple-500/20 rounded-lg px-4 py-2 text-purple-400 font-mono shrink-0">C(x-1, r-1)</div>
                <p className="text-slate-300">Ways to arrange (r-1) successes in first (x-1) trials</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-green-500/20 rounded-lg px-4 py-2 text-green-400 font-mono shrink-0">p<sup>r</sup></div>
                <p className="text-slate-300">Probability of r total successes</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-red-500/20 rounded-lg px-4 py-2 text-red-400 font-mono shrink-0">q<sup>x-r</sup></div>
                <p className="text-slate-300">Probability of (x-r) failures</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <p className="text-yellow-200">
              <strong>Special Case:</strong> When r = 1, the negative binomial becomes the geometric distribution!
              C(x-1, 0) = 1, so g(x) = p · q<sup>x-1</sup>
            </p>
          </div>
        </div>
      ),
    },

    // Section 4: Negative Binomial Mean and Variance
    {
      title: 'Negative Binomial Mean and Variance',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-500/20 to-purple-500/20 rounded-xl p-6 border border-green-500/30">
            <h3 className="text-xl font-bold text-white mb-4">Expected Trials for r Successes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900/80 rounded-xl p-6 text-center">
                <p className="text-sm text-slate-400 mb-2">Mean</p>
                <p className="text-4xl font-mono text-green-400 mb-2">μ = r/p</p>
                <p className="text-slate-400 text-sm">r times the geometric mean</p>
              </div>
              <div className="bg-slate-900/80 rounded-xl p-6 text-center">
                <p className="text-sm text-slate-400 mb-2">Variance</p>
                <p className="text-4xl font-mono text-purple-400 mb-2">σ² = rq/p²</p>
                <p className="text-slate-400 text-sm">r times the geometric variance</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h4 className="text-lg font-semibold text-white mb-4">Why These Make Sense</h4>
            <p className="text-slate-300 mb-4">
              Think of it this way: to get r successes, you're essentially "waiting" r separate times.
            </p>
            <div className="bg-slate-700/50 rounded-lg p-4">
              <p className="text-slate-300">
                If each success takes <span className="text-green-400">1/p trials on average</span>,
                then r successes take <span className="text-green-400 font-bold">r/p trials on average</span>.
              </p>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-blue-400 mb-4">Example: Basketball Free Throws</h4>
            <p className="text-slate-300 mb-4">
              A player makes 80% of free throws. How many attempts to make 10 shots?
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                <p className="text-xs text-slate-400">Expected</p>
                <p className="text-lg font-mono text-green-400">μ = 10/0.8 = 12.5</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                <p className="text-xs text-slate-400">Variance</p>
                <p className="text-lg font-mono text-purple-400">σ² = 10(0.2)/0.64 = 3.125</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                <p className="text-xs text-slate-400">Std Dev</p>
                <p className="text-lg font-mono text-yellow-400">σ ≈ 1.77</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },

    // Section 5: Memoryless Property
    {
      title: 'The Memoryless Property',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl p-6 border border-orange-500/30">
            <h3 className="text-xl font-bold text-white mb-4">Geometric is "Memoryless"</h3>
            <p className="text-slate-300 mb-4">
              One fascinating property of the geometric distribution: <span className="text-orange-400 font-bold">past failures don't affect future probabilities</span>.
            </p>
            <div className="bg-slate-900/80 rounded-lg p-4 text-center">
              <p className="text-lg text-white">
                P(X &gt; k + m | X &gt; k) = P(X &gt; m)
              </p>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h4 className="text-lg font-semibold text-white mb-4">What This Means</h4>
            <p className="text-slate-300 mb-4">
              If you've already had 10 failures, the probability of needing at least 5 more
              is the same as if you were starting fresh!
            </p>
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <p className="text-yellow-200">
                <strong>Gambler's Fallacy Warning:</strong> "I've lost 10 times, I'm due for a win!"
                — This is false for geometric distributions. Each trial is independent.
              </p>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-blue-400 mb-4">Proof Sketch</h4>
            <div className="font-mono text-sm text-slate-300 space-y-2">
              <p>P(X &gt; k + m | X &gt; k) = P(X &gt; k + m) / P(X &gt; k)</p>
              <p className="pl-4">= q<sup>k+m</sup> / q<sup>k</sup></p>
              <p className="pl-4">= q<sup>m</sup></p>
              <p className="pl-4">= P(X &gt; m) ✓</p>
            </div>
          </div>
        </div>
      ),
    },

    // Section 6: Coupon Collector Problem
    {
      title: 'Application: Coupon Collector',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-500/20 to-green-500/20 rounded-xl p-6 border border-blue-500/30">
            <h3 className="text-xl font-bold text-white mb-4">🎁 The Coupon Collector Problem</h3>
            <p className="text-slate-300 mb-4">
              A classic application of geometric distributions: collecting a complete set of items
              when each item is equally likely.
            </p>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h4 className="text-lg font-semibold text-white mb-4">Example: Rolling All 6 Faces of a Die</h4>
            <p className="text-slate-300 mb-4">
              On average, how many rolls to see every face at least once?
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-4 bg-slate-700/50 rounded-lg p-3">
                <span className="text-2xl">1️⃣</span>
                <p className="text-slate-300">First face: <span className="font-mono text-green-400">1 roll</span> (always new)</p>
              </div>
              <div className="flex items-center gap-4 bg-slate-700/50 rounded-lg p-3">
                <span className="text-2xl">2️⃣</span>
                <p className="text-slate-300">Second new face: geometric with p=5/6 → <span className="font-mono text-green-400">6/5 rolls</span></p>
              </div>
              <div className="flex items-center gap-4 bg-slate-700/50 rounded-lg p-3">
                <span className="text-2xl">3️⃣</span>
                <p className="text-slate-300">Third new face: geometric with p=4/6 → <span className="font-mono text-green-400">6/4 rolls</span></p>
              </div>
              <div className="flex items-center gap-4 bg-slate-700/50 rounded-lg p-3">
                <span className="text-slate-400">...</span>
                <p className="text-slate-300">Continue the pattern...</p>
              </div>
            </div>
          </div>

          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-green-400 mb-4">Total Expected Rolls</h4>
            <div className="bg-slate-900/80 rounded-lg p-4 text-center">
              <p className="text-xl font-mono text-white">
                1 + 6/5 + 6/4 + 6/3 + 6/2 + 6/1 = <span className="text-green-400">14.7 rolls</span>
              </p>
            </div>
            <p className="text-slate-300 mt-4 text-sm">
              General formula for n items: n × (1 + 1/2 + 1/3 + ... + 1/n) = n × H<sub>n</sub>
            </p>
          </div>
        </div>
      ),
    },

    // Section 7: Common Exam Patterns
    {
      title: 'Exam Problem Patterns',
      content: (
        <div className="space-y-6">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">Recognizing These Distributions</h3>
            <div className="space-y-4">
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <p className="text-green-400 font-semibold mb-2">Geometric: "Until first success"</p>
                <ul className="text-slate-300 text-sm space-y-1">
                  <li>• "How many trials until the first..."</li>
                  <li>• "Probability that the first success is on trial k"</li>
                  <li>• "At least k trials needed"</li>
                </ul>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                <p className="text-purple-400 font-semibold mb-2">Negative Binomial: "Until r successes"</p>
                <ul className="text-slate-300 text-sm space-y-1">
                  <li>• "Minimum number of trials to get r successes"</li>
                  <li>• "The rth success occurs on trial x"</li>
                  <li>• "How many attempts until r total"</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-red-400 mb-4">⚠️ Common Traps</h4>
            <ul className="text-slate-300 space-y-2">
              <li>• <strong>Don't confuse with Binomial:</strong> Binomial counts successes in fixed trials;
                  Negative Binomial counts trials until fixed successes</li>
              <li>• <strong>Support starts at r:</strong> X can't be less than r (need at least r trials for r successes)</li>
              <li>• <strong>Formula indexing:</strong> C(x-1, r-1) not C(x, r)</li>
            </ul>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-blue-400 mb-4">Quick Probability Shortcuts (Geometric)</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-sm text-slate-400">P(X = k)</p>
                <p className="text-white font-mono">q<sup>k-1</sup> · p</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-sm text-slate-400">P(X &gt; k)</p>
                <p className="text-white font-mono">q<sup>k</sup></p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-sm text-slate-400">P(X ≤ k)</p>
                <p className="text-white font-mono">1 - q<sup>k</sup></p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-sm text-slate-400">P(X ≥ k)</p>
                <p className="text-white font-mono">q<sup>k-1</sup></p>
              </div>
            </div>
          </div>
        </div>
      ),
    },

    // Section 8: Quick Reference
    {
      title: 'Quick Reference',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-500/20 to-purple-500/20 rounded-xl p-6 border border-green-500/30">
            <h3 className="text-xl font-bold text-white mb-4">📋 Cheat Sheet</h3>

            <div className="space-y-6">
              {/* Geometric */}
              <div className="bg-slate-900/80 rounded-lg p-4">
                <h4 className="text-green-400 font-semibold mb-3">Geometric Distribution (r = 1)</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-slate-400">PMF:</p>
                    <p className="text-white font-mono">f(x) = p · q<sup>x-1</sup></p>
                  </div>
                  <div>
                    <p className="text-slate-400">Support:</p>
                    <p className="text-white font-mono">x = 1, 2, 3, ...</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Mean:</p>
                    <p className="text-white font-mono">μ = 1/p</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Variance:</p>
                    <p className="text-white font-mono">σ² = q/p²</p>
                  </div>
                </div>
              </div>

              {/* Negative Binomial */}
              <div className="bg-slate-900/80 rounded-lg p-4">
                <h4 className="text-purple-400 font-semibold mb-3">Negative Binomial Distribution</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-slate-400">PMF:</p>
                    <p className="text-white font-mono">g(x) = C(x-1,r-1) p<sup>r</sup> q<sup>x-r</sup></p>
                  </div>
                  <div>
                    <p className="text-slate-400">Support:</p>
                    <p className="text-white font-mono">x = r, r+1, r+2, ...</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Mean:</p>
                    <p className="text-white font-mono">μ = r/p</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Variance:</p>
                    <p className="text-white font-mono">σ² = rq/p²</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <h4 className="text-yellow-300 font-semibold mb-2">Key Relationships</h4>
            <ul className="text-yellow-200 text-sm space-y-1">
              <li>• Geometric = Negative Binomial with r = 1</li>
              <li>• Geometric is memoryless: P(X &gt; k+m | X &gt; k) = P(X &gt; m)</li>
              <li>• X counts TRIALS (including the final success)</li>
            </ul>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <h4 className="text-blue-300 font-semibold mb-2">MGF</h4>
            <p className="text-slate-300 text-sm mb-2">Geometric MGF:</p>
            <p className="text-white font-mono text-center">M(t) = pe<sup>t</sup> / (1 - qe<sup>t</sup>)</p>
            <p className="text-slate-300 text-sm mt-3 mb-2">Negative Binomial MGF:</p>
            <p className="text-white font-mono text-center">M(t) = [pe<sup>t</sup> / (1 - qe<sup>t</sup>)]<sup>r</sup></p>
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
                <h1 className="text-xl font-bold text-white">Section 2.5: Negative Binomial Distribution</h1>
                <p className="text-sm text-slate-400">Geometric and waiting for r successes</p>
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
              <h2 className="text-2xl font-bold text-white mb-4">Geometric & Negative Binomial Simulator</h2>
              <p className="text-slate-400 mb-6">
                Set r = 1 for the Geometric distribution (first success), or r &gt; 1 for the Negative Binomial
                (rth success). Watch as trials accumulate until the target number of successes is reached.
              </p>
            </div>

            <NegativeBinomialSimulator />

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <p className="text-yellow-200 text-sm">
                <strong>Experiment Ideas:</strong> Try r = 1, p = 0.5 (coin flip until heads). Then compare
                r = 5, p = 0.5 (until 5 heads). Notice how the distribution shifts right and becomes more symmetric.
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
                Test your understanding with these Exam P-style problems on geometric and negative binomial distributions.
              </p>
            </div>

            <PracticeProblems section="2.5" />
          </div>
        )}
      </main>
    </div>
  );
}
