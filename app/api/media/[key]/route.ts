import {NextResponse} from 'next/server';
import imported from '@/content/migrated-media.json';
export const dynamic='force-dynamic';
export async function GET(request:Request,{params}:{params:Promise<{key:string}>}){const {key}=await params;if(!/^[a-f0-9-]{36}$/.test(key))return new Response('Not found',{status:404});const local=(imported as Record<string,{path:string}>)[key];if(local?.path)return NextResponse.redirect(new URL(local.path,request.url),307);const url=process.env.SUPABASE_URL;if(!url)return new Response('Not found',{status:404});return NextResponse.redirect(`${url}/storage/v1/object/public/${process.env.SUPABASE_MEDIA_BUCKET||'ipib-media'}/${key}`,307);}
