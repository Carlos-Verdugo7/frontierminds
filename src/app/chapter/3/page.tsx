'use client';

import Link from 'next/link';
import { ArrowLeft, Play, CheckCircle, Circle, Lock } from 'lucide-react';

const sections = [
  {
    id: 1,
    title: '3.1 Random Variables of the Continuous Type',
    description: 'Continuous random variables, PDFs, CDFs, and the uniform distribution',
    topics: ['PDF Properties', 'CDF', 'Uniform Distribution', 'Mean & Variance', 'Percentiles'],
    status: 'available',
  },
  {
    id: 2,
    title: '3.2 Exponential, Gamma, and Chi-Square',
    description: 'Waiting times, the exponential distribution, and related distributions',
    topics: ['Exponential Distribution', 'Memoryless Property', 'Gamma Distribution', 'Chi-Square'],
    status: 'available',
  },
  {
    id: 3,
    title: '3.3 The Normal Distribution',
    description: 'The bell curve, standard normal, and normal approximations',
    topics: ['Normal PDF', 'Standard Normal', 'Z-scores', 'Normal Approximation'],
    status: 'available',
  },
  {
    id: 4,
    title: '3.4 Additional Models',
    description: 'Beta, Weibull, and other continuous distributions',
    topics: ['Beta Distribution', 'Weibull Distribution', 'Pareto Distribution'],
    status: 'coming-soon',
  },
];

export default function Chapter3Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/courses/exam-p" className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-400" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white">Chapter 3: Continuous Distributions</h1>
            <p className="text-sm text-slate-400">~25% of Exam P</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Chapter Overview */}
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Chapter Overview</h2>
          <p className="text-slate-400 mb-4">
            This chapter transitions from discrete to continuous random variables. You'll learn how to work
            with probability density functions (PDFs), cumulative distribution functions (CDFs), and master
            important distributions like uniform, exponential, gamma, and normal.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-700/50 rounded-lg p-4">
              <p className="text-2xl font-bold text-purple-400">4</p>
              <p className="text-sm text-slate-400">Sections</p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4">
              <p className="text-2xl font-bold text-blue-400">3</p>
              <p className="text-sm text-slate-400">Simulators</p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4">
              <p className="text-2xl font-bold text-green-400">36</p>
              <p className="text-sm text-slate-400">Practice Problems</p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4">
              <p className="text-2xl font-bold text-orange-400">~25%</p>
              <p className="text-sm text-slate-400">Of Exam P</p>
            </div>
          </div>
        </div>

        {/* Key Formulas Preview */}
        <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl p-6 border border-purple-500/20 mb-8">
          <h3 className="text-xl font-bold text-white mb-4">Key Formulas You'll Learn</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-slate-800/80 rounded-lg p-4">
              <p className="text-purple-400 font-mono text-sm mb-1">PDF Properties</p>
              <p className="text-white font-mono">f(x) &ge; 0, &int;f(x)dx = 1</p>
            </div>
            <div className="bg-slate-800/80 rounded-lg p-4">
              <p className="text-purple-400 font-mono text-sm mb-1">CDF Definition</p>
              <p className="text-white font-mono">F(x) = P(X &le; x) = &int;f(t)dt</p>
            </div>
            <div className="bg-slate-800/80 rounded-lg p-4">
              <p className="text-purple-400 font-mono text-sm mb-1">PDF from CDF</p>
              <p className="text-white font-mono">f(x) = F'(x)</p>
            </div>
            <div className="bg-slate-800/80 rounded-lg p-4">
              <p className="text-blue-400 font-mono text-sm mb-1">Uniform U(a,b)</p>
              <p className="text-white font-mono">f(x) = 1/(b-a)</p>
            </div>
            <div className="bg-slate-800/80 rounded-lg p-4">
              <p className="text-blue-400 font-mono text-sm mb-1">Uniform Mean</p>
              <p className="text-white font-mono">&mu; = (a+b)/2</p>
            </div>
            <div className="bg-slate-800/80 rounded-lg p-4">
              <p className="text-blue-400 font-mono text-sm mb-1">Uniform Variance</p>
              <p className="text-white font-mono">&sigma;&sup2; = (b-a)&sup2;/12</p>
            </div>
            <div className="bg-slate-800/80 rounded-lg p-4">
              <p className="text-green-400 font-mono text-sm mb-1">Mean (Continuous)</p>
              <p className="text-white font-mono">&mu; = &int;x&middot;f(x)dx</p>
            </div>
            <div className="bg-slate-800/80 rounded-lg p-4">
              <p className="text-green-400 font-mono text-sm mb-1">Variance (Continuous)</p>
              <p className="text-white font-mono">&sigma;&sup2; = &int;(x-&mu;)&sup2;f(x)dx</p>
            </div>
            <div className="bg-slate-800/80 rounded-lg p-4">
              <p className="text-green-400 font-mono text-sm mb-1">Percentile</p>
              <p className="text-white font-mono">F(&pi;<sub>p</sub>) = p</p>
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
                      href={`/chapter/3/section/${section.id}`}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-medium transition-colors"
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
