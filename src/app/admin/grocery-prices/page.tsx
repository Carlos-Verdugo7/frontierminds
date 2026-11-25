import Link from 'next/link';
import type {Metadata} from 'next';
import {currentAdmin} from '@/lib/grocery/admin';
import {config,request,weekStart} from '@/lib/grocery/data';
import styles from '@/components/grocery/grocery.module.css';
export const dynamic='force-dynamic';
export const metadata:Metadata={title:'Administrar precios | FrontierMinds',robots:{index:false,follow:false}};
type Params={searchParams:Promise<Record<string,string|string[]|undefined>>};
export default async function AdminPage({searchParams}:Params){
 const token=await currentAdmin();const query=await searchParams;
 const error=typeof query.error==='string'?query.error:null;
 const success=typeof query.success==='string'?query.success:null;
 const weeks=token?await request('/rest/v1/grocery_weeks?select=week_start,status,updated_at,published_at&order=week_start.desc&limit=25',{bearer:token,fresh:true}):null;
 const entries=Array.isArray(weeks?.data)?weeks.data as {week_start:string;status:string;updated_at:string;published_at:string|null}[]:[];
 return <main className={styles.main} lang="es"><div className={styles.container}>
 <nav className={styles.breadcrumb}><Link href="/comunidad/precios">Precios públicos</Link><span>›</span><span>Administración</span></nav>
 <p className={styles.eyebrow}>ACCESO RESTRINGIDO</p><h1 className="text-4xl font-semibold tracking-tight mt-3">Administrar precios semanales</h1>
 {!config()&&<p className={styles.adminNote}>Configura SUPABASE_URL y una clave publicable/anon en Vercel, y aplica la migración de Supabase. No copies claves secretas aquí.</p>}
 {error&&<p className={styles.error} role="alert">{error==='login'?'Credenciales inválidas o usuario sin permiso.':error==='csv'?'CSV inválido; revisa la plantilla, fechas y columnas.':error==='week'?'La semana debe comenzar en lunes.':error==='file'?'Elige un archivo CSV de menos de 160 KB.':'No se pudo completar la operación. Comprueba la migración, la configuración y los permisos.'}</p>}
 {success&&<p className={styles.success} role="status">{success==='publish'?'Semana publicada.':'Importación completada. Revisa los registros antes de publicar.'}</p>}
 {!token?<><p className={styles.muted}>Solo los administradores autorizados mediante Supabase Auth pueden subir y publicar precios. Ningún visitante puede escribir datos.</p><form method="post" action="/admin/grocery-prices/login" className={styles.form}>
 <label htmlFor="email">Correo administrador</label><input id="email" name="email" type="email" required maxLength={254} autoComplete="username"/>
 <label htmlFor="password">Contraseña</label><input id="password" name="password" type="password" required maxLength={300} autoComplete="current-password"/>
 <button type="submit">Entrar al administrador</button></form></>:
 <>
 <form method="post" action="/admin/grocery-prices/logout" className={styles.links}><button type="submit" className={styles.pill}>Cerrar sesión</button></form>
 <p className={styles.adminNote}>Importa precios de tiendas con dirección exacta y un anuncio HTTPS verificable. La importación crea un borrador. La publicación requiere una segunda acción. Los registros publicados se mantienen como archivo.</p>
 <form action="/admin/grocery-prices/import" method="post" encType="multipart/form-data" className={styles.form}>
 <h2 className="text-xl font-semibold">1. Subir CSV semanal</h2>
 <p className={styles.small}>Las semanas empiezan en lunes (hora de Florida). Máximo 250 filas. Cada combinación tienda/producto debe aparecer una sola vez por semana.</p>
 <label htmlFor="week">Inicio de la semana (lunes)</label><input id="week" type="date" name="week_start" defaultValue={weekStart()} required/>
 <label htmlFor="upload">CSV de ofertas verificadas</label><input id="upload" type="file" name="file" accept=".csv,text/csv" required/>
 <Link href="/admin/grocery-prices/template" className={styles.pill}>Descargar plantilla CSV</Link>
 <label className={styles.small}><input style={{width:'auto',marginRight:8}} type="checkbox" name="allow_published"/> Corregir una semana ya publicada (editará los precios visibles)</label>
 <button type="submit">Validar e importar</button>
 </form>
 <section className={styles.section}><h2>2. Revisar y publicar</h2>
 {!entries.length&&<p className={styles.muted}>Sin semanas importadas, o la migración todavía no se ha aplicado.</p>}
 <div className={styles.cards}>{entries.map(w=><div className={styles.card} key={w.week_start}><strong>{w.week_start}</strong><small>{w.status==='published'?'Publicado':'Borrador'} · {new Date(w.updated_at).toLocaleString('es-US',{timeZone:'America/New_York'})}</small>{w.status!=='published'&&<form method="post" action="/admin/grocery-prices/publish" className="mt-3"><input type="hidden" name="week_start" value={w.week_start}/><button type="submit" className={styles.pill}>Publicar semana</button></form>}</div>)}</div>
 </section></>}
 <p className={styles.small}>Solo se guardan precios publicados, sus fuentes y fechas. Esta página privada no ofrece cuentas al público.</p>
 </div></main>
}
