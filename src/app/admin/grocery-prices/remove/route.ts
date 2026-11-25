import {NextRequest,NextResponse} from 'next/server';
import {currentAdmin,sameOrigin,adminHeaders} from '@/lib/grocery/admin';
import {request} from '@/lib/grocery/data';
export async function POST(req:NextRequest){
 if(!sameOrigin(req))return NextResponse.json({error:'Invalid origin'},{status:403,headers:adminHeaders});
 const token=await currentAdmin();
 if(!token)return NextResponse.json({error:'Unauthorized'},{status:401,headers:adminHeaders});
 const f=await req.formData().catch(()=>null);
 const id=String(f?.get('price_row_id')||'');
 const batch=String(f?.get('batch_id')||'');
 if(f?.get('confirm')!=='on'||!/^[0-9]+$/.test(id)||!/^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(batch))
  return NextResponse.redirect(new URL('/admin/grocery-prices?error=validation',req.url),303);
 const r=await request('/rest/v1/rpc/grocery_remove_csv_price',{method:'POST',
  bearer:token,body:{p_batch_id:batch,p_price_row_id:Number(id),
  p_allow_published:f?.get('allow_published')==='yes'}});
 return NextResponse.redirect(new URL('/admin/grocery-prices?'+
 (r.ok?'success=remove':'error=database'),req.url),303);
}
