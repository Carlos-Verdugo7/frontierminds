import Link from 'next/link';
import type {Metadata} from 'next';
import styles from '@/components/grocery/grocery.module.css';
export const metadata:Metadata={
 title:'Privacidad de los comentarios sobre precios | FrontierMinds',
 description:'Cómo protegemos los comentarios y datos de contacto voluntarios en la herramienta de precios de supermercados.',
 alternates:{canonical:'https://www.frontierminds.io/comunidad/precios/privacidad'}
};
export default function GroceryFeedbackPrivacy(){
 return <main className={styles.main} lang="es"><div className={styles.container}>
  <nav className={styles.breadcrumb}><Link href="/comunidad/precios">Precios</Link><span>›</span><span>Privacidad de comentarios</span></nav>
  <h1 className="text-4xl font-semibold tracking-tight">Privacidad de los comentarios</h1>
  <p className={styles.date}>Esta política describe el formulario de comentarios de Grocery Price Watch de FrontierMinds, y no sustituye las políticas aplicables a otros servicios.</p>
  <section className={styles.section}><h2>Datos que pedimos</h2>
   <p>Guardamos si una comparación te ayudó, qué sección estabas usando y, si decides escribirlo, un comentario. Puedes responder sin identificarnos quién eres. Si voluntariamente quieres una respuesta, puedes aportar un correo electrónico o teléfono de Estados Unidos, y pedimos consentimiento explícito para ese seguimiento.</p>
  </section>
  <section className={styles.section}><h2>Cómo los usamos</h2>
   <p>Utilizamos las respuestas para entender qué información es útil y mejorar las comparaciones de supermercados. Si autorizas un contacto, utilizaremos el medio elegido para tratar tu comentario individual. No significa inscribirte en ofertas, publicidad, boletines o mensajes automáticos de texto.</p>
  </section>
  <section className={styles.section}><h2>Quién puede verlos</h2>
   <p>Los comentarios y datos de contacto se guardan en una tabla privada de Supabase con restricciones de acceso. Solo editores autorizados de Grocery Price Watch pueden consultarlos. Los datos de contacto y texto de tus comentarios no se envían como parámetros de eventos a Google Analytics ni aparecen en las páginas públicas de precios.</p>
  </section>
  <section className={styles.section}><h2>Seguridad y conservación</h2>
   <p>El formulario utiliza verificación Cloudflare Turnstile antes de aceptar una respuesta. La política operativa es borrar los comentarios antiguos a los 90 días mediante mantenimiento programado, una vez activado y verificado. Si necesitas eliminación anticipada, puedes solicitarla por correo.</p>
   <p>Las páginas de precios pueden generar métricas generales de uso, como visitas a productos, visitas a tiendas y búsquedas, sin adjuntar tu contacto a dichos eventos.</p>
  </section>
  <section className={styles.section}><h2>Consultar o eliminar información</h2>
   <p>Escribe a <a href="mailto:info@frontierminds.io">info@frontierminds.io</a> para solicitar acceso o eliminación de un comentario. Podemos pedir que demuestres que controlas el correo o teléfono indicado antes de borrar o divulgar datos asociados, para proteger tu privacidad.</p>
  </section>
 </div></main>;
}
