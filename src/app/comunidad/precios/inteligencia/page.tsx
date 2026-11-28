import Link from 'next/link';
import type {Metadata} from 'next';
import styles from '@/components/grocery/grocery.module.css';
export const metadata:Metadata={
 title:'Inteligencia de mercados y ciencia de datos | FrontierMinds',
 description:'Laboratorio educativo: cómo comparar precios de supermercado con evidencia, probabilidades, valor de la información y optimización, sin prometer predicciones.',
 alternates:{canonical:'https://www.frontierminds.io/comunidad/precios/inteligencia'}
};
const topics=[
 {name:'Observación y evidencia',desc:'Un precio anunciado tiene tienda, folleto, producto, unidad y fechas. Repetirlo en varias sucursales no crea nuevos datos independientes.'},
 {name:'Inferencia bayesiana',desc:'Las probabilidades anteriores se pueden actualizar al observar datos nuevos. Primero hacen falta observaciones repetidas y un modelo que pueda ponerse a prueba.'},
 {name:'Distribuciones y procesos',desc:'Los precios pueden tener ciclos, cambios bruscos y promociones. No deben suponerse normales sin datos que lo respalden.'},
 {name:'Teoría de la información',desc:'Una nueva observación es valiosa si reduce una incertidumbre que realmente importa para decidir.'},
 {name:'Valor de la información',desc:'EVSI compara decisiones antes y después de recibir información, descontando lo que cuesta adquirirla. Un puntaje heurístico no es EVSI.'},
 {name:'Optimización',desc:'Un presupuesto y una lista de compras forman un problema de restricciones. La mejor tienda depende también de tamaños, membresía y transporte.'},
 {name:'Ingeniería adaptativa',desc:'En lugar de recopilar todo a ciegas, una futura estrategia podrá alternar entre investigar datos prioritarios y explorar otros al azar.'}
];
export default function MarketEducation(){
 return <main className={styles.main} lang="es"><div className={styles.container}>
 <nav className={styles.breadcrumb}><Link href="/comunidad/precios">Precios semanales</Link><span>›</span><span>Laboratorio</span></nav>
 <p className={styles.eyebrow}>FRONTIERMINDS · LABORATORIO ABIERTO</p>
 <h1 className="text-4xl font-semibold tracking-tight">Inteligencia de mercados</h1>
 <p className={styles.date}><strong>En investigación.</strong> Los precios publicados siguen siendo anuncios observados. Este laboratorio no publica precios futuros, niveles de certeza inventados ni ahorros garantizados.</p>
 <p className={styles.muted}>Exploramos cómo un sistema puede observar, estimar, aprender qué falta y decidir qué verificar primero, gastando menos recursos. La etapa inicial evalúa fundamentos y calidad de datos; la predicción y las recomendaciones de compra requieren más historia y pruebas.</p>
 <section className={styles.section}><h2>Observar → Estimar → Predecir → Investigar → Decidir → Validar → Aprender</h2>
 <div className={styles.cards}>{topics.map(t=><article className={styles.card} key={t.name}><strong>{t.name}</strong><p className={styles.muted}>{t.desc}</p></article>)}</div></section>
 <section className={styles.section}><h2>Lo que todavía no sabemos</h2>
 <p>Una sola publicación semanal permite comparar ofertas de hoy, pero no conocer con fundamento la volatilidad histórica, la probabilidad de un descuento futuro ni el ahorro efectivamente logrado por una familia. Los modelos solo mejorarán al contrastar sus predicciones con nuevas observaciones.</p>
 <p>Los datos de anuncios nacionales o productos agrícolas pueden dar contexto; no reemplazan la verificación de precios en una sucursal.</p>
 <div className={styles.links}><Link href="/comunidad/precios">Volver a precios verificados en anuncios</Link><Link href="/comunidad/precios/buscar">Buscar alimentos</Link></div></section>
 </div></main>;
}
