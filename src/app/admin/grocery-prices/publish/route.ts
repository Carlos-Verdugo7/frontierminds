import {NextRequest,NextResponse} from 'next/server';
import {currentAdmin,sameOrigin,adminHeaders} from '@/lib/grocery/admin';
import {request} from '@/lib/grocery/data';
export async function POST(req:NextRequest){
 if(!sameOrigin(req))return NextResponse.json({error:'Invalid origin'},{status:403,headers:adminHeaders});
 const token=await currentAdmin();
 if(!token)return NextResponse.json({error:'Unauthorized'},{status:401,headers:adminHeaders});
 const f=await req.formData().catch(()=>null);const week=String(f?.get('week_start')||'');
 if(!/^\d{4}-\d{2}-\d{2}$/.test(week))return NextResponse.json({error:'Invalid week'},{status:400});
 const r=await request('/rest/v1/rpc/grocery_publish_week',{method:'POST',bearer:token,body:{p_week_start:week}});
 return NextResponse.redirect(new URL('/admin/grocery-prices?'+(r.ok?'success=publish':'error=database'),req.url),303);
}
