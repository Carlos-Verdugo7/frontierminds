import Link from 'next/link';
import type {Metadata} from 'next';
import {currentAdmin} from '@/lib/grocery/admin';
import {config,request,localDate} from '@/lib/grocery/data';
import styles from '@/components/grocery/grocery.module.css';
export const dynamic='force-dynamic';
export const metadata:Metadata={title:'Administrador de precios | FrontierMinds',robots:{index:false,follow:false}};
type P={searchParams:Promise<Record<string,string|string[]|undefined>>};
type Batch={id:string;snapshot_date:string;status:string;updated_at:string;published_at:string|null};
type Row={batch_id:string;snapshot_date:string;status:string;price_row_id:number;chain:string;flyer_id:string;item_en:string;item_es:string|null;advertised_price:string;price_type:string;membership_required:string;valid_from:string;valid_to:string;source_url:string|null;compare_item:string|null;match_note:string|null;store_count:number};
export default async function AdminPage({searchParams}:P){
 const token=await currentAdmin();const q=await searchParams;
 const err=typeof q.error==='string'?q.error:null;const success=typeof q.success==='string'?q.success:null;
 const [batchResult,rowsResult,feedbackResult]=token?await Promise.all([
  request('/rest/v1/grocery_csv_batches?select=id,snapshot_date,status,updated_at,published_at&order=snapshot_date.desc&limit=25',{bearer:token,fresh:true}),
  request('/rest/v1/grocery_csv_editor_prices?select=*&order=snapshot_date.desc,price_row_id.asc&limit=500',{bearer:token,fresh:true}),
  request('/rest/v1/grocery_feedback?select=id,submitted_at,helpful,section,comment,contact_email,contact_phone,followup_consent&order=submitted_at.desc&limit=50',{bearer:token,fresh:true})
 ]):[null,null,null];
 type FeedbackRow={id:string;submitted_at:string;helpful:'yes'|'no';section:string;comment:string|null;contact_email:string|null;contact_phone:string|null;followup_consent:boolean};
 const feedback=Array.isArray(feedbackResult?.data)?feedbackResult.data as FeedbackRow[]:[];
  const batches=Array.isArray(batchResult?.data)?batchResult.data as Batch[]:[];
 const priceRows=Array.isArray(rowsResult?.data)?rowsResult.data as Row[]:[];
 const orphan=priceRows.filter(row=>row.store_count===0);
 return <main className={styles.main} lang="es"><div className={styles.container}>
  <nav className={styles.breadcrumb}><Link href="/comunidad/precios">Precios públicos</Link><span>›</span><span>Editor</span></nav>
  <p className={styles.eyebrow}>ADMINISTRACIÓN PRIVADA · ARCHIVOS CSV</p>
  <h1 className="text-4xl font-semibold tracking-tight mt-3">Administrar ofertas semanales</h1>
  {!config()&&<p className={styles.adminNote}>No se detecta la integración de Supabase. Comprueba las variables de entorno de Vercel.</p>}
  {err&&<p className={styles.error} role="alert">{
   err==='login'?'Credenciales inválidas o sin permiso.':
   err==='csv'?'CSV incorrecto: revisa columnas, flyer_id, fechas, números y tiendas.':
   err==='date'?'Fecha de corte inválida.':
   err==='size'?'Se requieren ambos archivos CSV (máximo 900 KB cada uno).':
   'La operación no se pudo completar; revisa la migración o los permisos.'
  }</p>}
  {success&&<p className={styles.success} role="status">{
   success==='publish'?'Lote publicado correctamente.':
   success==='remove'?'Fila eliminada.':
   'Ambos CSV importados como borrador. Revisa tiendas y ofertas antes de publicar.'
  }</p>}
  {!token?<>
   <p className={styles.muted}>Esta sección es solo para un editor autorizado en Supabase Auth. Los visitantes no pueden publicar ni editar ofertas.</p>
   <form method="post" action="/admin/grocery-prices/login" className={styles.form}>
    <label htmlFor="email">Correo del administrador</label><input id="email" name="email" type="email" required autoComplete="username"/>
    <label htmlFor="password">Contraseña</label><input id="password" name="password" type="password" required autoComplete="current-password"/>
    <button type="submit">Entrar</button>
   </form>
  </>:<>
   <form action="/admin/grocery-prices/logout" method="post" className={styles.links}><button type="submit" className={styles.pill}>Cerrar sesión</button></form>
   <p className={styles.adminNote}>Sube los dos CSV con los encabezados originales, exactamente como wpb_grocery_prices.csv y wpb_grocery_stores.csv. Los registros se relacionan por <code>chain + flyer_id</code>. El lote se guarda como borrador hasta su publicación. La actualización de un lote publicado exige confirmación explícita.</p>
   <form action="/admin/grocery-prices/import" method="post" encType="multipart/form-data" className={styles.form}>
    <h2 className="text-xl font-semibold">1. Importar los dos archivos</h2>
    <label htmlFor="snapshot">Fecha de este lote</label>
    <input id="snapshot" name="snapshot_date" type="date" defaultValue={localDate()} required/>
    <label htmlFor="prices_file">wpb_grocery_prices.csv (una fila por oferta)</label>
    <input id="prices_file" type="file" name="prices_file" accept=".csv,text/csv" required/>
    <Link className={styles.pill} href="/admin/grocery-prices/template?kind=prices">Descargar encabezados de precios</Link>
    <label htmlFor="stores_file">wpb_grocery_stores.csv (una fila por local)</label>
    <input id="stores_file" type="file" name="stores_file" accept=".csv,text/csv" required/>
    <Link className={styles.pill} href="/admin/grocery-prices/template?kind=stores">Descargar encabezados de tiendas</Link>
    <label className={styles.small}><input style={{width:'auto',marginRight:8}} type="checkbox" name="replace_published"/>Confirmo una corrección sobre un lote ya publicado.</label>
    <button type="submit">Validar e importar como borrador</button>
   </form>
   <section className={styles.section}>
    <h2>2. Revisar los lotes y publicar</h2>
    {!batches.length&&<p className={styles.empty}>No hay lotes importados. Importa los archivos iniciales para crear el primer borrador.</p>}
    <div className={styles.cards}>{batches.map(x=><div className={styles.card} key={x.id}>
     <strong>{x.snapshot_date}</strong><small>{x.status==='published'?'Publicado':'Borrador'} · Actualizado {new Date(x.updated_at).toLocaleString('es-US',{timeZone:'America/New_York'})}</small>
     {x.status==='draft'&&<form action="/admin/grocery-prices/publish" method="post" className="mt-3"><input type="hidden" name="snapshot_date" value={x.snapshot_date}/><button type="submit" className={styles.pill}>Publicar este lote</button></form>}
    </div>)}</div>
   </section>
   <section className={styles.section}>
    <h2>Comentarios de compradores (privados)</h2>
    <p className={styles.muted}>Solo editores autorizados. Nunca uses los contactos para promociones. El permiso cubre únicamente un seguimiento individual de su comentario. Máximo 50 respuestas recientes.</p>
    {!feedbackResult?.ok&&<p className={styles.adminNote}>El panel de comentarios se activa después de ejecutar la migración 003 en Supabase.</p>}
    {feedbackResult?.ok&&feedback.length===0&&<p className={styles.empty}>Aún no hay respuestas.</p>}
    {feedback.length>0&&<div className={styles.tableWrap}><table className={styles.table}>
     <thead><tr><th>Recibido</th><th>Respuesta</th><th>Comentario</th><th>Seguimiento consentido</th></tr></thead>
     <tbody>{feedback.map(x=><tr key={x.id}>
      <td>{new Date(x.submitted_at).toLocaleString('es-US',{timeZone:'America/New_York'})}<small>{x.section}</small></td>
      <td>{x.helpful==='yes'?'Sí, útil':'No todavía'}</td>
      <td>{x.comment||'Sin comentario'}</td>
      <td>{x.followup_consent?(x.contact_email||x.contact_phone||'Sin contacto'):'No solicitado'}</td>
     </tr>)}</tbody>
    </table></div>}
   </section>
   <section className={styles.section}>
    <h2>3. Vista de importaciones recientes</h2>
    <p className={styles.muted}>Se muestran hasta 500 filas; la importación completa se guarda en la base de datos. Los flyers sin local no pueden publicarse.</p>
    {orphan.length>0&&<p className={styles.error}>Hay {orphan.length} precios sin tiendas asignadas. Corrige las relaciones de flyer_id antes de publicar.</p>}
    <div className={styles.tableWrap}><table className={styles.table}>
     <thead><tr><th>Fecha y flyer</th><th>Producto</th><th>Oferta</th><th>Vigencia</th><th>Locales</th><th>Acción</th></tr></thead>
     <tbody>{priceRows.map(o=><tr key={o.batch_id+'-'+o.price_row_id}>
      <td>{o.snapshot_date}<small>{o.chain} · {o.flyer_id}</small></td>
      <td>{o.item_es||o.item_en}<small>{o.item_en}</small></td>
      <td>{o.advertised_price}<small>{o.price_type} · Membresía: {o.membership_required}</small></td>
      <td>{o.valid_from} – {o.valid_to}</td>
      <td>{o.store_count}</td>
      <td><form action="/admin/grocery-prices/remove" method="post">
       <input type="hidden" name="batch_id" value={o.batch_id}/><input type="hidden" name="price_row_id" value={o.price_row_id}/>
       <input type="hidden" name="allow_published" value={o.status==='published'?'yes':'no'}/>
       <label className={styles.small}><input type="checkbox" name="confirm" required style={{width:'auto',marginRight:6}}/>Confirmar</label>
       <button className={styles.pill} type="submit">Eliminar</button>
      </form></td>
     </tr>)}</tbody>
    </table></div>
   </section>
  </>}
 </div></main>;
}
