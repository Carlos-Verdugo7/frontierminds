import {NextRequest,NextResponse} from 'next/server';
import {clearSession,sameOrigin,adminHeaders} from '@/lib/grocery/admin';
export async function POST(req:NextRequest){
 if(!sameOrigin(req))return NextResponse.json({error:'Invalid origin'},{status:403,headers:adminHeaders});
 await clearSession();
 return NextResponse.redirect(new URL('/admin/grocery-prices',req.url),303);
}
