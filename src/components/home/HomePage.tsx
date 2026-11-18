import Link from 'next/link';
import { ArrowRight, ArrowUpRight, BookOpen, Braces, BriefcaseBusiness, ChartNoAxesCombined, GraduationCap, Languages, MapPin, Workflow, Zap } from 'lucide-react';
import FrontierMindsLogo from '@/components/FrontierMindsLogo';
import { deductibleLab, emailCaseLab, responseLab, schoolCall } from '@/content/activities';
import PolicyPreview from './PolicyPreview';
import ProbabilityPreview from './ProbabilityPreview';
import styles from './home.module.css';

type HomeProps = { examChapters: number; examQuestions: number; salesforceLessons: number };

export default function HomePage({ examChapters, examQuestions, salesforceLessons }: HomeProps) {
  return <div className={styles.home}>
    <a className={styles.skip} href="#choose">Skip to the learning labs</a>
    <header className={styles.header}><div className={styles.nav}>
      <Link href="/" className={styles.brand} aria-label="FrontierMinds home"><span><FrontierMindsLogo size="sm" showText={false} /></span>FrontierMinds</Link>
      <nav aria-label="Main navigation"><a href="#choose">Labs</a><a href="#courses">Courses</a><Link href="/comunidad" lang="es">Comunidad <ArrowUpRight size={14} aria-hidden="true" /></Link></nav>
    </div></header>
    <main>
      <section className={styles.hero} aria-labelledby="home-title"><div className={styles.heroInner}>
        <div className={styles.heroCopy}>
          <h1 id="home-title">Actuarial math<br /><em>&amp; AI in practice.</em></h1>
          <p>Change a deductible and see who pays. Then step into a Salesforce service queue and decide which AI replies the records support.</p>
          <div className={styles.heroActions}><a className={styles.primary} href="#choose">Explore the labs <ArrowRight size={17} aria-hidden="true" /></a><a className={styles.heroLink} href="#courses">Browse courses</a></div>
        </div>
        <PolicyPreview />
      </div></section>

      <section id="choose" className={styles.section} aria-labelledby="labs-title"><div className={styles.sectionBar}><h2 id="labs-title">Learning labs</h2><p>Run an experiment or review a case in your browser.</p></div>
        <div className={styles.labCards}>
          <Link href={deductibleLab.path} className={styles.labCard}>
            <div className={styles.cardTop}><span className={styles.warmIcon}><ChartNoAxesCombined size={25} aria-hidden="true" /></span><span>Actuarial science</span></div>
            <h3>{deductibleLab.title}</h3><p>Run the same losses through two insurance contracts, then train a model and check its payout prediction.</p><span className={styles.cardLink}>Start the experiment <ArrowRight size={16} aria-hidden="true" /></span>
          </Link>
          <Link href={responseLab.path} className={styles.labCard}>
            <div className={styles.cardTop}><span className={styles.greenIcon}><Braces size={25} aria-hidden="true" /></span><span>Salesforce &amp; AI</span></div>
            <h3>{responseLab.title}</h3><p>Check three sample AI replies against case records. Choose when to use a reply, rewrite it, or hand it to a specialist.</p><span className={styles.cardLink}>Open the case queue <ArrowRight size={16} aria-hidden="true" /></span>
          </Link>
        </div>
        <div className={styles.moreLabs}><Link href={emailCaseLab.path}><Workflow size={18} aria-hidden="true" />Email-to-Case lab <ArrowUpRight size={15} aria-hidden="true" /></Link><Link href={schoolCall.path} lang="es"><Languages size={18} aria-hidden="true" />{schoolCall.title} <ArrowUpRight size={15} aria-hidden="true" /></Link></div>
      </section>

      <section id="courses" className={styles.curriculum} aria-labelledby="course-title"><div className={styles.section}>
        <div className={styles.sectionBar}><h2 id="course-title">Learning paths</h2><p>Follow a course or return to your study desk.</p></div>
        <div className={styles.paths}>
          <article><div className={styles.courseName}><BookOpen size={21} aria-hidden="true" /><h3><Link href="/courses/exam-p">Actuarial Exam P</Link></h3></div><p>Build probability skills with worked examples, simulations, and timed practice.</p><small>{examChapters} chapters · {examQuestions} questions</small><div><Link href="/courses/exam-p">Open course <ArrowRight size={15} aria-hidden="true" /></Link><Link href="/courses/exam-p/study">Study desk</Link></div></article>
          <article><div className={styles.courseName}><Workflow size={21} aria-hidden="true" /><h3><Link href="/courses/salesforce">Salesforce &amp; AI</Link></h3></div><p>Build a Flow, test an integration, and rehearse a release from development to production.</p><small>{salesforceLessons} applied lessons</small><div><Link href="/courses/salesforce">Open course <ArrowRight size={15} aria-hidden="true" /></Link><Link href="/courses/salesforce/study">Study desk</Link></div></article>
        </div>
        <div className={styles.referenceRow}><Link href="/guides/ai-probability-actuarial-science">Field guide to AI and probability <ArrowUpRight size={16} aria-hidden="true" /></Link><details><summary>Try the fair-coin explorer</summary><ProbabilityPreview /></details></div>
      </div></section>

      <section className={styles.community} aria-labelledby="community-title" lang="es"><div className={styles.communityInner}>
        <div><p className={styles.place}><MapPin size={16} aria-hidden="true" />West Palm Beach, Florida</p><h2 id="community-title">Comunidad<br /><em>en español.</em></h2><p className={styles.communityIntro}>Guías para encontrar ayuda con la luz, buscar trabajo e inscribir a tus hijos en la escuela.</p><Link href="/comunidad" className={styles.communityLink}>Ver todas las guías <ArrowRight size={17} aria-hidden="true" /></Link></div>
        <nav aria-label="Recursos para tu familia">{[{ id: 'luz', name: 'Ayuda con la luz', Icon: Zap }, { id: 'empleo', name: 'Encontrar trabajo', Icon: BriefcaseBusiness }, { id: 'escuela', name: 'Inscribir a mis hijos', Icon: GraduationCap }, { id: 'ingles', name: 'Aprender inglés', Icon: Languages }].map(({ id, name, Icon }) => <Link key={id} href={'/comunidad#guia-' + id}><Icon size={19} aria-hidden="true" />{name}<ArrowUpRight size={17} aria-hidden="true" /></Link>)}</nav>
      </div></section>
    </main>
    <footer id="about" className={styles.footer}><div><strong>FrontierMinds</strong><p>Independent learning and community guides by Carlos Verdugo.</p></div><div id="contact"><a href="mailto:info@frontierminds.io">info@frontierminds.io <ArrowUpRight size={14} aria-hidden="true" /></a><small>© {new Date().getFullYear()} FrontierMinds LLC</small></div></footer>
  </div>;
}
