'use client';
import {useEffect,useRef,useState,type FormEvent} from 'react';
import Script from 'next/script';
import {trackGrocery,type GrocerySection} from '@/lib/grocery/analytics';
import styles from './grocery.module.css';
type TurnstileApi={
 render:(container:HTMLElement,options:{
  sitekey:string;action:string;theme:string;
  callback:(token:string)=>void;
  'expired-callback':()=>void;'error-callback':()=>void
 })=>string;
 reset:(id:string)=>void;remove:(id:string)=>void;
};
declare global{interface Window{turnstile?:TurnstileApi}}
const sitekey=process.env.NEXT_PUBLIC_GROCERY_TURNSTILE_SITE_KEY||'';
export default function GroceryFeedback({section,contextSlug=null}:{
 section:GrocerySection;contextSlug?:string|null
}){
 const [vote,setVote]=useState<'yes'|'no'|''>('');
 const [comment,setComment]=useState('');
 const [method,setMethod]=useState<'none'|'email'|'phone'>('none');
 const [value,setValue]=useState('');
 const [consent,setConsent]=useState(false);
 const [token,setToken]=useState('');
 const [scriptReady,setScriptReady]=useState(false);
 const [busy,setBusy]=useState(false);
 const [status,setStatus]=useState<'idle'|'sent'|'error'>('idle');
 const [message,setMessage]=useState('');
 const container=useRef<HTMLDivElement>(null);
 const widgetId=useRef<string|null>(null);
 useEffect(()=>{
  if(!sitekey||!scriptReady||!window.turnstile||!container.current||widgetId.current)return;
  const element=container.current;
  widgetId.current=window.turnstile.render(element,{
   sitekey,action:'grocery_feedback',theme:'auto',
   callback:setToken,'expired-callback':()=>setToken(''),
   'error-callback':()=>setToken('')
  });
  return ()=>{
   if(widgetId.current&&window.turnstile)window.turnstile.remove(widgetId.current);
   widgetId.current=null;
  };
 },[scriptReady]);
 function reset(){
  setToken('');
  if(widgetId.current)window.turnstile?.reset(widgetId.current);
 }
 async function send(event:FormEvent<HTMLFormElement>){
  event.preventDefault();
  if(!vote||!token||busy||!sitekey)return;
  if(method!=='none'&&(!consent||!value.trim())){
   setStatus('error');setMessage('Debes aceptar el consentimiento si nos dejas un contacto.');return;
  }
  setBusy(true);setStatus('idle');setMessage('');
  try{
   const response=await fetch('/api/grocery-prices/feedback',{
    method:'POST',headers:{'Content-Type':'application/json'},
    cache:'no-store',body:JSON.stringify({
     helpful:vote,section,context_slug:contextSlug,
     comment:comment.trim(),contact_method:method,
     contact_value:method==='none'?'':value.trim(),
     followup_consent:method==='none'?false:consent,
     turnstile_token:token,website:''
    }),signal:AbortSignal.timeout(10000)
   });
   if(!response.ok)throw Error('No se pudo guardar tu respuesta. Inténtalo otra vez.');
   trackGrocery('grocery_feedback_submitted',section,vote);
   setStatus('sent');setMessage('¡Gracias! Recibimos tu respuesta.');
   setVote('');setComment('');setValue('');setConsent(false);setMethod('none');
  }catch{
   setStatus('error');setMessage('No pudimos guardar tu respuesta. Inténtalo de nuevo.');
  }finally{setBusy(false);reset()}
 }
 return <section className={styles.feedbackPanel} aria-labelledby="grocery-feedback-title">
  <p className={styles.eyebrow}>AYÚDANOS A MEJORAR</p>
  <h2 id="grocery-feedback-title">¿Te ayudó esta comparación a decidir dónde comprar?</h2>
  <p className={styles.muted}>Tu respuesta nos ayuda a saber si los precios son útiles para familias de Palm Beach County.</p>
  {!sitekey?<p className={styles.adminNote}>El formulario de comentarios estará disponible próximamente.</p>:<>
   <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
    strategy="afterInteractive" onReady={()=>setScriptReady(true)}/>
   <form onSubmit={send} className={styles.feedbackForm}>
    <fieldset className={styles.feedbackVotes}>
     <legend>¿Fue útil la información?</legend>
     <label><input type="radio" name="helpful" value="yes" required
      checked={vote==='yes'} onChange={()=>{setVote('yes');trackGrocery('grocery_feedback_vote',section,'yes')}}/> Sí, me ayudó</label>
     <label><input type="radio" name="helpful" value="no"
      checked={vote==='no'} onChange={()=>{setVote('no');trackGrocery('grocery_feedback_vote',section,'no')}}/> No todavía</label>
    </fieldset>
    <label htmlFor={'grocery-comment-'+section}>¿Qué faltó o qué mejorarías? (opcional)</label>
    <textarea id={'grocery-comment-'+section} maxLength={400} value={comment}
     onChange={e=>setComment(e.target.value)} rows={3}
     placeholder="Ej. Me gustaría comparar huevos cerca de mi casa."/>
    <label htmlFor={'grocery-contact-method-'+section}>¿Quieres que te contactemos sobre tu comentario? (opcional)</label>
    <select id={'grocery-contact-method-'+section} value={method}
     onChange={e=>{setMethod(e.target.value as 'none'|'email'|'phone');setValue('');setConsent(false)}}>
     <option value="none">No, prefiero responder anónimamente</option>
     <option value="email">Sí, por correo electrónico</option>
     <option value="phone">Sí, por teléfono</option>
    </select>
    {method!=='none'&&<>
     <label htmlFor={'grocery-contact-'+section}>{method==='email'?'Tu correo electrónico':'Tu teléfono de EE. UU.'}</label>
     <input id={'grocery-contact-'+section} value={value} maxLength={method==='email'?254:25}
      type={method==='email'?'email':'tel'} autoComplete={method==='email'?'email':'tel'} required
      placeholder={method==='email'?'correo@ejemplo.com':'(561) 555-0123'}
      onChange={e=>setValue(e.target.value)}/>
     <label className={styles.feedbackConsent}><input type="checkbox" checked={consent}
      onChange={e=>setConsent(e.target.checked)} required/>
      <span>Autorizo a FrontierMinds a contactarme únicamente para dar seguimiento a este comentario por el medio que elegí. No estoy solicitando mensajes promocionales ni suscripciones. Puedo solicitar que eliminen mi información escribiendo a info@frontierminds.io.</span></label>
    </>}
    <p className={styles.small}>Tu nombre no es necesario. No compartas información sensible. Los datos de contacto son opcionales, no se envían a Google Analytics y solo se usan para responder a tu comentario. Se planea conservar los comentarios hasta 90 días; la eliminación debe configurarse antes de activar el formulario.</p>
    <div ref={container} aria-label="Comprobación de seguridad de Cloudflare Turnstile"/>
    <button type="submit" disabled={busy||!vote||!token||(method!=='none'&&(!consent||!value.trim()))}>
     {busy?'Enviando…':'Enviar respuesta'}
    </button>
    {status!=='idle'&&<p role="status" className={status==='sent'?styles.success:styles.error}>{message}</p>}
   </form>
  </>}
 </section>;
}
