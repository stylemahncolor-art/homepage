import {locales} from '@/content/site';
import {sections,slugs} from '@/content/redesign';
import {getNews} from '@/lib/cms';
export const dynamic='force-dynamic';
const origin='https://ipib.kr';
const escapeXml=(value:string)=>value.replace(/[<>&"']/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&apos;'}[c]!));
export async function GET(){
 const news=await getNews();
 const paths=Array.from(new Set(['',...sections,...slugs.map(s=>'education/'+s),...news.map(n=>'news/'+n.slug)]));
 const urls=paths.flatMap(path=>locales.map(locale=>{
  const suffix=path?'/'+path:'';
  return `  <url>\n    <loc>${escapeXml(origin+'/'+locale+suffix)}</loc>\n  </url>`;
 })).join('\n');
 return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,{headers:{'Content-Type':'application/xml; charset=utf-8','Cache-Control':'public, max-age=300'}});
}
