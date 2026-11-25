import {NextRequest,NextResponse} from 'next/server';
import {currentAdmin,sameOrigin,adminHeaders} from '@/lib/grocery/admin';
import {request} from '@/lib/grocery/data';
export async function POST(req:NextRequest){
 if(!sameOrigin(req))return NextResponse.json({error:'Invalid origin'},{status:403,headers:adminHeaders});
 const token=await currentAdmin();
 if(!token)return NextResponse.json({error:'Unauthorized'},{status:401,headers:adminHeaders});
 const f=await req.formData().catch(()=>null);
 const day=String(f?.get('snapshot_date')||'');
 if(!/^\d{4}-\d{2}-\d{2}$/.test(day))
  return NextResponse.json({error:'Invalid snapshot date'},{status:400,headers:adminHeaders});
 const r=await request('/rest/v1/rpc/grocery_publish_csv_batch',{
  method:'POST',bearer:token,body:{p_snapshot_date:day}});
 return NextResponse.redirect(new URL('/admin/grocery-prices?'+
  (r.ok?'success=publish':'error=database'),req.url),303);
}
