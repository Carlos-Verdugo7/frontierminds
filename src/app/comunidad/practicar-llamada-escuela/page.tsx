import Link from 'next/link';
import SchoolCallRehearsal from '@/components/community/SchoolCallRehearsal';
import styles from '@/components/community/school-call.module.css';
import { schoolCall } from '@/content/activities';
import { schoolDirectory } from '@/content/school-call';
import { pageMetadata } from '@/lib/page-metadata';

export const metadata = pageMetadata(schoolCall, schoolCall.path + '/opengraph-image');

export default function SchoolCallPage() {
  return <div className={styles.page} lang="es">
    <div className="course-nav-wrap"><nav className="course-nav site-width" aria-label="Comunidad"><Link href="/comunidad">Guías de ayuda</Link><Link href="/comunidad#guia-escuela">Volver a la guía de inscripción</Link></nav></div>
    <main className={styles.main}>
      <h1>{schoolCall.title}</h1>
      <p className={styles.intro}>En cinco minutos puedes ensayar cómo pedir documentos, una cita o ayuda en español. Escucha el inglés y practica en voz alta sin grabar tu voz.</p>
      <SchoolCallRehearsal aiEnabled={Boolean(process.env.OPENAI_API_KEY)} />
      <p className={styles.contacts}>Para hacer la llamada real, <a href={schoolDirectory}>busca el teléfono de tu escuela en el directorio del distrito</a>.</p>
    </main>
  </div>;
}
