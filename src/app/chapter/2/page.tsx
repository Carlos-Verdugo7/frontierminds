'use client';

import Link from 'next/link';
import { ArrowLeft, Play, CheckCircle, Circle, Lock } from 'lucide-react';

const sections = [
  {
    id: 1,
    title: '2.1 Random Variables of the Discrete Type',
    description: 'Discrete random variables, PMF, CDF, and the hypergeometric distribution',
    topics: ['Random Variables', 'PMF', 'CDF', 'Discrete Uniform', 'Hypergeometric Distribution'],
    status: 'available',
  },
  {
    id: 2,
    title: '2.2 Mathematical Expectation',
    description: 'Expected value, mean, linearity of expectation, and distribution means',
    topics: ['E[X]', 'E[u(X)]', 'Linearity', 'Hypergeometric Mean', 'Geometric Mean'],
    status: 'available',
  },
  {
    id: 3,
    title: '2.3 Special Mathematical Expectations',
    description: 'Variance, standard deviation, moments, and moment-generating functions',
    topics: ['Variance', 'Standard Deviation', 'MGF', 'Moments', 'Factorial Moments', 'Geometric Variance'],
    status: 'available',
  },
  {
    id: 4,
    title: '2.4 Binomial Distribution',
    description: 'Bernoulli trials, binomial distribution, and its properties',
    topics: ['Bernoulli Trials', 'Binomial PMF', 'Binomial Mean & Variance', 'Binomial MGF'],
    status: 'available',
  },
  {
    id: 5,
    title: '2.5 Negative Binomial Distribution',
    description: 'Geometric distribution, negative binomial, and waiting for successes',
    topics: ['Geometric Distribution', 'Negative Binomial PMF', 'Memoryless Property', 'Coupon Collector'],
    status: 'available',
  },
  {
    id: 6,
    title: '2.6 Poisson Distribution',
    description: 'Poisson process and the Poisson distribution',
    topics: ['Poisson PMF', 'Mean=Variance=λ', 'Poisson Approximation', 'Poisson Process'],
    status: 'available',
  },
];

