import Link from 'next/link';
import {notFound} from 'next/navigation';
import {published,fmt} from '@/lib/grocery/data';
import PriceTable from '@/components/grocery/PriceTable';
import styles from '@/components/grocery/grocery.module.css';
export const revalidate=300;
export async function generateMetadata({params}:{params:Promise<{week:string}>}){const {week}=await params;return {title:'Archivo de precios del '+week+' | FrontierMinds',alternates:{canonical:'https://www.frontierminds.io/comunidad/precios/archivo/'+week}}}
export default async function Archive({params}:{params:Promise<{week:string}>}){const {week}=await params;if(!/^\d{4}-\d{2}-\d{2}$/.test(week))notFound();const r=await published();const rows=r.offers.filter(o=>o.week_start===week).sort((a,b)=>a.item_name.localeCompare(b.item_name)||a.price_usd-b.price_usd);if(!rows.length)notFound();return <main className={styles.main} lang="es"><div className={styles.container}><div className={styles.breadcrumb}><Link href="/comunidad/precios">Precios</Link><span>›</span><span>Archivo</span></div><h1 className="text-4xl font-semibold">Precios anunciados: semana del {fmt(week)}</h1><p className={styles.date}>Estos precios son históricos y pueden haber vencido. Actualizado: {new Date(Math.max(...rows.map(o=>new Date(o.updated_at).getTime()))).toLocaleString('es-US',{timeZone:'America/New_York'})}.</p><PriceTable offers={rows}/></div></main>}
