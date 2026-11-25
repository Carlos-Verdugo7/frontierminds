import {NextResponse} from 'next/server';
import {templateHeader} from '@/lib/grocery/admin';
export async function GET(){return new NextResponse(templateHeader,{headers:{'Content-Type':'text/csv; charset=utf-8','Content-Disposition':'attachment; filename="frontierminds-grocery-template.csv"','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}})}
