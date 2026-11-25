import Link from 'next/link';
import {published,weeks,fmt} from '@/lib/grocery/data';
import styles from '@/components/grocery/grocery.module.css';
export const revalidate=300;
export const metadata={title:'Archivo de precios semanales | FrontierMinds',description:'Consulta precios de supermercado de semanas anteriores en West Palm Beach.'};
export default async function ArchiveIndex(){const result=await published();return <main className={styles.main} lang="es"><div className={styles.container}><div className={styles.breadcrumb}><Link href="/comunidad/precios">Precios</Link><span>›</span><span>Archivo</span></div><h1 className="text-4xl font-semibold">Archivo de ofertas</h1><p className={styles.muted}>Los precios históricos no representan ofertas vigentes. Consulta el anuncio de cada tienda.</p><div className={styles.links}>{weeks(result.offers).map(w=><Link key={w} href={'/comunidad/precios/archivo/'+w}>Semana del {fmt(w)}</Link>)}</div>{!result.offers.length&&<p className={styles.empty}>Todavía no hay precios publicados.</p>}</div></main>}
