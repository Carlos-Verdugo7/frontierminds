'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Play, Target, ChevronRight, ChevronLeft } from 'lucide-react';
import AdditionalModelsSimulator from '@/components/AdditionalModelsSimulator';
import PracticeProblems from '@/components/PracticeProblems';

type TabType = 'learn' | 'simulate' | 'practice';

export default function Section34Page() {
  const [activeTab, setActiveTab] = useState<TabType>('learn');
  const [learnSection, setLearnSection] = useState(0);

  const learnSections = [
    // Section 0: Why These Distributions Matter
    {
      title: 'Why These Distributions Matter',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl p-6 border border-purple-500/30">
            <h3 className="text-2xl font-bold text-white mb-4">Three Powerful Continuous Models</h3>
            <p className="text-slate-300 text-lg leading-relaxed">
              The <span className="text-purple-400 font-bold">Beta</span>,{' '}
              <span className="text-blue-400 font-bold">Weibull</span>, and{' '}
              <span className="text-orange-400 font-bold">Pareto</span> distributions complete
              your toolkit for continuous probability. Each serves a distinct purpose and appears
              regularly on Exam P.
            </p>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h4 className="text-lg font-semibold text-white mb-4">Where You&apos;ll See Them</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                <p className="text-purple-400 font-semibold mb-2">Beta Distribution</p>
                <p className="text-slate-300 text-sm">
                  Models proportions, percentages, and probabilities themselves.
                  Test pass rates, market shares, batting averages &mdash; any quantity
                  constrained to [0, 1].
                </p>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <p className="text-blue-400 font-semibold mb-2">Weibull Distribution</p>
                <p className="text-slate-300 text-sm">
                  The workhorse of reliability engineering. Models equipment failure times
                  with flexible failure rates: increasing (wear-out), decreasing (burn-in),
                  or constant (Exponential).
                </p>
              </div>
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                <p className="text-orange-400 font-semibold mb-2">Pareto Distribution</p>
                <p className="text-slate-300 text-sm">
                  The heavy-tailed distribution behind the &ldquo;80/20 rule.&rdquo; Essential for
                  insurance claim modeling, income distributions, and any situation
                  where extreme values dominate.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <h4 className="text-green-400 font-semibold mb-2">Connections to What You Know</h4>
            <div className="text-green-200 text-sm space-y-1">
              <p>&bull; Beta(1,1) = Uniform(0,1) &mdash; the simplest Beta is the Uniform!</p>
              <p>&bull; Weibull(k=1, &lambda;) = Exponential(1/&lambda;) &mdash; the Exponential is a special Weibull</p>
              <p>&bull; If X ~ Pareto(&alpha;, &theta;), then ln(1 + X/&theta;) ~ Exponential(&alpha;)</p>
            </div>
          </div>
        </div>
      ),
    },

    // Section 1: The Beta Distribution
    {
      title: 'The Beta Distribution',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl p-6 border border-purple-500/30">
            <h3 className="text-xl font-bold text-white mb-4">Beta(&alpha;, &beta;) &mdash; The Distribution on [0, 1]</h3>
            <p className="text-slate-300 mb-4">
              A continuous random variable X has a <strong className="text-white">Beta distribution</strong> with
              shape parameters &alpha; &gt; 0 and &beta; &gt; 0 if its PDF is:
            </p>
            <div className="bg-slate-900/80 rounded-lg p-4 text-center">
              <p className="text-slate-400 text-sm mb-1">Beta PDF</p>
              <p className="text-2xl font-mono text-white">
                f(x) = x<sup>&alpha;-1</sup>(1-x)<sup>&beta;-1</sup> / B(&alpha;, &beta;)
              </p>
              <p className="text-slate-400 text-sm mt-2">for 0 &lt; x &lt; 1</p>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h4 className="text-lg font-semibold text-white mb-4">The Beta Function B(&alpha;, &beta;)</h4>
            <div className="bg-slate-900/80 rounded-lg p-4 text-center mb-4">
              <p className="text-xl font-mono text-white">
                B(&alpha;, &beta;) = &Gamma;(&alpha;)&Gamma;(&beta;) / &Gamma;(&alpha; + &beta;)
              </p>
            </div>
            <p className="text-slate-300 text-sm">
              This normalizing constant ensures the PDF integrates to 1 over [0, 1].
              On Exam P, you rarely compute B(&alpha;, &beta;) directly &mdash; instead, you use
              properties like the mean formula.
            </p>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h4 className="text-lg font-semibold text-white mb-4">Shape Flexibility</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                <p className="text-purple-400 font-semibold mb-2">&alpha; &lt; 1, &beta; &lt; 1</p>
                <p className="text-slate-300 text-sm">
                  U-shaped: density concentrates near 0 and 1. Example: Beta(0.5, 0.5) is the arcsine distribution.
                </p>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <p className="text-blue-400 font-semibold mb-2">&alpha; &gt; 1, &beta; &gt; 1</p>
                <p className="text-slate-300 text-sm">
                  Bell-shaped: a single interior mode at (&alpha;-1)/(&alpha;+&beta;-2). Looks like a normal restricted to [0,1].
                </p>
              </div>
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <p className="text-green-400 font-semibold mb-2">&alpha; = 1, &beta; = 1</p>
                <p className="text-slate-300 text-sm">
                  Flat / Uniform: Beta(1,1) = Uniform(0,1). The PDF is constant at f(x) = 1.
                </p>
              </div>
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                <p className="text-orange-400 font-semibold mb-2">&alpha; &lt; 1, &beta; &gt; 1 (or vice versa)</p>
                <p className="text-slate-300 text-sm">
                  J-shaped: density concentrates near one endpoint. Useful for skewed proportions.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <p className="text-yellow-200">
              <strong>Key formula:</strong> Mean = &alpha; / (&alpha; + &beta;). This is the most
              commonly tested Beta property on Exam P. If you remember nothing else, remember this.
            </p>
          </div>
        </div>
      ),
    },

    // Section 2: Beta Distribution Properties
    {
      title: 'Beta Distribution Properties',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-500/20 to-green-500/20 rounded-xl p-6 border border-purple-500/30">
            <h3 className="text-xl font-bold text-white mb-4">Key Properties of Beta(&alpha;, &beta;)</h3>
            <div className="space-y-3">
              <div className="bg-slate-900/80 rounded-lg p-4 text-center">
                <p className="text-slate-400 text-sm mb-1">Mean</p>
                <p className="text-2xl font-mono text-white">E[X] = &alpha; / (&alpha; + &beta;)</p>
              </div>
              <div className="bg-slate-900/80 rounded-lg p-4 text-center">
                <p className="text-slate-400 text-sm mb-1">Variance</p>
                <p className="text-2xl font-mono text-white">Var(X) = &alpha;&beta; / ((&alpha;+&beta;)&sup2;(&alpha;+&beta;+1))</p>
              </div>
              <div className="bg-slate-900/80 rounded-lg p-4 text-center">
                <p className="text-slate-400 text-sm mb-1">Mode (when &alpha; &gt; 1, &beta; &gt; 1)</p>
                <p className="text-2xl font-mono text-white">Mode = (&alpha; - 1) / (&alpha; + &beta; - 2)</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h4 className="text-lg font-semibold text-white mb-4">Special Cases</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-600">
                    <th className="text-left text-slate-400 py-2 px-3">Parameters</th>
                    <th className="text-left text-slate-400 py-2 px-3">Distribution</th>
                    <th className="text-left text-slate-400 py-2 px-3">Shape</th>
                  </tr>
                </thead>
                <tbody className="text-slate-300">
                  <tr className="border-b border-slate-700">
                    <td className="py-2 px-3 font-mono text-white">Beta(1, 1)</td>
                    <td className="py-2 px-3">Uniform(0, 1)</td>
                    <td className="py-2 px-3">Flat line at f(x) = 1</td>
                  </tr>
                  <tr className="border-b border-slate-700">
                    <td className="py-2 px-3 font-mono text-white">Beta(&frac12;, &frac12;)</td>
                    <td className="py-2 px-3">Arcsine</td>
                    <td className="py-2 px-3">U-shaped, peaks at 0 and 1</td>
                  </tr>
                  <tr className="border-b border-slate-700">
                    <td className="py-2 px-3 font-mono text-white">Beta(&alpha;, 1)</td>
                    <td className="py-2 px-3">Power distribution</td>
                    <td className="py-2 px-3">f(x) = &alpha;x<sup>&alpha;-1</sup></td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-mono text-white">Beta(1, &beta;)</td>
                    <td className="py-2 px-3">Power distribution</td>
                    <td className="py-2 px-3">f(x) = &beta;(1-x)<sup>&beta;-1</sup></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h4 className="text-lg font-semibold text-white mb-4">Connection to Order Statistics</h4>
            <p className="text-slate-300 text-sm mb-3">
              If U<sub>1</sub>, U<sub>2</sub>, &hellip;, U<sub>n</sub> are i.i.d. Uniform(0,1) and
              U<sub>(k)</sub> is the k-th order statistic, then:
            </p>
            <div className="bg-slate-900/80 rounded-lg p-4 text-center">
              <p className="text-xl font-mono text-white">U<sub>(k)</sub> ~ Beta(k, n - k + 1)</p>
            </div>
            <p className="text-slate-400 text-sm mt-3">
              This is a favorite Exam P fact. It connects order statistics directly to the Beta family.
            </p>
          </div>
        </div>
      ),
    },

    // Section 3: The Weibull Distribution
    {
      title: 'The Weibull Distribution',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-500/20 to-green-500/20 rounded-xl p-6 border border-blue-500/30">
            <h3 className="text-xl font-bold text-white mb-4">Weibull(k, &lambda;) &mdash; Flexible Failure Times</h3>
            <p className="text-slate-300 mb-4">
              The Weibull distribution generalizes the Exponential by adding a shape parameter
              that controls whether the failure rate increases, decreases, or stays constant.
            </p>
            <div className="space-y-3">
              <div className="bg-slate-900/80 rounded-lg p-4 text-center">
                <p className="text-slate-400 text-sm mb-1">Weibull PDF</p>
                <p className="text-2xl font-mono text-white">
                  f(x) = (k/&lambda;)(x/&lambda;)<sup>k-1</sup> exp(-(x/&lambda;)<sup>k</sup>)
                </p>
                <p className="text-slate-400 text-sm mt-2">for x &ge; 0, with k &gt; 0, &lambda; &gt; 0</p>
              </div>
              <div className="bg-slate-900/80 rounded-lg p-4 text-center">
                <p className="text-slate-400 text-sm mb-1">Weibull CDF (closed form!)</p>
                <p className="text-2xl font-mono text-white">
                  F(x) = 1 - exp(-(x/&lambda;)<sup>k</sup>)
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h4 className="text-lg font-semibold text-white mb-4">Parameter Roles</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <p className="text-blue-400 font-semibold mb-2">k (shape parameter)</p>
                <p className="text-slate-300 text-sm">
                  Controls the failure rate behavior. This is the critical parameter on Exam P.
                  <br/><br/>
                  k &lt; 1: &ldquo;infant mortality&rdquo; &mdash; failure rate decreases over time
                  <br/>
                  k = 1: constant failure rate (Exponential distribution!)
                  <br/>
                  k &gt; 1: &ldquo;wear-out&rdquo; &mdash; failure rate increases over time
                </p>
              </div>
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <p className="text-green-400 font-semibold mb-2">&lambda; (scale parameter)</p>
                <p className="text-slate-300 text-sm">
                  Stretches or compresses the distribution along the x-axis. The 63.2nd percentile
                  always occurs at x = &lambda; (since F(&lambda;) = 1 - e<sup>-1</sup> &asymp; 0.632).
                </p>
              </div>
            </div>
          </div>

          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <h4 className="text-red-400 font-semibold mb-2">Exam Trap!</h4>
            <p className="text-red-200 text-sm">
              When k = 1, the Weibull reduces to Exponential with mean &lambda;, <strong>not</strong> rate &lambda;.
              Be careful: Weibull(&lambda;) and Exponential(&lambda;) use &lambda; differently!
              Weibull uses &lambda; as scale (mean = &lambda;), while our Exponential uses &lambda; as rate (mean = 1/&lambda;).
            </p>
          </div>
        </div>
      ),
    },

    // Section 4: Weibull Properties & Reliability
    {
      title: 'Weibull Properties & Reliability',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-500/20 to-green-500/20 rounded-xl p-6 border border-blue-500/30">
            <h3 className="text-xl font-bold text-white mb-4">Moments &amp; Hazard Function</h3>
            <div className="space-y-3">
              <div className="bg-slate-900/80 rounded-lg p-4 text-center">
                <p className="text-slate-400 text-sm mb-1">Mean</p>
                <p className="text-2xl font-mono text-white">E[X] = &lambda; &middot; &Gamma;(1 + 1/k)</p>
              </div>
              <div className="bg-slate-900/80 rounded-lg p-4 text-center">
                <p className="text-slate-400 text-sm mb-1">Variance</p>
                <p className="text-xl font-mono text-white">Var(X) = &lambda;&sup2;[&Gamma;(1 + 2/k) - &Gamma;(1 + 1/k)&sup2;]</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h4 className="text-lg font-semibold text-white mb-4">The Hazard (Failure Rate) Function</h4>
            <div className="bg-slate-900/80 rounded-lg p-4 text-center mb-4">
              <p className="text-slate-400 text-sm mb-1">Hazard rate</p>
              <p className="text-2xl font-mono text-white">h(t) = f(t) / (1 - F(t)) = (k/&lambda;)(t/&lambda;)<sup>k-1</sup></p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-red-400">k &lt; 1</p>
                <p className="text-white font-mono mt-2">h(t) &darr;</p>
                <p className="text-slate-400 text-xs mt-1">Decreasing failure rate</p>
                <p className="text-slate-500 text-xs">&ldquo;Infant mortality&rdquo;</p>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-yellow-400">k = 1</p>
                <p className="text-white font-mono mt-2">h(t) = const</p>
                <p className="text-slate-400 text-xs mt-1">Constant failure rate</p>
                <p className="text-slate-500 text-xs">Exponential (memoryless)</p>
              </div>
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-green-400">k &gt; 1</p>
                <p className="text-white font-mono mt-2">h(t) &uarr;</p>
                <p className="text-slate-400 text-xs mt-1">Increasing failure rate</p>
                <p className="text-slate-500 text-xs">&ldquo;Wear-out&rdquo;</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h4 className="text-lg font-semibold text-white mb-4">Reliability Function</h4>
            <div className="bg-slate-900/80 rounded-lg p-4 text-center">
              <p className="text-slate-400 text-sm mb-1">Survival / Reliability</p>
              <p className="text-2xl font-mono text-white">R(t) = P(X &gt; t) = exp(-(t/&lambda;)<sup>k</sup>)</p>
            </div>
            <p className="text-slate-400 text-sm mt-3">
              R(t) gives the probability that a component survives past time t.
              Note the clean closed-form expression &mdash; no numerical integration needed.
            </p>
          </div>
        </div>
      ),
    },

    // Section 5: The Pareto Distribution
    {
      title: 'The Pareto Distribution',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl p-6 border border-orange-500/30">
            <h3 className="text-xl font-bold text-white mb-4">Pareto(&alpha;, &theta;) &mdash; The Heavy-Tailed Power Law</h3>
            <p className="text-slate-300 mb-4">
              The SOA/actuarial Pareto (Type II, also called Lomax) has support [0, &infin;). This is
              the parameterization used on <span className="text-orange-400 font-bold">Exam P</span>.
            </p>
            <div className="space-y-3">
              <div className="bg-slate-900/80 rounded-lg p-4 text-center">
                <p className="text-slate-400 text-sm mb-1">Pareto PDF (SOA parameterization)</p>
                <p className="text-2xl font-mono text-white">
                  f(x) = &alpha;&theta;<sup>&alpha;</sup> / (x + &theta;)<sup>&alpha;+1</sup>
                </p>
                <p className="text-slate-400 text-sm mt-2">for x &ge; 0, with &alpha; &gt; 0, &theta; &gt; 0</p>
              </div>
              <div className="bg-slate-900/80 rounded-lg p-4 text-center">
                <p className="text-slate-400 text-sm mb-1">Pareto CDF</p>
                <p className="text-2xl font-mono text-white">
                  F(x) = 1 - (&theta; / (x + &theta;))<sup>&alpha;</sup>
                </p>
              </div>
              <div className="bg-slate-900/80 rounded-lg p-4 text-center">
                <p className="text-slate-400 text-sm mb-1">Survival Function</p>
                <p className="text-2xl font-mono text-white">
                  S(x) = (&theta; / (x + &theta;))<sup>&alpha;</sup>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h4 className="text-lg font-semibold text-white mb-4">Heavy Tails &amp; the 80/20 Rule</h4>
            <p className="text-slate-300 text-sm mb-3">
              Vilfredo Pareto originally observed that 80% of Italy&apos;s wealth was owned by 20% of
              the population. The Pareto distribution captures this extreme inequality.
            </p>
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
              <p className="text-orange-400 font-semibold mb-2">What makes it &ldquo;heavy-tailed&rdquo;?</p>
              <p className="text-slate-300 text-sm">
                The tail probability decays as a <strong>power law</strong>: P(X &gt; x) &asymp; C/x<sup>&alpha;</sup>.
                Compare this to the exponential&apos;s e<sup>-&lambda;x</sup> which decays much faster.
                This means extreme values (like catastrophic insurance claims) occur
                more frequently than lighter-tailed models predict.
              </p>
            </div>
          </div>

          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <h4 className="text-red-400 font-semibold mb-2">Exam Trap: Classical vs SOA Pareto</h4>
            <p className="text-red-200 text-sm">
              The <strong>classical</strong> Pareto has support [&theta;, &infin;) with CDF 1 - (&theta;/x)<sup>&alpha;</sup>.
              The <strong>SOA/actuarial</strong> version shifts this to support [0, &infin;) with CDF 1 - (&theta;/(x+&theta;))<sup>&alpha;</sup>.
              On Exam P, always use the SOA parameterization unless told otherwise.
            </p>
          </div>
        </div>
      ),
    },

    // Section 6: Pareto Properties & Insurance
    {
      title: 'Pareto Properties & Insurance',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl p-6 border border-orange-500/30">
            <h3 className="text-xl font-bold text-white mb-4">Moments &amp; Existence Conditions</h3>
            <div className="space-y-3">
              <div className="bg-slate-900/80 rounded-lg p-4 text-center">
                <p className="text-slate-400 text-sm mb-1">Mean (exists only when &alpha; &gt; 1)</p>
                <p className="text-2xl font-mono text-white">E[X] = &theta; / (&alpha; - 1)</p>
              </div>
              <div className="bg-slate-900/80 rounded-lg p-4 text-center">
                <p className="text-slate-400 text-sm mb-1">Variance (exists only when &alpha; &gt; 2)</p>
                <p className="text-xl font-mono text-white">Var(X) = &alpha;&theta;&sup2; / ((&alpha;-1)&sup2;(&alpha;-2))</p>
              </div>
              <div className="bg-slate-900/80 rounded-lg p-4 text-center">
                <p className="text-slate-400 text-sm mb-1">k-th moment (exists only when &alpha; &gt; k)</p>
                <p className="text-xl font-mono text-white">E[X<sup>k</sup>] = k! &middot; &theta;<sup>k</sup> / ((&alpha;-1)(&alpha;-2)&hellip;(&alpha;-k))</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h4 className="text-lg font-semibold text-white mb-4">Insurance Applications</h4>
            <div className="space-y-4">
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                <p className="text-orange-400 font-semibold mb-2">Excess Loss (Mean Excess)</p>
                <p className="text-slate-300 text-sm mb-2">
                  Given a loss exceeds deductible d, the expected excess is:
                </p>
                <div className="bg-slate-900/80 rounded-lg p-3 text-center">
                  <p className="text-white font-mono">e(d) = E[X - d | X &gt; d] = (d + &theta;) / (&alpha; - 1)</p>
                </div>
                <p className="text-slate-400 text-xs mt-2">
                  For &alpha; &gt; 1. Note: this <strong>increases</strong> with d &mdash; a hallmark of heavy tails.
                </p>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <p className="text-blue-400 font-semibold mb-2">Limited Expected Value</p>
                <p className="text-slate-300 text-sm mb-2">
                  The expected payment with a policy limit u:
                </p>
                <div className="bg-slate-900/80 rounded-lg p-3 text-center">
                  <p className="text-white font-mono">E[min(X, u)] = (&theta;/(&alpha;-1))[1 - (&theta;/(u+&theta;))<sup>&alpha;-1</sup>]</p>
                </div>
                <p className="text-slate-400 text-xs mt-2">For &alpha; &gt; 1. This is key for insurance pricing.</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <p className="text-yellow-200">
              <strong>Exam P Focus:</strong> The most commonly tested Pareto properties are (1) when
              the mean/variance exist, (2) excess loss calculations, and (3) P(X &gt; x) survival probabilities.
            </p>
          </div>
        </div>
      ),
    },

    // Section 7: Comparing the Three Distributions
    {
      title: 'Comparing the Three Distributions',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-500/20 to-orange-500/20 rounded-xl p-6 border border-purple-500/30">
            <h3 className="text-xl font-bold text-white mb-4">When to Use Each Distribution</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-600">
                    <th className="text-left text-slate-400 py-2 px-3">Feature</th>
                    <th className="text-left text-purple-400 py-2 px-3">Beta</th>
                    <th className="text-left text-blue-400 py-2 px-3">Weibull</th>
                    <th className="text-left text-orange-400 py-2 px-3">Pareto</th>
                  </tr>
                </thead>
                <tbody className="text-slate-300">
                  <tr className="border-b border-slate-700">
                    <td className="py-2 px-3 font-semibold">Support</td>
                    <td className="py-2 px-3 font-mono">[0, 1]</td>
                    <td className="py-2 px-3 font-mono">[0, &infin;)</td>
                    <td className="py-2 px-3 font-mono">[0, &infin;)</td>
                  </tr>
                  <tr className="border-b border-slate-700">
                    <td className="py-2 px-3 font-semibold">Tail behavior</td>
                    <td className="py-2 px-3">Bounded</td>
                    <td className="py-2 px-3">Light tail</td>
                    <td className="py-2 px-3 text-red-400 font-semibold">Heavy tail</td>
                  </tr>
                  <tr className="border-b border-slate-700">
                    <td className="py-2 px-3 font-semibold">Closed-form CDF</td>
                    <td className="py-2 px-3">No (incomplete beta)</td>
                    <td className="py-2 px-3 text-green-400">Yes</td>
                    <td className="py-2 px-3 text-green-400">Yes</td>
                  </tr>
                  <tr className="border-b border-slate-700">
                    <td className="py-2 px-3 font-semibold">Models</td>
                    <td className="py-2 px-3">Proportions, rates</td>
                    <td className="py-2 px-3">Lifetimes, reliability</td>
                    <td className="py-2 px-3">Claims, extremes</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold">All moments exist?</td>
                    <td className="py-2 px-3 text-green-400">Yes (bounded)</td>
                    <td className="py-2 px-3 text-green-400">Yes</td>
                    <td className="py-2 px-3 text-red-400">Only if &alpha; &gt; k</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h4 className="text-lg font-semibold text-white mb-4">Shape Flexibility Comparison</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                <p className="text-purple-400 font-semibold mb-2">Beta (2 shape params)</p>
                <p className="text-slate-300 text-sm">
                  Most flexible: U-shaped, J-shaped, bell-shaped, uniform.
                  Two parameters control shape independently.
                </p>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <p className="text-blue-400 font-semibold mb-2">Weibull (1 shape + 1 scale)</p>
                <p className="text-slate-300 text-sm">
                  Shape k controls skewness and tail. Can mimic exponential
                  (k=1) or approximate normal (k &asymp; 3.6).
                </p>
              </div>
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                <p className="text-orange-400 font-semibold mb-2">Pareto (1 shape + 1 scale)</p>
                <p className="text-slate-300 text-sm">
                  Always right-skewed with heavy tail. Smaller &alpha; = heavier tail.
                  Used when extreme values matter most.
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },

    // Section 8: Relationships Between Distributions
    {
      title: 'Relationships Between Distributions',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl p-6 border border-green-500/30">
            <h3 className="text-xl font-bold text-white mb-4">How These Distributions Connect</h3>
            <p className="text-slate-300">
              Understanding relationships between distributions helps on Exam P when you need to
              recognize a distribution in disguise or derive properties from known results.
            </p>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h4 className="text-lg font-semibold text-white mb-4">Key Relationships</h4>
            <div className="space-y-4">
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                <p className="text-purple-400 font-semibold mb-2">Beta &harr; Uniform</p>
                <p className="text-slate-300 text-sm">Beta(1, 1) = Uniform(0, 1)</p>
                <p className="text-slate-400 text-xs">The uniform is the &ldquo;flat Beta&rdquo; with no shape preference.</p>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <p className="text-blue-400 font-semibold mb-2">Weibull &harr; Exponential</p>
                <p className="text-slate-300 text-sm">Weibull(k=1, &lambda;) = Exponential with mean &lambda;</p>
                <p className="text-slate-400 text-xs">Setting the shape parameter to 1 removes the power transform.</p>
              </div>
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                <p className="text-orange-400 font-semibold mb-2">Pareto &harr; Exponential (via log transform)</p>
                <p className="text-slate-300 text-sm">If X ~ Pareto(&alpha;, &theta;), then Y = ln(1 + X/&theta;) ~ Exponential(&alpha;)</p>
                <p className="text-slate-400 text-xs">The logarithmic transform &ldquo;tames&rdquo; the heavy tail into an exponential.</p>
              </div>
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <p className="text-green-400 font-semibold mb-2">Beta &harr; Gamma (ratio)</p>
                <p className="text-slate-300 text-sm">If X ~ Gamma(&alpha;, 1) and Y ~ Gamma(&beta;, 1) independent, then X/(X+Y) ~ Beta(&alpha;, &beta;)</p>
                <p className="text-slate-400 text-xs">This is how simulators generate Beta random variables.</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <p className="text-yellow-200">
              <strong>Exam Strategy:</strong> If you see a transformation like Y = ln(X) or Y = X<sup>k</sup>,
              check if the result follows one of these known distributions. Many Exam P problems are
              disguised relationship questions.
            </p>
          </div>
        </div>
      ),
    },

    // Section 9: Excel Functions for These Distributions
    {
      title: 'Excel Functions for These Distributions',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl p-6 border border-green-500/30">
            <h3 className="text-xl font-bold text-white mb-4">Spreadsheet Reference</h3>
            <p className="text-slate-300">
              Excel has built-in functions for Beta and Weibull, but <strong className="text-red-400">not for Pareto</strong>.
              Here&apos;s how to work with each.
            </p>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h4 className="text-lg font-semibold text-white mb-4">Beta Functions</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-600">
                    <th className="text-left text-slate-400 py-2 px-3">Function</th>
                    <th className="text-left text-slate-400 py-2 px-3">Excel Syntax</th>
                    <th className="text-left text-slate-400 py-2 px-3">Returns</th>
                  </tr>
                </thead>
                <tbody className="text-slate-300">
                  <tr className="border-b border-slate-700">
                    <td className="py-2 px-3">PDF</td>
                    <td className="py-2 px-3 font-mono text-blue-400">BETA.DIST(x, &alpha;, &beta;, FALSE)</td>
                    <td className="py-2 px-3">f(x)</td>
                  </tr>
                  <tr className="border-b border-slate-700">
                    <td className="py-2 px-3">CDF</td>
                    <td className="py-2 px-3 font-mono text-blue-400">BETA.DIST(x, &alpha;, &beta;, TRUE)</td>
                    <td className="py-2 px-3">P(X &le; x)</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3">Inverse</td>
                    <td className="py-2 px-3 font-mono text-blue-400">BETA.INV(p, &alpha;, &beta;)</td>
                    <td className="py-2 px-3">x such that P(X &le; x) = p</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h4 className="text-lg font-semibold text-white mb-4">Weibull Functions</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-600">
                    <th className="text-left text-slate-400 py-2 px-3">Function</th>
                    <th className="text-left text-slate-400 py-2 px-3">Excel Syntax</th>
                    <th className="text-left text-slate-400 py-2 px-3">Returns</th>
                  </tr>
                </thead>
                <tbody className="text-slate-300">
                  <tr className="border-b border-slate-700">
                    <td className="py-2 px-3">PDF</td>
                    <td className="py-2 px-3 font-mono text-blue-400">WEIBULL.DIST(x, k, &lambda;, FALSE)</td>
                    <td className="py-2 px-3">f(x)</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3">CDF</td>
                    <td className="py-2 px-3 font-mono text-blue-400">WEIBULL.DIST(x, k, &lambda;, TRUE)</td>
                    <td className="py-2 px-3">P(X &le; x)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h4 className="text-lg font-semibold text-white mb-4">Pareto (Manual Formulas)</h4>
            <p className="text-slate-400 text-sm mb-3">
              No built-in Excel function &mdash; use these formulas directly:
            </p>
            <div className="space-y-2">
              <div className="bg-slate-900/80 rounded-lg p-3">
                <p className="text-slate-400 text-xs mb-1">PDF</p>
                <p className="text-blue-400 font-mono text-sm">=&alpha;*&theta;^&alpha;/(x+&theta;)^(&alpha;+1)</p>
              </div>
              <div className="bg-slate-900/80 rounded-lg p-3">
                <p className="text-slate-400 text-xs mb-1">CDF</p>
                <p className="text-blue-400 font-mono text-sm">=1-(&theta;/(x+&theta;))^&alpha;</p>
              </div>
              <div className="bg-slate-900/80 rounded-lg p-3">
                <p className="text-slate-400 text-xs mb-1">Random sample</p>
                <p className="text-blue-400 font-mono text-sm">=&theta;*(RAND()^(-1/&alpha;)-1)</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },

    // Section 10: Exam P Strategy Cheat Sheet
    {
      title: 'Exam P Strategy Cheat Sheet',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-red-500/20 to-yellow-500/20 rounded-xl p-6 border border-red-500/30">
            <h3 className="text-xl font-bold text-white mb-4">Everything on One Page</h3>
            <p className="text-slate-300">
              Memorize these formulas and traps for Exam P. This is your go-to reference.
            </p>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h4 className="text-lg font-semibold text-white mb-4">Formula Summary</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-600">
                    <th className="text-left text-slate-400 py-2 px-3">Property</th>
                    <th className="text-left text-purple-400 py-2 px-3">Beta(&alpha;, &beta;)</th>
                    <th className="text-left text-blue-400 py-2 px-3">Weibull(k, &lambda;)</th>
                    <th className="text-left text-orange-400 py-2 px-3">Pareto(&alpha;, &theta;)</th>
                  </tr>
                </thead>
                <tbody className="text-slate-300 font-mono text-xs">
                  <tr className="border-b border-slate-700">
                    <td className="py-2 px-3 font-sans font-semibold">Support</td>
                    <td className="py-2 px-3">[0, 1]</td>
                    <td className="py-2 px-3">[0, &infin;)</td>
                    <td className="py-2 px-3">[0, &infin;)</td>
                  </tr>
                  <tr className="border-b border-slate-700">
                    <td className="py-2 px-3 font-sans font-semibold">Mean</td>
                    <td className="py-2 px-3">&alpha;/(&alpha;+&beta;)</td>
                    <td className="py-2 px-3">&lambda;&Gamma;(1+1/k)</td>
                    <td className="py-2 px-3">&theta;/(&alpha;-1), &alpha;&gt;1</td>
                  </tr>
                  <tr className="border-b border-slate-700">
                    <td className="py-2 px-3 font-sans font-semibold">Variance</td>
                    <td className="py-2 px-3">&alpha;&beta;/((&alpha;+&beta;)&sup2;(&alpha;+&beta;+1))</td>
                    <td className="py-2 px-3">&lambda;&sup2;[&Gamma;(1+2/k)-&Gamma;&sup2;(1+1/k)]</td>
                    <td className="py-2 px-3">&alpha;&theta;&sup2;/((&alpha;-1)&sup2;(&alpha;-2)), &alpha;&gt;2</td>
                  </tr>
                  <tr className="border-b border-slate-700">
                    <td className="py-2 px-3 font-sans font-semibold">CDF</td>
                    <td className="py-2 px-3">I<sub>x</sub>(&alpha;,&beta;)</td>
                    <td className="py-2 px-3">1-e<sup>-(x/&lambda;)<sup>k</sup></sup></td>
                    <td className="py-2 px-3">1-(&theta;/(x+&theta;))<sup>&alpha;</sup></td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-sans font-semibold">Special</td>
                    <td className="py-2 px-3">Beta(1,1)=U(0,1)</td>
                    <td className="py-2 px-3">k=1 &rArr; Exp</td>
                    <td className="py-2 px-3">ln(1+X/&theta;)~Exp(&alpha;)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h4 className="text-lg font-semibold text-white mb-4">Common Exam Traps</h4>
            <div className="space-y-3">
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                <p className="text-red-400 font-semibold text-sm">Pareto mean/variance existence</p>
                <p className="text-slate-300 text-xs">E[X] only exists when &alpha; &gt; 1. Var(X) only when &alpha; &gt; 2. If they ask for the variance and &alpha; = 1.5, it&apos;s infinite!</p>
              </div>
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                <p className="text-red-400 font-semibold text-sm">Weibull &lambda; is scale, not rate</p>
                <p className="text-slate-300 text-xs">When k=1, mean = &lambda; (not 1/&lambda; as with Exponential rate parameterization).</p>
              </div>
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                <p className="text-red-400 font-semibold text-sm">Beta CDF has no simple formula</p>
                <p className="text-slate-300 text-xs">You cannot write F(x) in closed form. On Exam P, Beta CDF problems use special parameter values where the integral simplifies (like integer &alpha;, &beta;).</p>
              </div>
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                <p className="text-red-400 font-semibold text-sm">SOA vs classical Pareto</p>
                <p className="text-slate-300 text-xs">SOA uses F(x) = 1 - (&theta;/(x+&theta;))^&alpha; with support [0, &infin;). Classical uses F(x) = 1 - (&theta;/x)^&alpha; with support [&theta;, &infin;). Don&apos;t mix them up.</p>
              </div>
            </div>
          </div>

          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <h4 className="text-green-400 font-semibold mb-2">Quick Decision Guide</h4>
            <div className="text-green-200 text-sm space-y-1">
              <p>&bull; Data bounded in [0,1]? &rarr; <strong>Beta</strong></p>
              <p>&bull; Lifetime/reliability with non-constant failure rate? &rarr; <strong>Weibull</strong></p>
              <p>&bull; Heavy-tailed losses, insurance claims? &rarr; <strong>Pareto</strong></p>
              <p>&bull; Constant failure rate? &rarr; Exponential (or Weibull with k=1)</p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const tabs = [
    { id: 'learn' as TabType, label: 'Learn', icon: BookOpen },
    { id: 'simulate' as TabType, label: 'Simulate', icon: Play },
    { id: 'practice' as TabType, label: 'Practice', icon: Target },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/chapter/3" className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-400" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white">3.4 Additional Models</h1>
            <p className="text-sm text-slate-400">Beta, Weibull, and Pareto distributions</p>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex border-b border-slate-700">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

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
                      idx === learnSection ? 'bg-purple-500' : idx < learnSection ? 'bg-purple-500/50' : 'bg-slate-600'
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
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
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
              <h2 className="text-2xl font-bold text-white mb-4">Beta, Weibull &amp; Pareto Explorer</h2>
              <p className="text-slate-400 mb-6">
                Switch between Beta, Weibull, and Pareto distributions. Adjust parameters,
                calculate probabilities, generate synthetic data, and download Excel templates.
              </p>
            </div>

            <AdditionalModelsSimulator />

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <p className="text-yellow-200 text-sm">
                <strong>Experiment Ideas:</strong> Set Beta to (1,1) and verify it&apos;s Uniform.
                Set Weibull k=1 to see the Exponential. Try Pareto with &alpha; &lt; 2 and generate
                1,000 samples &mdash; notice the huge outliers from the heavy tail.
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
                Test your understanding of Beta, Weibull, and Pareto distributions with
                these Exam P-style problems covering CDF calculations, moment conditions,
                hazard rates, and insurance applications.
              </p>
            </div>

            <PracticeProblems section="3.4" />
          </div>
        )}
      </main>
    </div>
  );
}