export default function Chapter2Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/courses/exam-p" className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-400" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white">Chapter 2: Discrete Distributions</h1>
            <p className="text-sm text-slate-400">~20% of Exam P</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Chapter Overview */}
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Chapter Overview</h2>
          <p className="text-slate-400 mb-4">
            This chapter introduces discrete random variables and their distributions. You will learn how to
            describe the probability behavior of a discrete random variable using its probability mass function
            (PMF) and cumulative distribution function (CDF), and study important families like the
            hypergeometric, binomial, and Poisson distributions.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-700/50 rounded-lg p-4">
              <p className="text-2xl font-bold text-green-400">6</p>
              <p className="text-sm text-slate-400">Sections</p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4">
              <p className="text-2xl font-bold text-blue-400">8</p>
              <p className="text-sm text-slate-400">Simulators</p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4">
              <p className="text-2xl font-bold text-purple-400">80</p>
              <p className="text-sm text-slate-400">Practice Problems</p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4">
              <p className="text-2xl font-bold text-orange-400">~20%</p>
              <p className="text-sm text-slate-400">Of Exam P</p>
            </div>
          </div>
        </div>

        {/* Key Formulas Preview */}
        <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-xl p-6 border border-green-500/20 mb-8">
          <h3 className="text-xl font-bold text-white mb-4">Key Formulas You'll Learn</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-slate-800/80 rounded-lg p-4">
              <p className="text-green-400 font-mono text-sm mb-1">PMF Properties</p>
              <p className="text-white font-mono">f(x) {'>'} 0, &Sigma; f(x) = 1</p>
            </div>
            <div className="bg-slate-800/80 rounded-lg p-4">
              <p className="text-green-400 font-mono text-sm mb-1">CDF Definition</p>
              <p className="text-white font-mono">F(x) = P(X &le; x)</p>
            </div>
            <div className="bg-slate-800/80 rounded-lg p-4">
              <p className="text-green-400 font-mono text-sm mb-1">Hypergeometric</p>
              <p className="text-white font-mono">f(x) = C(N₁,x)C(N₂,n-x)/C(N,n)</p>
            </div>
            <div className="bg-slate-800/80 rounded-lg p-4">
              <p className="text-yellow-400 font-mono text-sm mb-1">Expected Value</p>
              <p className="text-white font-mono">E[u(X)] = &Sigma; u(x)f(x)</p>
            </div>
            <div className="bg-slate-800/80 rounded-lg p-4">
              <p className="text-yellow-400 font-mono text-sm mb-1">Hypergeometric Mean</p>
              <p className="text-white font-mono">&mu; = n(N₁/N)</p>
            </div>
            <div className="bg-slate-800/80 rounded-lg p-4">
              <p className="text-yellow-400 font-mono text-sm mb-1">Geometric Mean</p>
              <p className="text-white font-mono">&mu; = 1/p</p>
            </div>
            <div className="bg-slate-800/80 rounded-lg p-4">
              <p className="text-purple-400 font-mono text-sm mb-1">Variance Shortcut</p>
              <p className="text-white font-mono">&sigma;&sup2; = E(X&sup2;) - &mu;&sup2;</p>
            </div>
            <div className="bg-slate-800/80 rounded-lg p-4">
              <p className="text-purple-400 font-mono text-sm mb-1">MGF Definition</p>
              <p className="text-white font-mono">M(t) = E(e<sup>tX</sup>)</p>
            </div>
            <div className="bg-slate-800/80 rounded-lg p-4">
              <p className="text-purple-400 font-mono text-sm mb-1">Geometric Variance</p>
              <p className="text-white font-mono">&sigma;&sup2; = q/p&sup2;</p>
            </div>
            <div className="bg-slate-800/80 rounded-lg p-4">
              <p className="text-orange-400 font-mono text-sm mb-1">Binomial PMF</p>
              <p className="text-white font-mono">f(x) = C(n,x)p<sup>x</sup>q<sup>n-x</sup></p>
            </div>
            <div className="bg-slate-800/80 rounded-lg p-4">
              <p className="text-orange-400 font-mono text-sm mb-1">Binomial Mean/Var</p>
              <p className="text-white font-mono">&mu; = np, &sigma;&sup2; = npq</p>
            </div>
            <div className="bg-slate-800/80 rounded-lg p-4">
              <p className="text-pink-400 font-mono text-sm mb-1">Geometric PMF</p>
              <p className="text-white font-mono">f(x) = p·q<sup>x-1</sup></p>
            </div>
            <div className="bg-slate-800/80 rounded-lg p-4">
              <p className="text-pink-400 font-mono text-sm mb-1">Geometric Mean/Var</p>
              <p className="text-white font-mono">&mu; = 1/p, &sigma;&sup2; = q/p&sup2;</p>
            </div>
            <div className="bg-slate-800/80 rounded-lg p-4">
              <p className="text-blue-400 font-mono text-sm mb-1">Poisson PMF</p>
              <p className="text-white font-mono">f(x) = &lambda;<sup>x</sup>e<sup>-&lambda;</sup>/x!</p>
            </div>
            <div className="bg-slate-800/80 rounded-lg p-4">
              <p className="text-blue-400 font-mono text-sm mb-1">Poisson Mean = Var</p>
              <p className="text-white font-mono">&mu; = &sigma;&sup2; = &lambda;</p>
            </div>
          </div>
        </div>

        {/* Sections List */}
        <h3 className="text-xl font-bold text-white mb-4">Sections</h3>
        <div className="space-y-4">
          {sections.map((section) => (
            <div
              key={section.id}
              className={`bg-slate-800 rounded-xl border border-slate-700 overflow-hidden hover:border-slate-600 transition-colors ${
                section.status === 'coming-soon' ? 'opacity-60' : ''
              }`}
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      {section.status === 'completed' ? (
                        <CheckCircle className="w-6 h-6 text-green-400" />
                      ) : section.status === 'coming-soon' ? (
                        <Lock className="w-6 h-6 text-slate-600" />
                      ) : (
                        <Circle className="w-6 h-6 text-slate-600" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-1">{section.title}</h4>
                      <p className="text-sm text-slate-400 mb-3">{section.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {section.topics.map((topic, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-slate-700 rounded text-xs text-slate-300"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  {section.status === 'available' ? (
                    <Link
                      href={`/chapter/2/section/${section.id}`}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      <Play className="w-4 h-4" />
                      Start
                    </Link>
                  ) : (
                    <span className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-slate-500 rounded-lg text-sm cursor-not-allowed">
                      <Lock className="w-4 h-4" />
                      Soon
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
