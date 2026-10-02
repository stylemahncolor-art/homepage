import {getVisualDocument} from '@/lib/visual-cms';
import {validContentPath} from '@/lib/visual-content';
import {locales,type Locale} from '@/content/site';
export const dynamic='force-dynamic';
export async function GET(request:Request){
 const q=new URL(request.url).searchParams,path=q.get('path'),locale=q.get('locale') as Locale;
 if(!validContentPath(path)||!locales.includes(locale))return Response.json({error:'Invalid page'},{status:400});
 try{const [page,common]=await Promise.all([getVisualDocument(path,locale),getVisualDocument('common',locale)]);return Response.json({page,common},{headers:{'Cache-Control':'no-store'}});}catch{return Response.json({error:'Content unavailable'},{status:503,headers:{'Cache-Control':'no-store'}});}
}
