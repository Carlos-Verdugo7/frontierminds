'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { ArrowDown, ArrowRight, ArrowUpRight, BriefcaseBusiness, Check, CheckCheck, ClipboardList, GraduationCap, Languages, Mail, MessageCircle, ShieldCheck, Sparkles, Zap } from 'lucide-react';
import Image from 'next/image';
import { communityGuides, communityPosts, communityTasks, guidePreparation, type CommunityTopic } from '@/content/community';
import { trackCommunity } from '@/lib/community-analytics';
import { schoolCall } from '@/content/activities';
import { schoolDirectory } from '@/content/school-call';
import styles from './community.module.css';

const icons = { luz: Zap, empleo: BriefcaseBusiness, escuela: GraduationCap, ingles: Languages };
const topicCopy = {
  luz: { title: 'Ayuda con la luz', detail: 'FPL y asistencia de pago', color: 'amber' },
  empleo: { title: 'Encontrar trabajo', detail: 'Empleo y preparación', color: 'green' },
  escuela: { title: 'Inscribir a mis hijos', detail: 'Escuela y documentos', color: 'blue' },
  ingles: { title: 'Aprender inglés', detail: 'Clases y conversación', color: 'rose' },
} as const;
const taskCopy = {
  pasos: { title: 'Entender los pasos', detail: 'Una explicación en español sencillo.', icon: ClipboardList },
  lista: { title: 'Preparar mi visita', detail: 'Una lista para mi llamada o cita.', icon: CheckCheck },
  preguntas: { title: 'Preguntar en inglés', detail: 'Frases con traducción al español.', icon: Languages },
};
const formatDate = (date: string) => new Intl.DateTimeFormat('es-US', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${date}T12:00:00Z`));

export default function CommunityHub({ aiEnabled }: { aiEnabled: boolean }) {
  const [topic, setTopic] = useState<CommunityTopic>('luz');
  const [task, setTask] = useState<keyof typeof communityTasks>('pasos');
  const [result, setResult] = useState<{ topic: CommunityTopic; task: string; text: string; source: 'guide' | 'ai' } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<{ topic: CommunityTopic; task: string; text: string } | null>(null);
  const [votes, setVotes] = useState<Partial<Record<CommunityTopic, string>>>({});
  const [feedbackStatus, setFeedbackStatus] = useState('');
  const guide = communityGuides.find(item => item.id === topic)!;
  const GuideIcon = icons[topic];
  const lastGuideHash = useRef('');

  // Support shareable topic links, including links from the original draft.
  useEffect(() => {
    function readHash() {
      const hash = window.location.hash;
      const opened = communityGuides.find(item => hash === '#guia-' + item.id);
      if (opened) {
        setTopic(opened.id);
        if (lastGuideHash.current !== hash) trackCommunity({ action: 'guide_open', topic: opened.id });
        requestAnimationFrame(() => document.getElementById('guia')?.scrollIntoView({ block: 'start' }));
      }
      lastGuideHash.current = hash;
    }
    readHash();
    window.addEventListener('hashchange', readHash);
    return () => window.removeEventListener('hashchange', readHash);
  }, []);

  function selectGuide(id: CommunityTopic) {
    setTopic(id);
    requestAnimationFrame(() => {
      document.getElementById('guia')?.scrollIntoView({ block: 'start' });
      document.getElementById(`guia-${id}`)?.focus({ preventScroll: true });
    });
  }

  async function askAI(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const prepared = { topic, task, text: guidePreparation(guide, task), source: 'guide' as const };
    if (!aiEnabled) {
      setResult(prepared);
      return;
    }
    setBusy(true); setResult(null); setError(null);
    trackCommunity({ action: 'ai_request', topic, task });
    try {
      const response = await fetch('/api/community-help', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, task }), signal: AbortSignal.timeout(35000),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'No pudimos generar la respuesta. Inténtalo más tarde.');
      if (typeof data.reply !== 'string' || !data.reply.trim()) throw new Error('No llegó una respuesta. Inténtalo más tarde.');
      setResult({ topic, task, text: data.reply, source: 'ai' });
      trackCommunity({ action: 'ai_success', topic, task });
    } catch (failure) {
      setResult(prepared);
      setError({ topic, task, text: failure instanceof Error && failure.name !== 'TimeoutError' ? failure.message : 'La respuesta tardó demasiado. Usa la guía o inténtalo más tarde.' });
      trackCommunity({ action: 'ai_error', topic, task });
    } finally { setBusy(false); }
  }

  function prepareEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const category = String(data.get('topic'));
    const email = String(data.get('email')).trim();
    const message = String(data.get('message')).trim();
    if (!message) { setFeedbackStatus('Escribe tu comentario antes de abrir el correo.'); return; }
    const body = `Tema: ${category}\nCorreo para responder: ${email}\n\n${message}`;
    trackCommunity({ action: 'feedback_email_open', topic: category as CommunityTopic | 'otro' });
    window.location.href = `mailto:info@frontierminds.io?subject=${encodeURIComponent(`Comunidad — ${category}`)}&body=${encodeURIComponent(body)}`;
    setFeedbackStatus('Se solicitó abrir tu aplicación de correo. Revisa el mensaje y pulsa Enviar allí. Todavía no hemos recibido tu comentario. Si no se abre, escribe a info@frontierminds.io.');
  }

  return (
    <main lang="es" className={styles.hub}>
      <div className="course-nav-wrap"><nav className="course-nav site-width" aria-label="En esta guía">
        <a href="#recursos">Guías de ayuda</a><a href="#asistente">Preparar mi visita</a><a href="#novedades">Novedades</a><a href="#comentarios">Dar mi opinión</a>
      </nav></div>
      <header className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.location}>Comunidad en español</p>
          <h1>Guías para familias de <em>West Palm Beach.</em></h1>
          <p className={styles.intro}>Encuentra orientación en español para usar USCIS, pedir ayuda con la luz, buscar trabajo, inscribir a tus hijos o aprender inglés.</p>
          <div className={styles.actions}><a className={styles.primary} href="#recursos">Elegir una guía <ArrowDown size={17} aria-hidden="true" /></a><Link className={styles.textLink} href="/comunidad/uscis">Aprender a usar USCIS <ArrowUpRight size={16} aria-hidden="true" /></Link></div>
        </div>
        <Image className={styles.coverPhoto} src="/field-guides/comunidad.webp" alt="" width={960} height={640} sizes="(max-width: 600px) 100vw, 40vw" loading="eager" />
      </header>

      <section id="recursos" className={styles.section} aria-labelledby="resources-title">
        <div className={styles.sectionHeading}><h2 id="resources-title">¿Qué ayuda necesitas?</h2></div>
        <Link href="/comunidad/precios" className={styles.uscisPromo} aria-label="Comparar precios semanales de supermercados">
          <span><ShieldCheck size={27} aria-hidden="true" /></span><div><strong>Compara precios de carne y alimentos</strong><p>Ofertas semanales verificadas en West Palm Beach, con dirección, fechas y enlace al anuncio original.</p></div><ArrowUpRight size={22} aria-hidden="true" />
        </Link>
        <Link href="/comunidad/uscis" className={styles.uscisPromo} aria-label="Abrir la guía gratis para aprender a usar USCIS">
          <span><ShieldCheck size={27} aria-hidden="true" /></span><div><strong>Aprende a usar USCIS en español</strong><p>Consulta el estatus, entiende los avisos y practica cómo usar las herramientas oficiales, sin compartir datos personales.</p></div><ArrowUpRight size={22} aria-hidden="true" />
        </Link>
        <div className={styles.topics} aria-label="Temas de ayuda">
          {communityGuides.map(item => {
            const Icon = icons[item.id];
            const copy = topicCopy[item.id];
            return <a key={item.id} href={`#guia-${item.id}`} className={`${styles.topic} ${topic === item.id ? styles.topicActive : ''}`} aria-current={topic === item.id ? 'true' : undefined} onClick={() => selectGuide(item.id)}>
              <span className={styles.topicIcon} data-color={copy.color}><Icon size={23} aria-hidden="true" /></span><span><strong>{copy.title}</strong><small>{copy.detail}</small></span><ArrowUpRight className={styles.topicArrow} size={17} aria-hidden="true" />
            </a>;
          })}
        </div>

        <div id="guia" className={styles.guideAnchor}>
          <article id={`guia-${topic}`} tabIndex={-1} className={styles.guide} aria-labelledby="guide-title">
            <div className={styles.guideHeading}><div className={styles.guideLabel}><GuideIcon size={17} aria-hidden="true" /> {guide.label}</div><span className={styles.reviewed}><span className={styles.dot} /> Revisado el {formatDate(guide.reviewed)}</span></div>
            <div className={styles.guideIntro}><div><h3 id="guide-title">{guide.title}</h3><p>{guide.description}</p></div></div>
            <div className={styles.guideColumns}>
              <div className={styles.steps}><h4>Así puedes empezar</h4><ol>{guide.steps.map((step, index) => <li key={step}><span aria-hidden="true">{index + 1}</span><p>{step}</p></li>)}</ol>
                <div className={styles.guideAi}><Sparkles size={21} aria-hidden="true" /><div><strong>¿Te gustaría preparar esa llamada o visita?</strong><p>Prepara una lista o practica preguntas en inglés.</p><a href="#asistente">Prepararme sobre este tema <ArrowRight size={15} aria-hidden="true" /></a>
                  {topic === 'escuela' && <Link className={styles.rehearse} href={schoolCall.path}>{schoolCall.title} <ArrowRight size={15} aria-hidden="true" /></Link>}</div></div>
              </div>
              <aside className={styles.guideAside} aria-label="Preparación y contactos">
                <div className={styles.prepare}><h4><ClipboardList size={18} aria-hidden="true" /> Ten a mano</h4><ul>{guide.prepare.map(thing => <li key={thing}><Check size={15} aria-hidden="true" /><span>{thing}</span></li>)}</ul></div>
                <div className={styles.sources}><p className={styles.eyebrow}>CONECTA CON LA ORGANIZACIÓN</p><a className={styles.contact} href={guide.contact.href} onClick={() => trackCommunity({ action: 'resource_click', topic: guide.id, resource: guide.sources.length })}>{guide.contact.label}<ArrowUpRight size={17} aria-hidden="true" /></a><h4>Fuentes oficiales</h4>{guide.sources.map((source, index) => <a className={styles.sourceLink} key={source.url} href={source.url} target="_blank" rel="noopener noreferrer" onClick={() => trackCommunity({ action: 'resource_click', topic: guide.id, resource: index })}>{source.label}<ArrowUpRight size={14} aria-hidden="true" /><span className={styles.srOnly}> (abre otra pestaña)</span></a>)}</div>
              </aside>
            </div>
            <details className={styles.guideNote} key={guide.id}><summary>Lo que conviene saber antes de solicitar ayuda</summary><p>{guide.note}</p></details>
            <div className={styles.vote}><div><MessageCircle size={18} aria-hidden="true" /><span>¿Ahora sabes mejor qué hacer?</span></div>{votes[guide.id] === 'needs_help' ? <div className={styles.helpOptions}>
              <strong role="status">Puedes dar el siguiente paso aquí.</strong>
              {topic === 'escuela' ? <>
                <Link href={schoolCall.path}>{schoolCall.title}</Link>
                <a href={schoolDirectory}>Buscar el teléfono de mi escuela</a>
              </> : <>
                <a href="#asistente">Prepararme con la guía de {guide.label.toLowerCase()}</a>
                <a href={guide.contact.href} onClick={() => trackCommunity({ action: 'resource_click', topic, resource: guide.sources.length })}>{guide.contact.label}</a>
              </>}
            </div> : votes[guide.id] === 'yes' ? <strong role="status">Gracias por ayudarnos a mejorar.</strong> : <div>{([{ value: 'yes', label: 'Sí, me orientó' }, { value: 'needs_help', label: 'Todavía necesito ayuda' }] as const).map(option => <button type="button" key={option.value} onClick={() => { setVotes(previous => ({ ...previous, [guide.id]: option.value })); trackCommunity({ action: 'helpfulness', topic: guide.id, value: option.value }); }}>{option.label}</button>)}</div>}</div>
          </article>
        </div>
      </section>

      <section id="asistente" className={styles.aiSection} aria-labelledby="ai-title">
        <div className={styles.aiLayout}><div className={styles.aiCopy}><h2 id="ai-title">Prepara tu llamada o visita.</h2><p>Elige una guía para repasar los pasos, organizar lo que necesitas o preparar una conversación en inglés.</p><div className={styles.aiFootnote}><Check size={17} aria-hidden="true" /><p>No necesitas compartir datos personales. El asistente trabaja con las guías de esta página.</p></div><details className={styles.aiDisclosure}><summary>Cómo funciona este apoyo</summary><p>{aiEnabled ? 'Al pedir ayuda a la IA, enviamos a OpenAI el tema, la tarea y la guía. Si la IA no responde, verás la preparación de la guía.' : 'La preparación usa las guías de FrontierMinds y preguntas bilingües de práctica.'} Confirma los detalles con la organización.</p></details></div>
          <form onSubmit={askAI} className={styles.aiForm}>
            <div className={styles.formHeading}><span>PREPARA TU PRÓXIMO PASO</span><Sparkles size={17} aria-hidden="true" /></div>
            <label htmlFor="ai-topic">¿Qué tema quieres preparar?</label><select id="ai-topic" value={topic} disabled={busy} onChange={event => { setTopic(event.target.value as CommunityTopic); setResult(null); setError(null); }}>{communityGuides.map(item => <option key={item.id} value={item.id}>{topicCopy[item.id].title}</option>)}</select>
            <fieldset disabled={busy} className={styles.taskChoices}><legend>Elige cómo te podemos ayudar</legend>{(Object.keys(communityTasks) as (keyof typeof communityTasks)[]).map(id => { const copy = taskCopy[id]; const Icon = copy.icon; return <label key={id} className={styles.taskChoice}><input type="radio" name="ai-task" value={id} checked={task === id} onChange={() => { setTask(id); setResult(null); setError(null); }} /><Icon size={19} aria-hidden="true" /><span><strong>{copy.title}</strong><small>{copy.detail}</small></span></label>; })}</fieldset>
            <button className={styles.primary} type="submit" disabled={busy}>{busy ? 'Preparando tu orientación…' : aiEnabled ? 'Preparar con IA' : 'Preparar con la guía'}<ArrowRight size={17} aria-hidden="true" /></button><p className={styles.formHint}>Confirma los requisitos con la organización antes de tu visita.</p>
            <div aria-live="polite" aria-busy={busy}>{error?.topic === topic && error.task === task && <p className={styles.error} role="alert">{error.text} Puedes seguir usando las guías y sus contactos.</p>}{result?.topic === topic && result.task === task && <div className={styles.reply}><span className={styles.eyebrow}>{result.source === 'ai' ? 'SUGERENCIA DE IA' : 'PREPARACIÓN DE LA GUÍA'} · {guide.label}</span><p>{result.text}</p><a href={guide.sources[0].url} target="_blank" rel="noopener noreferrer">Confirmar en la fuente oficial <ArrowUpRight size={14} aria-hidden="true" /></a></div>}</div>
          </form>
        </div>
      </section>

      <section id="novedades" className={styles.section} aria-labelledby="posts-title"><div className={styles.sectionHeading}><h2 id="posts-title">Novedades de la comunidad</h2></div><div className={styles.posts}>{communityPosts.map(post => <article key={post.id}><div className={styles.postTop}><span>COMUNIDAD</span><time dateTime={post.date}>{formatDate(post.date)}</time></div><h3>{post.title}</h3><p>{post.text}</p></article>)}</div></section>

      <section id="comentarios" className={styles.feedbackSection} aria-labelledby="feedback-title"><div className={styles.feedbackLayout}>
        <div className={styles.feedbackCopy}><h2 id="feedback-title">¿Qué guía te hace falta?</h2><p>¿Qué información te hace falta? ¿En qué parte del proceso te quedaste? Cuéntanos para que podamos crear recursos más útiles.</p><a className={styles.emailLink} href="mailto:info@frontierminds.io"><Mail size={17} aria-hidden="true" /> info@frontierminds.io</a><div className={styles.privacy}><strong>Tu mensaje es privado.</strong><p>No se publica en el sitio. Evita incluir documentos, números de cuenta, información médica o datos de tus hijos.</p></div></div>
        <form onSubmit={prepareEmail} className={styles.feedbackForm}>
          <h3>Cuéntanos qué necesitas.</h3><p className={styles.small}>Prepara un mensaje para enviarlo desde tu correo.</p>
          <label htmlFor="feedback-email">Tu correo para responderte</label><input id="feedback-email" name="email" type="email" required maxLength={254} autoComplete="email" placeholder="tu@correo.com" />
          <label htmlFor="feedback-topic">¿Sobre qué tema?</label><select id="feedback-topic" name="topic">{communityGuides.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}<option value="otro">Otro tema</option></select>
          <label htmlFor="feedback-message">Tu pregunta o sugerencia</label><textarea id="feedback-message" name="message" required maxLength={1200} rows={4} placeholder="Me ayudaría saber cómo…" />
          <label className={styles.checkbox}><input type="checkbox" required /><span>Acepto compartir mi correo y comentario con FrontierMinds para recibir una respuesta.</span></label>
          <button className={styles.primary} type="submit">Continuar en mi correo<ArrowUpRight size={17} aria-hidden="true" /></button><p className={styles.formHint}>Abriremos tu aplicación de correo. Revisa el mensaje y pulsa Enviar allí. Si no se abre, escribe a info@frontierminds.io.</p><p role="status">{feedbackStatus}</p>
        </form>
      </div></section>
      <aside className={styles.disclosure}><p>Una guía independiente para Palm Beach County. Las solicitudes se hacen con cada organización.</p><details className={styles.analyticsNote}><summary>Sobre el uso de esta página</summary><p>Usamos Google Analytics para entender qué temas y enlaces se consultan y qué guías ayudan. Nuestros eventos de comunidad no incluyen tu correo ni el texto de tus comentarios. El formulario no guarda información en este sitio.</p></details></aside>
    </main>
  );
}
