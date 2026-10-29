'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowDown, ArrowRight, ArrowUpRight, BookOpen, BriefcaseBusiness, Check, ChevronRight, Compass, GraduationCap, Languages, Mail, MapPin, MessageCircle, SlidersHorizontal, Sparkles, Workflow, Zap } from 'lucide-react';
import FrontierMindsLogo from '@/components/FrontierMindsLogo';
import styles from './home.module.css';

type HomeProps = { examChapters: number; examQuestions: number; salesforceLessons: number };
const probability = (flips: number) => (1 - Math.pow(0.5, flips)) * 100;
const chartPoint = (flips: number) => ({ x: 38 + (flips - 1) * 49, y: 110 - probability(flips) * 0.9 });

function ProbabilityPreview() {
  const [flips, setFlips] = useState(2);
  const chance = probability(flips);
  const point = chartPoint(flips);
  const points = Array.from({ length: 6 }, (_, i) => { const p = chartPoint(i + 1); return `${p.x},${p.y}`; }).join(' ');

  return <div className={styles.demo}>
    <div className={styles.demoTop}><span><span className={styles.dot} /> A LITTLE EXPLORATION</span><SlidersHorizontal size={17} aria-hidden="true" /></div>
    <h2>A fair coin.<br />A useful question.</h2>
    <p>What&apos;s the chance of getting at least one head if you flip a coin more than once?</p>
    <div className={styles.demoResult} aria-live="polite"><output htmlFor="coin-flips">{Number(chance.toFixed(2))}%</output><span>chance of at least one head<br />in {flips} independent {flips === 1 ? 'flip' : 'flips'}</span></div>
    <svg className={styles.chart} viewBox="0 0 320 135" role="img" aria-label={`With a fair coin, the chance of at least one head rises from 50 percent for one flip to 98.44 percent for six flips. Currently ${Number(chance.toFixed(2))} percent for ${flips} flips.`}>
      <defs><linearGradient id="home-probability-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#9bad7e" stopOpacity=".27" /><stop offset="100%" stopColor="#9bad7e" stopOpacity="0" /></linearGradient></defs>
      <line x1="38" y1="20" x2="294" y2="20" stroke="#d8deca" strokeDasharray="3 4" /><line x1="38" y1="65" x2="294" y2="65" stroke="#d8deca" strokeDasharray="3 4" />
      <text x="0" y="24">100%</text><text x="7" y="69">50%</text>
      <polygon points={`38,113 ${points} 283,113`} fill="url(#home-probability-fill)" />
      <polyline points={points} fill="none" stroke="#658263" strokeWidth="2.5" strokeLinejoin="round" />
      {Array.from({ length: 6 }, (_, i) => { const p = chartPoint(i + 1); return <g key={i}><circle cx={p.x} cy={p.y} r={3} fill="#658263" /><text x={p.x} y="130" textAnchor="middle">{i + 1}</text></g>; })}
      <circle cx={point.x} cy={point.y} r="7" fill="#b54b26" stroke="#fffdf7" strokeWidth="3" />
    </svg>
    <div className={styles.sliderLabel}><label htmlFor="coin-flips">Number of flips</label><span>{flips} / 6</span></div>
    <input id="coin-flips" className={styles.slider} type="range" min="1" max="6" step="1" value={flips} onChange={event => setFlips(Number(event.target.value))} aria-valuetext={`${flips} ${flips === 1 ? 'flip' : 'flips'}, ${Number(chance.toFixed(2))} percent chance of at least one head`} />
    <div className={styles.demoBottom}><span>Move the slider. Follow your curiosity.</span><Link href="/courses/exam-p" aria-label="Explore probability in the Actuarial Exam P course"><ArrowUpRight size={19} aria-hidden="true" /></Link></div>
  </div>;
}

