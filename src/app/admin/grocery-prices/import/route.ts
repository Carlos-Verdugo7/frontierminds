import {NextRequest,NextResponse} from 'next/server';
import {currentAdmin,csvRows,sameOrigin,adminHeaders} from '@/lib/grocery/admin';
import {request} from '@/lib/grocery/data';
export async function POST(req:NextRequest){
 if(!sameOrigin(req))return NextResponse.json({error:'Invalid origin'},{status:403,headers:adminHeaders});
 if(Number(req.headers.get('content-length')||0)>220000)return NextResponse.json({error:'Request too large'},{status:413});
 const token=await currentAdmin();
 if(!token)return NextResponse.json({error:'Unauthorized'},{status:401,headers:adminHeaders});
 const body=await req.formData().catch(()=>null);
 const week=String(body?.get('week_start')||'');
 const allow=body?.get('allow_published')==='on';
 if(!/^\d{4}-\d{2}-\d{2}$/.test(week)||new Date(week+'T12:00:00Z').getUTCDay()!==1)
   return NextResponse.redirect(new URL('/admin/grocery-prices?error=week',req.url),303);
 const file=body?.get('file');
 if(!(file instanceof File)||file.size>160000)return NextResponse.redirect(new URL('/admin/grocery-prices?error=file',req.url),303);
 let rows:Record<string,string>[];
 try{rows=csvRows(await file.text())}catch{return NextResponse.redirect(new URL('/admin/grocery-prices?error=csv',req.url),303)}
 const r=await request('/rest/v1/rpc/grocery_import_week',{method:'POST',bearer:token,body:{p_week_start:week,p_rows:rows,p_allow_published:allow}});
 return NextResponse.redirect(new URL('/admin/grocery-prices?'+(r.ok?'success=import':'error=database'),req.url),303);
}
