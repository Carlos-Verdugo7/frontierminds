'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { ArrowRight, BriefcaseBusiness, GraduationCap, Languages, MapPin, Sparkles, Zap } from 'lucide-react';
import FrontierMindsLogo from '@/components/FrontierMindsLogo';
import { communityGuides, communityPosts, communityTasks, type CommunityTopic } from '@/content/community';
import { trackCommunity } from '@/lib/community-analytics';
import styles from './community.module.css';

const icons = { luz: Zap, empleo: BriefcaseBusiness, escuela: GraduationCap, ingles: Languages };

export default function CommunityHub() {
  const [topic, setTopic] = useState<CommunityTopic>('luz');
  const [task, setTask] = useState<keyof typeof communityTasks>('pasos');
  const [reply, setReply] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [votes, setVotes] = useState<Partial<Record<CommunityTopic, string>>>({});
  const [feedbackStatus, setFeedbackStatus] = useState('');
  const guide = communityGuides.find(item => item.id === topic)!;

  async function askAI(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setReply(''); setError('');
    trackCommunity({ action: 'ai_request', topic, task });
    try {
      const response = await fetch('/api/community-help', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, task }), signal: AbortSignal.timeout(35000),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'No pudimos generar la respuesta. Inténtalo más tarde.');
      if (typeof data.reply !== 'string' || !data.reply.trim()) throw new Error('No llegó una respuesta. Inténtalo más tarde.');
      setReply(data.reply);
      trackCommunity({ action: 'ai_success', topic, task });
    } catch (failure) {
      setError(failure instanceof Error && failure.name !== 'TimeoutError' ? failure.message : 'La respuesta tardó demasiado. Usa la guía o inténtalo más tarde.');
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
      <a className={styles.skip} href="#recursos">Saltar a las guías</a>
      <nav className={styles.nav} aria-label="Navegación principal">
        <Link href="/" aria-label="FrontierMinds, inicio"><FrontierMindsLogo size="sm" /></Link>
        <div><Link href="/">Cursos</Link><a href="#novedades">Novedades</a><a href="#comentarios">Cuéntanos</a></div>
      </nav>

      <header className={styles.hero}>
        <p className={styles.eyebrow}><MapPin size={16} aria-hidden="true" /> WEST PALM BEACH · PALM BEACH COUNTY</p>
        <h1>Un primer paso.<br /><span>Más cerca de la ayuda.</span></h1>
        <p className={styles.intro}>Información clara en español para tu familia. Encuentra por dónde empezar, qué preparar y a quién contactar.</p>
        <div className={styles.actions}><a className={styles.primary} href="#recursos">Encontrar ayuda <ArrowRight size={18} aria-hidden="true" /></a><a href="#asistente">Prepararme con IA</a></div>
        <p className={styles.small}>Un espacio de FrontierMinds para aprender y avanzar juntos.</p>
      </header>

      <section id="recursos" className={styles.section} aria-labelledby="resources-title">
        <p className={styles.eyebrow}>EMPIEZA POR LO QUE NECESITAS</p>
        <h2 id="resources-title">¿En qué te podemos orientar?</h2>
        <div className={styles.cards}>
          {communityGuides.map(item => {
            const Icon = icons[item.id];
            return <a key={item.id} href={`#guia-${item.id}`} className={styles.card} onClick={() => trackCommunity({ action: 'guide_open', topic: item.id })}>
              <Icon size={26} aria-hidden="true" /><h3>{item.title}</h3><p>{item.description}</p><span>Ver los pasos <ArrowRight size={16} aria-hidden="true" /></span>
            </a>;
          })}
        </div>
        <div className={styles.guides}>
          {communityGuides.map(item => <article key={item.id} id={`guia-${item.id}`} className={styles.guide}>
            <div className={styles.guideHeading}><div><p className={styles.eyebrow}>{item.label}</p><h3>{item.title}</h3></div><span className={styles.reviewed}>Fuentes revisadas: {item.reviewed}</span></div>
            <div className={styles.columns}>
              <div><h4>Tu próximo paso</h4><ol>{item.steps.map(step => <li key={step}>{step}</li>)}</ol></div>
              <aside className={styles.prepare}><h4>Antes de empezar</h4><ul>{item.prepare.map(thing => <li key={thing}>{thing}</li>)}</ul><p>{item.note}</p></aside>
            </div>
            <div className={styles.sources}><h4>Consulta la fuente oficial</h4>{item.sources.map((source, index) => <a key={source.url} href={source.url} target="_blank" rel="noopener noreferrer" onClick={() => trackCommunity({ action: 'resource_click', topic: item.id, resource: index })}>{source.label} ↗<span className={styles.srOnly}> (abre otra pestaña)</span></a>)}
              <a className={styles.contact} href={item.contact.href} onClick={() => trackCommunity({ action: 'resource_click', topic: item.id, resource: item.sources.length })}>{item.contact.label}</a>
            </div>
            <div className={styles.vote}><span>¿Esta guía te ayudó a saber qué hacer?</span>{votes[item.id] ? <strong role="status">Gracias. Tu respuesta nos ayuda a mejorar.</strong> : <div>{([{ value: 'yes', label: 'Sí, me orientó' }, { value: 'needs_help', label: 'Necesito más ayuda' }] as const).map(option => <button type="button" key={option.value} onClick={() => { setVotes(previous => ({ ...previous, [item.id]: option.value })); trackCommunity({ action: 'helpfulness', topic: item.id, value: option.value }); }}>{option.label}</button>)}</div>}</div>
          </article>)}
        </div>
      </section>

      <section id="asistente" className={`${styles.section} ${styles.ai}`} aria-labelledby="ai-title">
        <div><p className={styles.eyebrow}><Sparkles size={16} aria-hidden="true" /> UNA AYUDA PARA PREPARARTE</p><h2 id="ai-title">Da el siguiente paso con IA.</h2><p>Transforma una guía en pasos sencillos, una lista de preparación o preguntas para hacer en inglés.</p><p className={styles.small}>La IA usa las guías de esta página; no consulta disponibilidad en tiempo real ni decide si calificas. Confirma el resultado con la organización.</p></div>
        <form onSubmit={askAI} className={styles.form}>
          <label htmlFor="ai-topic">¿Sobre qué necesitas orientación?</label>
          <select id="ai-topic" value={topic} disabled={busy} onChange={event => { setTopic(event.target.value as CommunityTopic); setReply(''); setError(''); }}>{communityGuides.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}</select>
          <label htmlFor="ai-task">¿Cómo te puede ayudar la IA?</label>
          <select id="ai-task" value={task} disabled={busy} onChange={event => { setTask(event.target.value as keyof typeof communityTasks); setReply(''); setError(''); }}>{Object.entries(communityTasks).map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select>
          <p className={styles.small}>Al generar, enviamos a OpenAI solamente el tema elegido, la tarea y nuestra guía. No necesitas ingresar datos personales.</p>
          <button className={styles.primary} type="submit" disabled={busy}>{busy ? 'Preparando tu orientación…' : 'Generar con IA'}</button>
          <div aria-live="polite" aria-busy={busy}>{error && <p className={styles.error} role="alert">{error} La guía y sus contactos siguen disponibles arriba.</p>}{reply && <div className={styles.reply}><strong>Orientación generada por IA · {guide.label}</strong><p>{reply}</p><a href={guide.sources[0].url} target="_blank" rel="noopener noreferrer">Confirmar en la fuente oficial ↗</a></div>}</div>
        </form>
      </section>

      <section id="novedades" className={styles.section} aria-labelledby="posts-title"><p className={styles.eyebrow}>DE NUESTRA COMUNIDAD</p><h2 id="posts-title">Novedades y primeros pasos</h2><div className={styles.posts}>{communityPosts.map(post => <article key={post.id}><time dateTime={post.date}>{post.date}</time><h3>{post.title}</h3><p>{post.text}</p></article>)}</div></section>

      <section id="comentarios" className={`${styles.section} ${styles.feedback}`} aria-labelledby="feedback-title">
        <div><p className={styles.eyebrow}>TE ESCUCHAMOS</p><h2 id="feedback-title">¿Qué ayuda hace falta?</h2><p>Cuéntanos qué información necesitas o dónde te quedaste sin saber qué hacer. Tus comentarios nos ayudan a elegir las próximas guías.</p><p className={styles.small}>El comentario se envía por correo a FrontierMinds y no se publica. No incluyas números de cuenta, documentos, información médica ni datos de tus hijos.</p><p className={styles.small}>Usamos Google Analytics para entender qué temas y enlaces se consultan y qué guías ayudan. Nuestros eventos de comunidad no incluyen tu correo ni el texto de tus comentarios. El formulario no guarda información en este sitio.</p></div>
        <form onSubmit={prepareEmail} className={styles.form}>
          <label htmlFor="feedback-email">Tu correo para responderte</label><input id="feedback-email" name="email" type="email" required maxLength={254} autoComplete="email" placeholder="tu@correo.com" />
          <label htmlFor="feedback-topic">Tema</label><select id="feedback-topic" name="topic">{communityGuides.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}<option value="otro">Otro tema</option></select>
          <label htmlFor="feedback-message">Tu pregunta o sugerencia</label><textarea id="feedback-message" name="message" required maxLength={1200} rows={4} placeholder="Me gustaría encontrar información sobre…" />
          <label className={styles.checkbox}><input type="checkbox" required />Acepto compartir mi correo y comentario con FrontierMinds para recibir una respuesta.</label>
          <button className={styles.primary} type="submit">Abrir mi correo para enviar</button><p className={styles.small}>Necesitas una aplicación de correo configurada. Revisa y envía el mensaje allí; abrirlo no lo envía automáticamente.</p><p role="status">{feedbackStatus}</p><a href="mailto:info@frontierminds.io">También puedes escribir a info@frontierminds.io</a>
        </form>
      </section>
      <footer className={styles.footer}><p>FrontierMinds · Comunidad</p><p>Somos una guía independiente. Las solicitudes se realizan directamente con cada organización.</p><Link href="/">Volver a los cursos de FrontierMinds →</Link></footer>
    </main>
  );
}