export default function HomePage({ examChapters, examQuestions, salesforceLessons }: HomeProps) {
  return <main className={styles.home}>
    <a className={styles.skip} href="#choose">Skip to ways to get started</a>
    <div className={styles.topline}><span>A place to learn. A way forward.</span><Link href="/comunidad" lang="es">¿Buscas ayuda en español? <ArrowRight size={13} aria-hidden="true" /></Link></div>
    <nav className={styles.nav} aria-label="Main navigation">
      <Link href="/" className={styles.brand} aria-label="FrontierMinds home"><FrontierMindsLogo size="sm" showText={false} /><span>FrontierMinds<small>LEARNING & COMMUNITY</small></span></Link>
      <div className={styles.navLinks}><a href="#courses">Learning paths</a><Link href="/comunidad" lang="es">Comunidad</Link><a href="#about">Our approach</a></div>
      <a href="#contact" className={styles.navContact}>Let&apos;s connect <ArrowUpRight size={15} aria-hidden="true" /></a>
    </nav>

    <header className={styles.hero}>
      <div><p className={styles.eyebrow}><span className={styles.dot} /> CURIOSITY. CONFIDENCE. A NEXT STEP.</p><h1>Understand more.<br /><em>Move forward.</em></h1><p className={styles.intro}>Build a skill, explore an idea, or find support for your family. Practical learning and community resources, with a little help from AI.</p><div className={styles.heroActions}><a className={styles.primary} href="#courses">Find your learning path <ArrowRight size={17} aria-hidden="true" /></a><Link className={styles.textLink} href="/comunidad" lang="es">Recursos en español <ArrowUpRight size={16} aria-hidden="true" /></Link></div><p className={styles.heroNote}><Check size={15} aria-hidden="true" /> Explore freely. Start where you are.</p></div>
      <ProbabilityPreview />
    </header>

    <section id="choose" className={styles.choose} aria-labelledby="choose-title">
      <div className={styles.chooseIntro}><p className={styles.eyebrow}>YOUR NEXT STEP</p><h2 id="choose-title">What brings<br />you here?</h2></div>
      <a href="#courses" className={styles.chooseCard}><span className={styles.chooseIcon}><BookOpen size={23} aria-hidden="true" /></span><div><h3>I want to learn something.</h3><p>Explore probability and practical Salesforce skills.</p></div><ArrowDown size={19} aria-hidden="true" /></a>
      <Link href="/comunidad" className={styles.chooseCard} lang="es"><span className={`${styles.chooseIcon} ${styles.warmIcon}`}><MapPin size={23} aria-hidden="true" /></span><div><h3>Busco apoyo para mi familia.</h3><p>Luz, trabajo, escuela e inglés en Palm Beach County.</p></div><ArrowUpRight size={19} aria-hidden="true" /></Link>
    </section>

    <section id="courses" className={styles.section} aria-labelledby="courses-title">
      <div className={styles.sectionHeading}><div><p className={styles.eyebrow}><span>01</span> LEARN BY DOING</p><h2 id="courses-title">Make the next idea click.</h2></div><p>Explore the concept. Try it yourself.<br />Practice the reasoning.</p></div>
      <div className={styles.courseGrid}>
        <article className={styles.course}>
          <div className={`${styles.courseVisual} ${styles.probabilityVisual}`} aria-hidden="true"><span className={styles.visualLabel}>A LANGUAGE FOR UNCERTAINTY</span><div className={styles.venn}><span /><span /><div>P(A ∩ B)</div></div><div className={styles.visualFooter}><span>PROBABILITY</span><span>Explore · Simulate · Practice</span></div></div>
          <div className={styles.courseBody}><div className={styles.courseMeta}><span><span className={styles.dot} /> READY TO EXPLORE</span><span>{examChapters} chapters · {examQuestions} questions</span></div><h3>Actuarial Exam P</h3><p>Turn probability into something you can see and reason through. Build intuition with interactive simulations, worked examples, and exam practice.</p><ul><li><Check size={15} aria-hidden="true" /> Explore distributions and insurance applications</li><li><Check size={15} aria-hidden="true" /> Practice with mixed sets and timed exams</li><li><Check size={15} aria-hidden="true" /> Keep track of progress in your browser</li></ul><Link href="/courses/exam-p" className={styles.courseLink}>Explore probability <ArrowRight size={18} aria-hidden="true" /></Link></div>
        </article>
        <article className={styles.course}>
          <div className={`${styles.courseVisual} ${styles.workflowVisual}`} aria-hidden="true"><span className={styles.visualLabel}>FROM AN IDEA TO A WORKING PROCESS</span><div className={styles.workflow}><span><MessageCircle size={22} /><small>Case</small></span><ChevronRight size={18} /><span><Workflow size={22} /><small>Flow</small></span><ChevronRight size={18} /><span><Check size={22} /><small>Resolve</small></span></div><div className={styles.visualFooter}><span>SALESFORCE</span><span>Model · Automate · Report</span></div></div>
          <div className={styles.courseBody}><div className={styles.courseMeta}><span><span className={styles.dot} /> READY TO EXPLORE</span><span>{salesforceLessons} applied lessons</span></div><h3>Salesforce Foundations</h3><p>Connect the pieces of a customer-support workflow. Learn how data, access, automation, and reporting work together through applied lessons.</p><ul><li><Check size={15} aria-hidden="true" /> Build a data model and explore access decisions</li><li><Check size={15} aria-hidden="true" /> Work through Flow, SOQL, and reporting</li><li><Check size={15} aria-hidden="true" /> Apply your learning in a practice-org capstone</li></ul><Link href="/courses/salesforce" className={styles.courseLink}>Explore Salesforce <ArrowRight size={18} aria-hidden="true" /></Link></div>
        </article>
      </div>
      <div className={styles.roadmap}><Compass size={19} aria-hidden="true" /><div><strong>On the horizon: Snowflake.</strong><span> A learning path for SQL, data loading, and reliable pipelines is planned.</span></div><span className={styles.planned}>PLANNED</span></div>
    </section>

    <section className={styles.communitySection} aria-labelledby="community-title" lang="es"><div className={styles.communityLayout}>
      <div className={styles.communityCopy}><p className={styles.eyebrow}><span>02</span> COMUNIDAD · WEST PALM BEACH</p><span className={styles.location}><MapPin size={14} aria-hidden="true" /> PALM BEACH COUNTY, FLORIDA</span><h2 id="community-title">Para tu familia.<br /><em>Para tu próximo paso.</em></h2><p>Encontrar ayuda puede ser confuso. Reunimos guías en español para que sepas qué preparar, a quién llamar y por dónde empezar.</p><Link href="/comunidad" className={styles.lightButton}>Encontrar recursos para mi familia <ArrowRight size={17} aria-hidden="true" /></Link><p className={styles.communityNote}>Información clara. Fuentes oficiales. Sin crear una cuenta.</p></div>
      <div className={styles.resourceLinks} aria-label="Guías para tu familia">{[
        { id: 'luz', title: 'Ayuda con la luz', description: 'FPL y opciones de asistencia de pago', Icon: Zap },
        { id: 'empleo', title: 'Encontrar trabajo', description: 'Búsqueda, résumé y preparación', Icon: BriefcaseBusiness },
        { id: 'escuela', title: 'Inscribir a mis hijos', description: 'Escuela, formularios y documentos', Icon: GraduationCap },
        { id: 'ingles', title: 'Aprender inglés', description: 'Lectura, práctica y conversación', Icon: Languages },
      ].map(({ id, title, description, Icon }) => <Link key={id} href={`/comunidad#guia-${id}`}><span className={styles.resourceIcon}><Icon size={21} aria-hidden="true" /></span><span><strong>{title}</strong><small>{description}</small></span><ArrowUpRight size={18} aria-hidden="true" /></Link>)}</div>
    </div></section>

    <section className={styles.section} aria-labelledby="ai-guide-title"><div className={styles.aiGuide}>
      <div className={styles.aiGuideArt} aria-hidden="true"><Sparkles size={31} /><div className={styles.guideQuestion}>A convincing answer.<br /><em>But is it right?</em></div><div className={styles.artRule} /><span>ASK. TEST. UNDERSTAND.</span></div>
      <div className={styles.aiGuideCopy}><p className={styles.eyebrow}>A LITTLE PERSPECTIVE ON AI</p><h2 id="ai-guide-title">Better questions.<br />Deeper understanding.</h2><p>AI can explain an idea or suggest a next step. Learning comes from checking the reasoning, trying it yourself, and knowing what still needs a human answer.</p><p>Start with our guide to AI, probability, and actuarial learning, including a worked example you can check.</p><Link href="/guides/ai-probability-actuarial-science" className={styles.textLink}>Read the AI & probability guide <ArrowUpRight size={16} aria-hidden="true" /></Link></div>
    </div></section>

    <section id="about" className={styles.aboutSection} aria-labelledby="about-title"><div className={styles.aboutLayout}><div><p className={styles.eyebrow}><span>03</span> WHY FRONTIERMINDS</p><h2 id="about-title">Useful knowledge<br /><em>opens possibilities.</em></h2><p className={styles.founder}>Built by Carlos Verdugo · FrontierMinds LLC</p></div><div className={styles.aboutCopy}><p>We started with a simple belief: understanding grows when you can explore, ask questions, and try things for yourself.</p><p>That idea connects our learning paths and our community guides. Whether you&apos;re working through probability or preparing to contact a local organization, the goal is the same: a clearer, more confident next step.</p><div className={styles.principles}>{[{ Icon: SlidersHorizontal, title: 'Make it practical', text: 'Connect ideas to something you can try or do.' }, { Icon: Sparkles, title: 'Use AI thoughtfully', text: 'Use explanations as a starting point, then check them.' }, { Icon: MessageCircle, title: 'Keep listening', text: 'Let questions from real people guide what comes next.' }].map(({ Icon, title, text }) => <div key={title}><Icon size={19} aria-hidden="true" /><div><h3>{title}</h3><p>{text}</p></div></div>)}</div></div></div></section>

    <section id="contact" className={styles.contactSection} aria-labelledby="contact-title"><div><p className={styles.eyebrow}>LET&apos;S BUILD SOMETHING USEFUL</p><h2 id="contact-title">What would help you move forward?</h2><p>Suggest a learning topic, share an idea, or tell us where you could use more support.</p></div><a href="mailto:info@frontierminds.io" className={styles.primary}><Mail size={17} aria-hidden="true" /> info@frontierminds.io<ArrowUpRight size={16} aria-hidden="true" /></a></section>
    <footer className={styles.footer}><div className={styles.footerTop}><div><Link href="/" className={styles.footerBrand}>FrontierMinds</Link><p>Curiosity. Confidence. A next step.</p></div><div className={styles.footerLinks}><a href="#courses">Learning paths</a><Link href="/comunidad" lang="es">Comunidad en español</Link><a href="#about">About</a><a href="mailto:info@frontierminds.io">Contact</a></div></div><div className={styles.footerBottom}><span>© {new Date().getFullYear()} FrontierMinds LLC</span><span>Learning tools and independent community guidance.</span></div></footer>
  </main>;
}
