import {NextRequest,NextResponse} from 'next/server';
import {currentAdmin,sameOrigin,adminHeaders} from '@/lib/grocery/admin';
import {request} from '@/lib/grocery/data';
export async function POST(req:NextRequest){
 if(!sameOrigin(req))return NextResponse.json({error:'Invalid origin'},{status:403,headers:adminHeaders});
 const token=await currentAdmin();
 if(!token)return NextResponse.json({error:'Unauthorized'},{status:401,headers:adminHeaders});
 const form=await req.formData().catch(()=>null);
 const offer=String(form?.get('offer_id')||'');
 if(form?.get('confirm')!=='on'||!/^[a-f0-9]{8}-[a-f0-9-]{27,36}$/i.test(offer))
   return NextResponse.redirect(new URL('/admin/grocery-prices?error=validation',req.url),303);
 const r=await request('/rest/v1/rpc/grocery_remove_offer',{method:'POST',bearer:token,body:{p_id:offer,p_allow_published:form?.get('allow_published')==='yes'}});
 return NextResponse.redirect(new URL('/admin/grocery-prices?'+(r.ok?'success=remove':'error=database'),req.url),303);
}
