'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { ArrowDown, ArrowRight, ArrowUpRight, BriefcaseBusiness, Check, CheckCheck, ClipboardList, GraduationCap, Languages, Mail, MapPin, MessageCircle, Sparkles, Zap } from 'lucide-react';
import FrontierMindsLogo from '@/components/FrontierMindsLogo';
import { communityGuides, communityPosts, communityTasks, type CommunityTopic } from '@/content/community';
import { trackCommunity } from '@/lib/community-analytics';
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

export default function CommunityHub() {
  const [selectedTopic, setSelectedTopic] = useState<CommunityTopic>('luz');
  const [topic, setTopic] = useState<CommunityTopic>('luz');
  const [task, setTask] = useState<keyof typeof communityTasks>('pasos');
  const [result, setResult] = useState<{ topic: CommunityTopic; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [votes, setVotes] = useState<Partial<Record<CommunityTopic, string>>>({});
  const [feedbackStatus, setFeedbackStatus] = useState('');
  const guide = communityGuides.find(item => item.id === selectedTopic)!;
  const resultGuide = result && communityGuides.find(item => item.id === result.topic)!;
  const GuideIcon = icons[selectedTopic];

  // Support shareable topic links, including links from the original draft.
  useEffect(() => {
    function readHash() {
      const id = window.location.hash.replace('#guia-', '');
      if (communityGuides.some(item => item.id === id)) {
        setSelectedTopic(id as CommunityTopic);
        requestAnimationFrame(() => document.getElementById('guia')?.scrollIntoView({ block: 'start' }));
      }
    }
    readHash();
    window.addEventListener('hashchange', readHash);
    return () => window.removeEventListener('hashchange', readHash);
  }, []);

  function selectGuide(id: CommunityTopic) {
    setSelectedTopic(id);
    trackCommunity({ action: 'guide_open', topic: id });
    requestAnimationFrame(() => {
      document.getElementById('guia')?.scrollIntoView({ block: 'start' });
      document.getElementById(`guia-${id}`)?.focus({ preventScroll: true });
    });
  }

  async function askAI(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setResult(null); setError('');
    trackCommunity({ action: 'ai_request', topic, task });
    try {
      const response = await fetch('/api/community-help', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, task }), signal: AbortSignal.timeout(35000),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'No pudimos generar la respuesta. Inténtalo más tarde.');
      if (typeof data.reply !== 'string' || !data.reply.trim()) throw new Error('No llegó una respuesta. Inténtalo más tarde.');
      setResult({ topic, text: data.reply });
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
      <div className={styles.topline}>Información en español. Pasos para avanzar. <span>Empezamos en West Palm Beach.</span></div>
      <nav className={styles.nav} aria-label="Navegación principal">
        <Link href="/" className={styles.brand} aria-label="FrontierMinds, inicio"><FrontierMindsLogo size="sm" showText={false} /><span>FrontierMinds<small>COMUNIDAD</small></span></Link>
        <div className={styles.navLinks}><a href="#recursos">Encontrar ayuda</a><a href="#asistente">Prepararme con IA</a><a href="#novedades">Novedades</a></div>
        <a href="#comentarios" className={styles.navContact}>Te escuchamos <ArrowUpRight size={15} aria-hidden="true" /></a>
      </nav>

      <header className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.location}><MapPin size={14} aria-hidden="true" /> WEST PALM BEACH, FLORIDA</p>
          <h1>La ayuda empieza<br />con <em>un primer paso.</em></h1>
          <p className={styles.intro}>Encontrar apoyo para tu familia debería ser más sencillo. Aquí reunimos información en español para que sepas por dónde empezar.</p>
          <div className={styles.actions}><a className={styles.primary} href="#recursos">¿Qué ayuda necesitas? <ArrowDown size={17} aria-hidden="true" /></a><a className={styles.textLink} href="#asistente">Conoce el apoyo de IA <ArrowUpRight size={16} aria-hidden="true" /></a></div>
          <p className={styles.heroNote}><Check size={15} aria-hidden="true" /> Guías abiertas, sin crear una cuenta.</p>
        </div>
        <div className={styles.routeCard}>
          <div className={styles.routeTop}><span className={styles.dot} /> UN POCO DE ORIENTACIÓN CAMBIA EL CAMINO</div>
          <div className={styles.routeTitle}>No tienes que resolver<br />todo de una vez.</div>
          <ol className={styles.routeSteps}>
            <li><span>01</span><div><strong>Encuentra tu tema</strong><p>Empieza por lo que necesitas hoy.</p></div></li>
            <li><span>02</span><div><strong>Prepara tu siguiente paso</strong><p>Revisa los documentos y las preguntas.</p></div></li>
            <li><span>03</span><div><strong>Conecta con la organización</strong><p>Ve a la fuente que puede ayudarte.</p></div></li>
          </ol>
          <div className={styles.routeBottom}><MapPin size={16} aria-hidden="true" /><span>Palm Beach County <small>Recursos locales · orientación en español</small></span><ArrowUpRight size={20} aria-hidden="true" /></div>
        </div>
      </header>

      <section id="recursos" className={styles.section} aria-labelledby="resources-title">
        <div className={styles.sectionHeading}><div><p className={styles.eyebrow}><span>01</span> RECURSOS PARA TU FAMILIA</p><h2 id="resources-title">Empieza por lo que necesitas.</h2></div><p>Elige un tema para ver los pasos,<br />los documentos y el contacto.</p></div>
        <div className={styles.topics} aria-label="Temas de ayuda">
          {communityGuides.map(item => {
            const Icon = icons[item.id];
            const copy = topicCopy[item.id];
            return <a key={item.id} href={`#guia-${item.id}`} className={`${styles.topic} ${selectedTopic === item.id ? styles.topicActive : ''}`} aria-current={selectedTopic === item.id ? 'true' : undefined} onClick={() => selectGuide(item.id)}>
              <span className={styles.topicIcon} data-color={copy.color}><Icon size={23} aria-hidden="true" /></span><span><strong>{copy.title}</strong><small>{copy.detail}</small></span><ArrowUpRight className={styles.topicArrow} size={17} aria-hidden="true" />
            </a>;
          })}
        </div>

        <div id="guia" className={styles.guideAnchor}>
          <article id={`guia-${selectedTopic}`} tabIndex={-1} className={styles.guide} aria-labelledby="guide-title">
            <div className={styles.guideHeading}><div className={styles.guideLabel}><GuideIcon size={17} aria-hidden="true" /> {guide.label}</div><span className={styles.reviewed}><span className={styles.dot} /> Revisado el {formatDate(guide.reviewed)}</span></div>
            <div className={styles.guideIntro}><div><h3 id="guide-title">{guide.title}</h3><p>{guide.description}</p></div><span className={styles.guideIndex}>GUÍA {String(communityGuides.indexOf(guide) + 1).padStart(2, '0')} / 04</span></div>
            <div className={styles.guideColumns}>
              <div className={styles.steps}><h4>Así puedes empezar</h4><ol>{guide.steps.map((step, index) => <li key={step}><span aria-hidden="true">{index + 1}</span><p>{step}</p></li>)}</ol>
                <div className={styles.guideAi}><Sparkles size={21} aria-hidden="true" /><div><strong>¿Te gustaría preparar esa llamada o visita?</strong><p>La IA puede ayudarte con una lista o preguntas en inglés.</p><a href="#asistente" aria-disabled={busy} onClick={event => { if (busy) { event.preventDefault(); return; } setTopic(guide.id); setResult(null); setError(''); }}>Prepararme sobre este tema <ArrowRight size={15} aria-hidden="true" /></a></div></div>
              </div>
              <aside className={styles.guideAside} aria-label="Preparación y contactos">
                <div className={styles.prepare}><h4><ClipboardList size={18} aria-hidden="true" /> Ten a mano</h4><ul>{guide.prepare.map(thing => <li key={thing}><Check size={15} aria-hidden="true" /><span>{thing}</span></li>)}</ul></div>
                <div className={styles.sources}><p className={styles.eyebrow}>CONECTA CON LA ORGANIZACIÓN</p><a className={styles.contact} href={guide.contact.href} onClick={() => trackCommunity({ action: 'resource_click', topic: guide.id, resource: guide.sources.length })}>{guide.contact.label}<ArrowUpRight size={17} aria-hidden="true" /></a><h4>Fuentes oficiales</h4>{guide.sources.map((source, index) => <a className={styles.sourceLink} key={source.url} href={source.url} target="_blank" rel="noopener noreferrer" onClick={() => trackCommunity({ action: 'resource_click', topic: guide.id, resource: index })}>{source.label}<ArrowUpRight size={14} aria-hidden="true" /><span className={styles.srOnly}> (abre otra pestaña)</span></a>)}</div>
              </aside>
            </div>
            <details className={styles.guideNote} key={guide.id}><summary>Lo que conviene saber antes de solicitar ayuda</summary><p>{guide.note}</p></details>
            <div className={styles.vote}><div><MessageCircle size={18} aria-hidden="true" /><span>¿Ahora sabes mejor qué hacer?</span></div>{votes[guide.id] ? <strong role="status">Gracias por ayudarnos a mejorar.</strong> : <div>{([{ value: 'yes', label: 'Sí, me orientó' }, { value: 'needs_help', label: 'Todavía necesito ayuda' }] as const).map(option => <button type="button" key={option.value} onClick={() => { setVotes(previous => ({ ...previous, [guide.id]: option.value })); trackCommunity({ action: 'helpfulness', topic: guide.id, value: option.value }); }}>{option.label}</button>)}</div>}</div>
          </article>
        </div>
      </section>

      <section id="asistente" className={styles.aiSection} aria-labelledby="ai-title">
        <div className={styles.aiLayout}><div className={styles.aiCopy}><p className={styles.eyebrow}><span>02</span> DE LA INFORMACIÓN A LA ACCIÓN</p><span className={styles.aiMark}><Sparkles size={27} aria-hidden="true" /></span><h2 id="ai-title">Un poco de preparación.<br /><em>Más confianza para avanzar.</em></h2><p>Usa la IA para entender una guía, organizar lo que necesitas o preparar una conversación en inglés.</p><div className={styles.aiFootnote}><Check size={17} aria-hidden="true" /><p>No necesitas compartir datos personales. El asistente trabaja con las guías de esta página.</p></div><details className={styles.aiDisclosure}><summary>Cómo funciona este apoyo</summary><p>Al generar, enviamos a OpenAI el tema, la tarea elegida y nuestra guía. La IA no consulta disponibilidad en tiempo real, no decide si calificas y no presenta solicitudes. Confirma los detalles con la organización.</p></details></div>
          <form onSubmit={askAI} className={styles.aiForm}>
            <div className={styles.formHeading}><span>PREPARA TU PRÓXIMO PASO</span><Sparkles size={17} aria-hidden="true" /></div>
            <label htmlFor="ai-topic">¿Qué tema quieres preparar?</label><select id="ai-topic" value={topic} disabled={busy} onChange={event => { setTopic(event.target.value as CommunityTopic); setResult(null); setError(''); }}>{communityGuides.map(item => <option key={item.id} value={item.id}>{topicCopy[item.id].title}</option>)}</select>
            <fieldset disabled={busy} className={styles.taskChoices}><legend>Elige cómo te podemos ayudar</legend>{(Object.keys(communityTasks) as (keyof typeof communityTasks)[]).map(id => { const copy = taskCopy[id]; const Icon = copy.icon; return <label key={id} className={styles.taskChoice}><input type="radio" name="ai-task" value={id} checked={task === id} onChange={() => { setTask(id); setResult(null); setError(''); }} /><Icon size={19} aria-hidden="true" /><span><strong>{copy.title}</strong><small>{copy.detail}</small></span></label>; })}</fieldset>
            <button className={styles.primary} type="submit" disabled={busy}>{busy ? 'Preparando tu orientación…' : 'Preparar con IA'}<ArrowRight size={17} aria-hidden="true" /></button><p className={styles.formHint}>Orientación generada por IA. Revísala antes de usarla.</p>
            <div aria-live="polite" aria-busy={busy}>{error && <p className={styles.error} role="alert">{error} Puedes seguir usando las guías y sus contactos.</p>}{result && resultGuide && <div className={styles.reply}><span className={styles.eyebrow}>TU PREPARACIÓN · {resultGuide.label}</span><p>{result.text}</p><a href={resultGuide.sources[0].url} target="_blank" rel="noopener noreferrer">Confirmar en la fuente oficial <ArrowUpRight size={14} aria-hidden="true" /></a></div>}</div>
          </form>
        </div>
      </section>

      <section id="novedades" className={styles.section} aria-labelledby="posts-title"><div className={styles.sectionHeading}><div><p className={styles.eyebrow}><span>03</span> PARA SEGUIR AVANZANDO</p><h2 id="posts-title">Desde nuestra comunidad.</h2></div><p>Ideas, orientación y novedades<br />para dar el próximo paso.</p></div><div className={styles.posts}>{communityPosts.map(post => <article key={post.id}><div className={styles.postTop}><span>COMUNIDAD</span><time dateTime={post.date}>{formatDate(post.date)}</time></div><h3>{post.title}</h3><p>{post.text}</p></article>)}</div></section>

      <section id="comentarios" className={styles.feedbackSection} aria-labelledby="feedback-title"><div className={styles.feedbackLayout}>
        <div className={styles.feedbackCopy}><p className={styles.eyebrow}><span>04</span> ESTE ESPACIO TAMBIÉN ES TUYO</p><span className={styles.feedbackMark}><MessageCircle size={30} aria-hidden="true" /></span><h2 id="feedback-title">La próxima guía<br />puede empezar contigo.</h2><p>¿Qué información te hace falta? ¿En qué parte del proceso te quedaste? Cuéntanos para que podamos crear recursos más útiles.</p><a className={styles.emailLink} href="mailto:info@frontierminds.io"><Mail size={17} aria-hidden="true" /> info@frontierminds.io</a><div className={styles.privacy}><strong>Tu mensaje es privado.</strong><p>No se publica en el sitio. Evita incluir documentos, números de cuenta, información médica o datos de tus hijos.</p></div></div>
        <form onSubmit={prepareEmail} className={styles.feedbackForm}>
          <h3>Cuéntanos qué necesitas.</h3><p className={styles.small}>Prepara un mensaje para enviarlo desde tu correo.</p>
          <label htmlFor="feedback-email">Tu correo para responderte</label><input id="feedback-email" name="email" type="email" required maxLength={254} autoComplete="email" placeholder="tu@correo.com" />
          <label htmlFor="feedback-topic">¿Sobre qué tema?</label><select id="feedback-topic" name="topic">{communityGuides.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}<option value="otro">Otro tema</option></select>
          <label htmlFor="feedback-message">Tu pregunta o sugerencia</label><textarea id="feedback-message" name="message" required maxLength={1200} rows={4} placeholder="Me ayudaría saber cómo…" />
          <label className={styles.checkbox}><input type="checkbox" required /><span>Acepto compartir mi correo y comentario con FrontierMinds para recibir una respuesta.</span></label>
          <button className={styles.primary} type="submit">Continuar en mi correo<ArrowUpRight size={17} aria-hidden="true" /></button><p className={styles.formHint}>Abriremos tu aplicación de correo. Revisa el mensaje y pulsa Enviar allí. Si no se abre, escribe a info@frontierminds.io.</p><p role="status">{feedbackStatus}</p>
        </form>
      </div></section>
      <footer className={styles.footer}><div><Link href="/" className={styles.footerBrand}>FrontierMinds <span>/ Comunidad</span></Link><p>Información que orienta. Pasos que acercan.</p></div><div><Link href="/">Explorar los cursos <ArrowUpRight size={14} aria-hidden="true" /></Link><p>Una guía independiente para Palm Beach County.<br />Las solicitudes se hacen con cada organización.</p></div><details className={styles.analyticsNote}><summary>Sobre el uso de esta página</summary><p>Usamos Google Analytics para entender qué temas y enlaces se consultan y qué guías ayudan. Nuestros eventos de comunidad no incluyen tu correo ni el texto de tus comentarios. El formulario no guarda información en este sitio.</p></details></footer>
    </main>
  );
}
