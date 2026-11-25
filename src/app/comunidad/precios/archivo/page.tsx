import GroceryActivityTracker from '@/components/grocery/GroceryActivityTracker';
import GroceryFeedback from '@/components/grocery/GroceryFeedback';
import Link from 'next/link';
import {published,weeks,fmt,defaultCounty,lastUpdated} from '@/lib/grocery/data';
import styles from '@/components/grocery/grocery.module.css';
export const revalidate=300;
export const metadata={title:'Archivo semanal de precios de Palm Beach County | FrontierMinds',description:'Compara los anuncios y sus fechas de vigencia en archivos semanales.'};
export default async function ArchiveIndex(){
 const result=await published();
 const offers=defaultCounty(result.offers);
 return <main className={styles.main} lang="es"><GroceryActivityTracker section="archive"/><div className={styles.container}>
  <nav className={styles.breadcrumb}><Link href="/comunidad/precios">Precios</Link><span>›</span><span>Archivo</span></nav>
  <h1 className="text-4xl font-semibold">Archivo de anuncios semanales</h1>
  <p className={styles.date}>Última actualización: {lastUpdated(offers)}. Los anuncios históricos pueden estar vencidos; comprueba siempre las fechas originales.</p>
  <div className={styles.links}>{weeks(offers).map(w=><Link key={w} href={'/comunidad/precios/archivo/'+w}>Lote del {fmt(w)}</Link>)}</div>
  {!offers.length&&<p className={styles.empty}>No hay lotes publicados todavía.</p>}
 </div></main>;
}
