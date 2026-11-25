import 'server-only';
import {cookies} from 'next/headers';
import {config,request} from './data';
const COOKIE='fm_grocery_session';
type Token={access_token?:string;expires_in?:number;refresh_token?:string};
export async function currentAdmin(){
  const token=(await cookies()).get(COOKIE)?.value;
  if(!token)return null;
  const r=await request('/rest/v1/rpc/is_grocery_admin',{method:'POST',body:{},bearer:token});
  return r.ok&&r.data===true?token:null;
}
export async function passwordSignIn(email:string,password:string):Promise<string|null>{
  if(!config()||!email||!password)return null;
  const r=await request('/auth/v1/token?grant_type=password',{method:'POST',body:{email,password}});
  if(!r.ok||!r.data||typeof r.data!=='object')return null;
  const token=(r.data as Token).access_token;
  if(!token)return null;
  const check=await request('/rest/v1/rpc/is_grocery_admin',{method:'POST',body:{},bearer:token});
  if(!check.ok||check.data!==true)return null;
  return token;
}
export async function storeSession(token:string){
  (await cookies()).set(COOKIE,token,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'strict',path:'/admin/grocery-prices',maxAge:3300});
}
export async function clearSession(){(await cookies()).set(COOKIE,'',{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'strict',path:'/admin/grocery-prices',maxAge:0});}
export function sameOrigin(request:Request){
 const origin=request.headers.get('origin');
 if(!origin)return false;
 try{
   const source=new URL(origin);
   const target=new URL(request.url);
   return source.origin===target.origin;
 }catch{return false}
}
export const adminHeaders={'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'};
export { csvRows, pricesTemplate, storesTemplate } from './csv';
