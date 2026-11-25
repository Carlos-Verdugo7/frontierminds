import {NextRequest,NextResponse} from 'next/server';
import {validateFeedback} from '@/lib/grocery/feedback-validation';
import {config} from '@/lib/grocery/data';

export const dynamic='force-dynamic';
const headers={'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'};
const MAX_BODY=4096;
const reply=(error:string,status:number)=>NextResponse.json({error},{status,headers});

async function boundedJson(req:NextRequest):Promise<unknown>{
 if(Number(req.headers.get('content-length')||0)>MAX_BODY)throw Error('too_large');
 const reader=req.body?.getReader();
 if(!reader)throw Error('missing_body');
 const chunks:Uint8Array[]=[];let count=0;
 for(;;){
  const {done,value}=await reader.read();
  if(done)break;
  count+=value.length;
  if(count>MAX_BODY){await reader.cancel();throw Error('too_large')}
  chunks.push(value);
 }
 const joined=new Uint8Array(count);let offset=0;
 for(const part of chunks){joined.set(part,offset);offset+=part.length;}
 return JSON.parse(new TextDecoder().decode(joined));
}
async function verifyTurnstile(token:string,secret:string):Promise<boolean>{
 try{
  const form=new URLSearchParams({secret,response:token});
  const response=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{
   method:'POST',body:form,cache:'no-store',
   headers:{'Content-Type':'application/x-www-form-urlencoded'},
   signal:AbortSignal.timeout(6500)
  });
  if(!response.ok)return false;
  const data=await response.json() as {success?:boolean;hostname?:string;action?:string};
  const hosts=(process.env.GROCERY_TURNSTILE_ALLOWED_HOSTNAMES||'www.frontierminds.io,frontierminds.io')
   .split(',').map(x=>x.trim().toLowerCase()).filter(Boolean);
  return data.success===true&&data.action==='grocery_feedback'&&
   typeof data.hostname==='string'&&hosts.includes(data.hostname.toLowerCase());
 }catch{return false}
}
export async function POST(req:NextRequest){
 const url=config();
 const siteKey=process.env.NEXT_PUBLIC_GROCERY_TURNSTILE_SITE_KEY;
 const secret=process.env.GROCERY_TURNSTILE_SECRET_KEY;
 const serviceKey=process.env.SUPABASE_SERVICE_ROLE_KEY;
 if(!url||!siteKey||!secret||!serviceKey)
  return reply('El formulario todavía no está disponible.',503);
 const origin=req.headers.get('origin');
 if(!origin||origin!==req.nextUrl.origin)return reply('Solicitud no permitida.',403);
 if(!req.headers.get('content-type')?.startsWith('application/json'))
  return reply('Envía una solicitud JSON.',415);
 let data:unknown;
 try{data=await boundedJson(req)}catch{
  return reply('Solicitud inválida o demasiado larga.',400);
 }
 const input=validateFeedback(data);
 if(!input)return reply('Revisa los campos y el consentimiento.',400);
 if(!await verifyTurnstile(input.turnstile_token,secret))
  return reply('La verificación de seguridad no se completó. Inténtalo otra vez.',403);
 // Browser cannot write to Supabase. Service role is used exclusively server-side,
 // after payload validation and Cloudflare's single-use token verification.
 const record={
  helpful:input.helpful,section:input.section,context_slug:input.context_slug,
  comment:input.comment,contact_email:input.contact_email,
  contact_phone:input.contact_phone,followup_consent:input.followup_consent
 };
 try{
  const result=await fetch(url.url+'/rest/v1/grocery_feedback',{
   method:'POST',cache:'no-store',
   headers:{apikey:serviceKey,Authorization:'Bearer '+serviceKey,
    'Content-Type':'application/json','Prefer':'return=minimal'},
   body:JSON.stringify(record),signal:AbortSignal.timeout(6500)
  });
  if(!result.ok)return reply('No pudimos guardar la respuesta. Inténtalo más tarde.',503);
  return NextResponse.json({ok:true},{status:201,headers});
 }catch{
  return reply('No pudimos guardar la respuesta. Inténtalo más tarde.',503);
 }
}
