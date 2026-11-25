import Link from 'next/link';
import {notFound} from 'next/navigation';
import {published,fmt} from '@/lib/grocery/data';
import PriceTable from '@/components/grocery/PriceTable';
import {groceryJsonLd,safeJson} from '@/lib/grocery/seo';
import styles from '@/components/grocery/grocery.module.css';
export const revalidate=300;
type P={params:Promise<{store:string;week:string}>};
export async function generateMetadata({params}:P){const {store,week}=await params;const r=await published();const s=r.offers.find(o=>o.store_slug===store&&o.week_start===week);return {title:(s?.store_name||'Tienda')+' precios semanales '+week+' | FrontierMinds',alternates:{canonical:'https://www.frontierminds.io/comunidad/precios/tiendas/'+store+'/'+week}}}
export default async function StoreWeek({params}:P){const {store,week}=await params;const r=await published();const rows=r.offers.filter(o=>o.store_slug===store&&o.week_start===week).sort((a,b)=>a.item_name.localeCompare(b.item_name));if(!rows.length)notFound();const o=rows[0];return <main className={styles.main} lang="es"><div className={styles.container}><div className={styles.breadcrumb}><Link href="/comunidad/precios">Precios</Link><span>›</span><span>{o.store_name}</span></div><p className={styles.eyebrow}>OFERTAS POR TIENDA</p><h1 className="text-4xl font-semibold tracking-tight mt-3">{o.store_name}: precios de la semana</h1><p className={styles.muted}>{o.street_address}, {o.city}, {o.state} {o.zip}, Estados Unidos</p><p className={styles.date}><strong>Semana:</strong> {fmt(o.week_start)} – {fmt(o.week_end)}. <strong>Última actualización:</strong> {new Date(Math.max(...rows.map(o=>new Date(o.updated_at).getTime()))).toLocaleString('es-US',{timeZone:'America/New_York'})}. Algunas promociones tienen fechas más específicas.</p><PriceTable offers={rows} showStore={false}/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:safeJson(groceryJsonLd(rows,'Ofertas semanales de '+o.store_name))}}/></div></main>}
