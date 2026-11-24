import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, BookOpen, BriefcaseBusiness, GraduationCap, Languages, Zap } from 'lucide-react';
import { deductibleLab, emailCaseLab, responseLab, schoolCall, medallionLab } from '@/content/activities';
import PolicyPreview from './PolicyPreview';
import ProbabilityPreview from './ProbabilityPreview';
import styles from './home.module.css';

const paths = [
  { href: '/courses/exam-p', cover: 'actuarial', title: 'Actuarial math', detail: 'Build probability intuition with simulations, worked examples, and Exam P practice.' },
  { href: '/courses/salesforce', cover: 'salesforce', title: 'Salesforce & AI', detail: 'Build a support workflow, test a release, and check an AI reply against a case record.' },
  { href: '/courses/data-engineering', cover: 'data-engineering', title: 'Data Engineering & AI', detail: 'Ingest with Fivetran, build Bronze/Silver/Gold with AI, and validate analysis and PDF reports — with free local labs.' },
  { href: '/comunidad', cover: 'comunidad', title: 'Comunidad en español', detail: 'Encuentra ayuda con la luz, el trabajo, la escuela y el inglés en West Palm Beach.' },
];
const labs = [
  [medallionLab.path, 'Data', medallionLab.title],
  [deductibleLab.path, 'Insurance', deductibleLab.title],
  [responseLab.path, 'Salesforce', responseLab.title],
  [emailCaseLab.path, 'Salesforce', 'Email-to-Case lab'],
  [schoolCall.path, 'Comunidad', schoolCall.title],
];
const guides = [
  { id: 'luz', label: 'Ayuda con la luz', Icon: Zap },
  { id: 'empleo', label: 'Encontrar trabajo', Icon: BriefcaseBusiness },
  { id: 'escuela', label: 'Inscribir a mis hijos', Icon: GraduationCap },
  { id: 'ingles', label: 'Aprender inglés', Icon: Languages },
];

export default function HomePage() {
  return <main className={styles.home}>
    <section id="courses" className={'site-width ' + styles.directory} aria-labelledby="home-title">
      <div className={styles.intro}>
        <h1 id="home-title">Choose your <em>field guide.</em></h1>
        <p>Learn a skill or find local support. Start with the subject that brought you here.</p>
      </div>
      <div className={styles.covers}>{paths.map(path => <Link key={path.href} href={path.href} className={styles.cover} lang={path.cover === 'comunidad' ? 'es' : 'en'}>
        <div className={styles.photo}>{path.cover === 'data-engineering' ? <div className={styles.pipelineCover} aria-hidden="true"><span>DATA PIPELINE</span><strong>INGEST</strong><b>BRONZE</b><b>SILVER</b><b>GOLD</b><span>ANALYZE & REPORT</span></div> : <Image src={'/field-guides/' + path.cover + '.webp'} alt="" width={960} height={640} sizes="(max-width: 600px) 96px, (max-width: 1200px) 31vw, 372px" loading="eager" />}</div>
        <div className={styles.cardCopy}><div className={styles.cardTitle}><h2>{path.title}</h2><span aria-hidden="true"><ArrowUpRight size={20} /></span></div><p>{path.detail}</p></div>
      </Link>)}</div>
    </section>

    <section id="choose" className={styles.workbench} aria-labelledby="labs-title"><div className={'site-width ' + styles.workbenchGrid}>
      <div><h2 id="labs-title" className={styles.heading}>Try a lab.</h2>
        <p className={styles.lede}>Explore free, hands-on labs. Reconcile a data pipeline, test an insurance model, or audit an AI response against its evidence.</p>
        <nav className={styles.labList} aria-label="Practice labs">{labs.map(([href, area, title]) => <Link href={href} key={href} lang={area === 'Comunidad' ? 'es' : 'en'}><span>{area}</span><strong>{title}</strong><ArrowRight size={17} aria-hidden="true" /></Link>)}</nav>
      </div><PolicyPreview />
    </div></section>

    <div className={'site-width ' + styles.resources}>
      <section aria-labelledby="study-title"><h2 id="study-title">Study resources</h2><div className={styles.linkRows}>
        <Link href="/guides/ai-probability-actuarial-science"><BookOpen size={17} />Field guide to AI and probability<ArrowUpRight size={16} /></Link>
        <Link href="/courses/exam-p/study">Exam P study desk<ArrowRight size={16} /></Link>
        <Link href="/courses/salesforce/study">Salesforce study desk<ArrowRight size={16} /></Link>
        <Link href="/courses/data-engineering/study">Data Engineering study desk<ArrowRight size={16} /></Link>
        <details><summary>Try the fair-coin explorer</summary><ProbabilityPreview /></details>
      </div></section>
      <section aria-labelledby="family-title" lang="es"><h2 id="family-title">Guías para tu familia</h2><nav className={styles.linkRows} aria-label="Recursos para tu familia">{guides.map(({ id, label, Icon }) => <Link key={id} href={'/comunidad#guia-' + id}><Icon size={17} aria-hidden="true" />{label}<ArrowUpRight size={16} aria-hidden="true" /></Link>)}</nav></section>
    </div>
  </main>;
}
