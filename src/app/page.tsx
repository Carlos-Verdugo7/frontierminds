'use client';

import Link from 'next/link';
import { BookOpen, Target, Brain, TrendingUp, Sparkles, ArrowRight, Mail } from 'lucide-react';
import FrontierMindsLogo from '@/components/FrontierMindsLogo';

const courses = [
  {
    id: 'exam-p',
    title: 'Actuarial Exam P Trainer',
    description: 'Master probability theory through interactive simulations and hands-on practice. Based on Hogg\'s "Probability and Statistical Inference" 10th Edition.',
    chapters: 5,
    problems: '50+',
    status: 'available',
    href: '/courses/exam-p',
    color: 'from-blue-500 to-indigo-600',
    features: ['Interactive Simulations', 'Exam-Style Problems', 'Step-by-Step Solutions', 'Progress Tracking'],
  },
  {
    id: 'exam-fm',
    title: 'Actuarial Exam FM Trainer',
    description: 'Financial mathematics made intuitive with interactive compound interest calculators and bond pricing tools.',
    chapters: 6,
    problems: '60+',
    status: 'coming-soon',
    href: '#',
    color: 'from-green-500 to-emerald-600',
    features: ['Time Value of Money', 'Annuities & Loans', 'Bonds & Stocks', 'Derivatives Basics'],
  },
  {
    id: 'linear-algebra',
    title: 'Linear Algebra Visualized',
    description: 'See matrices come alive with 3D transformations, eigenvalue animations, and geometric intuition.',
    chapters: 8,
    problems: '80+',
    status: 'coming-soon',
    href: '#',
    color: 'from-purple-500 to-pink-600',
    features: ['3D Visualizations', 'Matrix Animations', 'Eigenvalue Explorer', 'SVD Decomposition'],
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <FrontierMindsLogo size="md" />
          <div className="flex items-center gap-6">
            <Link href="#courses" className="text-slate-400 hover:text-white text-sm transition-colors">
              Courses
            </Link>
            <Link href="#about" className="text-slate-400 hover:text-white text-sm transition-colors">
              About
            </Link>
            <Link href="#contact" className="text-slate-400 hover:text-white text-sm transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-blue-300">AI + Human Collaboration</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Learn Complex Topics<br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Through Interaction
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-8">
            We transform dense textbooks into engaging, interactive learning experiences.
            Powered by AI-human workflows that make complex concepts click.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/courses/exam-p"
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg font-medium transition-all flex items-center gap-2"
            >
              Start Learning Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="#about"
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-all border border-slate-700"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-20">
          {[
            { icon: BookOpen, value: '5+', label: 'Chapters', color: 'text-blue-400' },
            { icon: Target, value: '50+', label: 'Practice Problems', color: 'text-green-400' },
            { icon: Brain, value: '10+', label: 'Interactive Sims', color: 'text-purple-400' },
            { icon: TrendingUp, value: 'Free', label: 'Forever', color: 'text-yellow-400' },
          ].map((stat, idx) => (
            <div key={idx} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 text-center">
              <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-3`} />
              <p className="text-3xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Our Courses</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Each course combines AI-generated content with human expertise to create
            the most effective learning experience possible.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className={`relative rounded-xl overflow-hidden ${
                course.status === 'coming-soon' ? 'opacity-70' : ''
              }`}
            >
              <div className={`h-2 bg-gradient-to-r ${course.color}`} />
              <div className="bg-slate-800 p-6 border border-slate-700 border-t-0 rounded-b-xl h-full flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  {course.status === 'available' ? (
                    <span className="px-3 py-1 bg-green-500/20 rounded-full text-xs text-green-300 font-medium">
                      Available Now
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-slate-700 rounded-full text-xs text-slate-400">
                      Coming Soon
                    </span>
                  )}
                  <span className="px-2 py-1 bg-slate-700/50 rounded text-xs text-slate-400">
                    {course.chapters} Chapters
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
                <p className="text-sm text-slate-400 mb-4 flex-grow">{course.description}</p>

                <div className="space-y-2 mb-6">
                  {course.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-500">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                      {feature}
                    </div>
                  ))}
                </div>

                {course.status === 'available' ? (
                  <Link
                    href={course.href}
                    className={`block w-full py-3 px-4 bg-gradient-to-r ${course.color} hover:opacity-90 text-white rounded-lg text-sm text-center font-medium transition-all`}
                  >
                    Start Learning Free →
                  </Link>
                ) : (
                  <button
                    disabled
                    className="w-full py-3 px-4 bg-slate-700 text-slate-500 rounded-lg text-sm cursor-not-allowed"
                  >
                    Coming Soon
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 rounded-2xl p-8 md:p-12 border border-slate-700/50">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-white mb-4">Our Philosophy</h2>
            <blockquote className="text-xl text-slate-300 italic mb-4 border-l-4 border-blue-500 pl-6">
              "The first principle is that you must not fool yourself — and you are the easiest person to fool."
            </blockquote>
            <p className="text-slate-400 mb-6">
              — Richard Feynman
            </p>
            <p className="text-slate-400 leading-relaxed">
              Inspired by Feynman's approach to learning, we believe understanding comes from interaction,
              not memorization. Our courses let you play with concepts, see them in action, and build
              intuition through exploration. We use AI to generate content at scale, but every course
              is crafted with human insight to ensure accuracy and pedagogical effectiveness.
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">About FrontierMinds</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            We're building the future of technical education.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-slate-800/50 rounded-xl p-8 border border-slate-700/50">
            <h3 className="text-xl font-bold text-white mb-4">Our Mission</h3>
            <p className="text-slate-400 leading-relaxed">
              FrontierMinds LLC was founded to democratize access to high-quality, interactive learning materials.
              We leverage AI-human collaboration to transform complex textbooks into engaging experiences that
              anyone can use to master difficult subjects.
            </p>
          </div>

          <div className="bg-slate-800/50 rounded-xl p-8 border border-slate-700/50">
            <h3 className="text-xl font-bold text-white mb-4">Our Approach</h3>
            <p className="text-slate-400 leading-relaxed">
              Every course combines AI-generated content (simulations, explanations, problem variations)
              with human expertise (curriculum design, accuracy verification, pedagogical structure).
              The result: scalable, high-quality education that's free for everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="max-w-6xl mx-auto px-6 py-16">
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-8 md:p-12 border border-slate-700/50 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Get In Touch</h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">
            Have questions, suggestions, or want to collaborate? We'd love to hear from you.
          </p>
          <a
            href="mailto:info@frontierminds.io"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
          >
            <Mail className="w-5 h-5" />
            info@frontierminds.io
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col items-center md:items-start gap-2">
              <FrontierMindsLogo size="sm" />
              <p className="text-slate-500 text-sm">
                Founded by Carlos Verdugo
              </p>
            </div>

            <a
              href="mailto:info@frontierminds.io"
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              <Mail className="w-5 h-5" />
              <span className="text-sm">info@frontierminds.io</span>
            </a>

            <p className="text-slate-500 text-sm">
              © {new Date().getFullYear()} FrontierMinds LLC. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
