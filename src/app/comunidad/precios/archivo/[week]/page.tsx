import GroceryActivityTracker from '@/components/grocery/GroceryActivityTracker';
import GroceryFeedback from '@/components/grocery/GroceryFeedback';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {published,fmt,lastUpdated,defaultCounty,localDate} from '@/lib/grocery/data';
import PriceTable from '@/components/grocery/PriceTable';
import styles from '@/components/grocery/grocery.module.css';
export const revalidate=300;
type Params={params:Promise<{week:string}>};
export async function generateMetadata({params}:Params){
 const {week}=await params;
 return {title:'Archivo de anuncios del '+week+' | FrontierMinds',
 alternates:{canonical:'https://www.frontierminds.io/comunidad/precios/archivo/'+week}};
}
export default async function Archive({params}:Params){
 const {week}=await params;if(!/^\d{4}-\d{2}-\d{2}$/.test(week))notFound();
 const r=await published();
 const rows=defaultCounty(r.offers).filter(o=>o.snapshot_date===week)
 .sort((a,b)=>a.chain.localeCompare(b.chain)||a.department.localeCompare(b.department)||a.item_en.localeCompare(b.item_en));
 if(!rows.length)notFound();
 const today=localDate();const expired=rows.filter(o=>o.valid_to<today);
 return <main className={styles.main} lang="es"><GroceryActivityTracker section="archive"/><div className={styles.container}>
  <nav className={styles.breadcrumb}><Link href="/comunidad/precios">Precios</Link><span>›</span><span>Archivo</span></nav>
  <h1 className="text-4xl font-semibold">Anuncios del lote {fmt(week)}</h1>
  <p className={styles.date}><strong>Archivo del lote:</strong> {fmt(week)}. <strong>Última actualización:</strong> {lastUpdated(rows)}. {expired.length} registros vencidos y {rows.length-expired.length} que pueden tener fechas vigentes o futuras.</p>
  <p className={styles.muted}>Este archivo conserva anuncios históricos y sus fechas. Cada fila indica su vigencia original; no todas las ofertas siguen disponibles.</p>
  <PriceTable offers={rows}/>
 <GroceryFeedback section="archive" contextSlug={null}/></div></main>;
}
