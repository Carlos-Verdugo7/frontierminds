import {NextRequest,NextResponse} from 'next/server';
import {passwordSignIn,storeSession,sameOrigin,adminHeaders} from '@/lib/grocery/admin';
export async function POST(req:NextRequest){
 if(!sameOrigin(req))return NextResponse.json({error:'Invalid origin'},{status:403,headers:adminHeaders});
 if(Number(req.headers.get('content-length')||0)>2500)return NextResponse.json({error:'Request too large'},{status:413});
 const form=await req.formData().catch(()=>null);
 const email=String(form?.get('email')||'').slice(0,254);
 const password=String(form?.get('password')||'').slice(0,300);
 const token=await passwordSignIn(email,password);
 if(!token)return NextResponse.redirect(new URL('/admin/grocery-prices?error=login',req.url),303);
 await storeSession(token);
 return NextResponse.redirect(new URL('/admin/grocery-prices',req.url),303);
}
