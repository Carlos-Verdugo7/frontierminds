'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowLeft, ExternalLink, FileSearch, FileText, Laptop, LockKeyhole, MapPin, ShieldCheck, Clock3, CircleHelp, Check, BookOpenCheck } from 'lucide-react';
import { sampleStatuses, uscisGlossary, uscisJourneys, uscisLinks, uscisSafety, type UscisGoal } from '@/content/uscis-guide';
import styles from './uscis.module.css';

const icons = { estado: FileSearch, cuenta: LockKeyhole, tiempos: Clock3, direccion: MapPin, ayuda: CircleHelp };
function Official({ url, label }: { url: string; label: string }) {
  return <a className={styles.outbound} href={url} target="_blank" rel="noopener noreferrer">{label}<ExternalLink size={16} aria-hidden="true" /><span className={styles.srOnly}> (abre una página oficial en otra pestaña)</span></a>;
}

export default function UscisGuide() {
  const [goal, setGoal] = useState<UscisGoal>('estado');
  const [index, setIndex] = useState(0);
  const [statusId, setStatusId] = useState('received');
  const journey = uscisJourneys.find(j => j.id === goal) ?? uscisJourneys[0];
  const status = sampleStatuses.find(s => s.id === statusId) ?? sampleStatuses[0];
  const choose = (next: UscisGoal) => { setGoal(next); setIndex(0); };

  return <main className={styles.page} lang="es">
    <div className="course-nav-wrap"><nav className="course-nav site-width" aria-label="Navegación de Comunidad">
      <Link href="/comunidad">Comunidad</Link><a href="#aprender">Paso a paso</a><a href="#mensajes">Mensajes</a><a href="#seguridad">Seguridad</a>
    </nav></div>
    <div className={styles.container}>
      <header className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>GUÍA COMUNITARIA · EN ESPAÑOL · GRATUITA</p>
          <h1>Aprende a usar <em>USCIS</em> sin complicaciones.</h1>
          <p className={styles.lead}>Entiende cómo consultar una solicitud, entrar a tu cuenta, revisar tiempos de espera y leer avisos. Puedes practicar aquí sin compartir información personal.</p>
          <a className={styles.primary} href="#aprender">Comenzar la guía <ArrowRight size={18} aria-hidden="true"/></a>
          <p className={styles.review}>Contenido revisado el 24 de noviembre de 2026 · Fuentes oficiales de USCIS</p>
        </div>
        <div className={styles.visual} role="img" aria-label="Ilustración educativa de una notificación de recibo y el proceso de consulta; no muestra el portal real">
          <div className={styles.visualTop}><ShieldCheck size={18}/><span>SIMULACIÓN EDUCATIVA</span></div>
          <div className={styles.visualInner}><span>01 / CONSULTA</span><h2>¿Qué necesito para revisar mi caso?</h2>
            <div className={styles.receipt}><FileText size={29}/><div><strong>Notificación de recibo</strong><p>3 letras + 10 números</p><small>Introduce tus datos solo en USCIS</small></div></div>
            <p>Recibo → Portal oficial → Leer aviso</p>
          </div>
        </div>
      </header>
      <aside role="note" className={styles.disclosure}><ShieldCheck size={22} aria-hidden="true"/><p><strong>FrontierMinds no es una página del gobierno ni está afiliada a USCIS.</strong> Esta guía es educativa y no ofrece asesoría legal ni seguimiento de expedientes. No solicitamos, comprobamos o almacenamos contraseñas, números de recibo o documentos.</p></aside>

      <section id="aprender" className={styles.section}>
        <p className={styles.eyebrow}>01 / ESCOGE TU TAREA</p><h2>¿Qué quieres aprender hoy?</h2>
        <p className={styles.sectionIntro}>Elige una opción. Te mostraremos cada paso y un enlace directo a la herramienta oficial.</p>
        <div role="group" aria-label="Tareas para aprender sobre USCIS" className={styles.goals}>
          {uscisJourneys.map(j => { const Icon=icons[j.id]; return <button type="button" key={j.id} className={[styles.goal,goal===j.id?styles.active:''].join(' ')} aria-pressed={goal===j.id} onClick={()=>choose(j.id)}><Icon size={23} aria-hidden="true"/><strong>{j.title}</strong><small>{j.short}</small></button>; })}
        </div>
        <div className={styles.walkthrough}>
          <div className={styles.walkHeader}><p className={styles.eyebrow}>PASO {index+1} DE {journey.steps.length}</p><h3>{journey.title}</h3><p>{journey.intro}</p><div className={styles.progress} aria-label={'Paso '+(index+1)+' de '+journey.steps.length}>{journey.steps.map((s,i)=><span className={i<=index?styles.done:''} key={s.title}/>)}</div></div>
          <div className={styles.step} aria-live="polite" aria-atomic="true"><span className={styles.stepNum}>{index+1}</span><div><h4>{journey.steps[index].title}</h4><p>{journey.steps[index].detail}</p>{journey.steps[index].note && <p className={styles.caution}>{journey.steps[index].note}</p>}</div></div>
          <div className={styles.walkActions}>
            <div className={styles.controls}><button type="button" className={styles.secondary} disabled={index===0} onClick={()=>setIndex(x=>Math.max(0,x-1))}><ArrowLeft size={16}/> Anterior</button><button type="button" className={styles.primary} disabled={index===journey.steps.length-1} onClick={()=>setIndex(x=>Math.min(journey.steps.length-1,x+1))}>Siguiente <ArrowRight size={16}/></button></div>
            <Official url={journey.url} label={journey.officialLabel}/>
          </div>
          <p className={styles.reminder}><ShieldCheck size={18}/>{journey.remember}</p>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="phone-title">
        <p className={styles.eyebrow}>02 / DESDE TU CELULAR O COMPUTADORA</p><h2 id="phone-title">¿Necesito instalar una aplicación?</h2>
        <div className={styles.duo}>
          <article><Laptop size={29}/><h3>Consultar el estatus en la web</h3><p>Puedes usar el navegador de tu iPhone, Android o computadora. Para la consulta pública de estatus no necesitas instalar una aplicación ni iniciar sesión.</p><Official url={uscisLinks.status} label="Abrir Estatus de Caso en Línea"/></article>
          <article><LockKeyhole size={29}/><h3>Utilizar una cuenta myUSCIS</h3><p>Algunos trámites ofrecen herramientas de cuenta, documentos y mensajes. Crea tu cuenta directamente en el sitio oficial y usa la autenticación de dos pasos.</p><Official url={uscisLinks.account} label="Entrar a myUSCIS"/></article>
        </div>
        <p className={styles.tip}>No necesitas una aplicación de terceros para seguir esta guía. Si alguna app solicita tu contraseña o código de seguridad de USCIS, evita entregarlos y usa el sitio oficial.</p>
      </section>

      <section className={styles.section} id="mensajes">
        <p className={styles.eyebrow}>03 / SIMULADOR SIN CASOS REALES</p><h2>¿Qué significan los mensajes?</h2><p className={styles.sectionIntro}>Pulsa un ejemplo. Estos textos no representan una actualización de tu expediente.</p>
        <div className={styles.statusGrid}>
          <div className={styles.statusList} role="group" aria-label="Mensajes ilustrativos de USCIS">{sampleStatuses.map(s=><button key={s.id} type="button" aria-pressed={statusId===s.id} className={statusId===s.id?styles.selected:''} onClick={()=>setStatusId(s.id)}><span lang="en">{s.english}</span><small>{s.spanish}</small></button>)}</div>
          <div className={styles.statusAnswer} aria-live="polite" aria-atomic="true"><p className={styles.eyebrow}>EJEMPLO · NO ES UN RESULTADO REAL</p><h3 lang="en">{status.english}</h3><p className={styles.translation}>{status.spanish}</p><h4>¿Qué significa?</h4><p>{status.meaning}</p><h4>¿Qué puedes hacer?</h4><p>{status.next}</p><Official url={uscisLinks.status} label="Consultar mi caso real en USCIS"/></div>
        </div>
      </section>

      <section className={styles.section}>
        <p className={styles.eyebrow}>04 / VOCABULARIO ÚTIL</p><h2>Palabras que verás en inglés</h2>
        <div className={styles.glossary}>{uscisGlossary.map(g=><details key={g.en}><summary><span lang="en">{g.en}</span><span>{g.es}</span></summary><p>{g.desc}</p></details>)}</div>
      </section>
      <section className={styles.section} id="seguridad">
        <p className={styles.eyebrow}>05 / PROTECCIÓN Y AYUDA</p><h2>Antes de compartir datos, revisa esto</h2>
        <div className={styles.safety}><ul>{uscisSafety.map(s=><li key={s}><Check size={18} aria-hidden="true"/>{s}</li>)}</ul>
        <div className={styles.resources}><Official url={uscisLinks.scams} label="Evitar estafas de inmigración"/><Official url={uscisLinks.legalHelp} label="Encontrar servicios legales autorizados"/><Official url={uscisLinks.accountHelp} label="Ayuda técnica para mi cuenta"/></div></div>
      </section>
      <footer className={styles.end}><div><BookOpenCheck size={28}/><h2>Aprende aquí; realiza tus trámites en USCIS.</h2><p>Los portales pueden cambiar. Antes de responder un aviso o tomar una decisión sobre tu expediente, confirma las instrucciones y los plazos en la correspondencia y en las páginas oficiales.</p></div><div className={styles.resources}><Official url={uscisLinks.uscisSpanish} label="USCIS en español"/><Link className={styles.back} href="/comunidad">Volver a Comunidad <ArrowRight size={16}/></Link></div></footer>
    </div>
  </main>;
}
