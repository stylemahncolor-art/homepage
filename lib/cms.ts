import {configured,selectRows,upsert} from './supabase';
import snapshotNews from '@/content/migration-news.json';
import snapshotOrder from '@/content/migration-order.json';
import {archives, type ArchiveRecord} from '@/content/archives';
import importedNews from '@/content/imported-news.json';
import {locales, type Locale} from '@/content/site';

export type PageEdit={page:string;locale:Locale;title:string;description:string;image:string|null};
export type NewsEdit=ArchiveRecord & {gallery?:string[];body?:Record<Locale,string>;status?:string;updatedAt?:string};
const normalizeCopy=(text:string)=>text.replaceAll('토털','토탈');
const emptyTranslations=()=>({kr:'',en:'',cn:'',jp:''});
const parseTranslations=(value:string)=>{try {const data=JSON.parse(value);return Object.fromEntries(locales.map(l=>[l,typeof data?.[l]==='string'?normalizeCopy(data[l]):''])) as Record<Locale,string>;}catch{return emptyTranslations();}};


export async function getPageEdit(page:string,locale:Locale):Promise<PageEdit|null>{
 if(!configured())return null;
 try {const rows=await selectRows<PageEdit>('page_content',`page=eq.${encodeURIComponent(page)}&locale=eq.${locale}`);const row=rows[0];return row?{...row,title:normalizeCopy(row.title),description:normalizeCopy(row.description)}:null;}catch{return null;}
}
export async function getPageEdits():Promise<PageEdit[]>{return selectRows<PageEdit>('page_content','page=not.like.visual:*&order=page,locale');}
export async function savePageEdit(value:PageEdit){await upsert('page_content',{...value,updated_at:new Date().toISOString()},'page,locale');}
export async function getNews(includeDrafts=false):Promise<NewsEdit[]>{
 let order:string[]=JSON.parse(snapshotOrder[0]?.slugs||'[]');
 if(configured())try{const rows=await selectRows<{slugs:string}>('news_order','id=eq.main');if(rows[0])order=JSON.parse(rows[0].slugs);}catch{}
 const ranks=new Map(order.map((slug,i)=>[slug,i]));
 let rows:{slug:string;category:number;title:string;description:string;body:string;image:string|null;gallery:string;source:string|null;status:string;updated_at:string}[]=[];
 rows=snapshotNews as typeof rows;
 if(configured())try{rows=await selectRows<typeof rows[number]>('news','order=updated_at.desc');}catch{/* Preserve the exported publication while backend is unavailable. */}
 const edits=rows.map(row=>({slug:row.slug,category:row.category,title:parseTranslations(row.title),description:parseTranslations(row.description),body:parseTranslations(row.body),image:row.image??undefined,gallery:JSON.parse(row.gallery||'[]') as string[],source:row.source??undefined,status:row.status,updatedAt:row.updated_at}));
 const bySlug=new Map<string,NewsEdit>([...archives,...importedNews].map(item=>[item.slug,item]));
 for(const item of edits)bySlug.set(item.slug,{...bySlug.get(item.slug),...item});
 return Array.from(bySlug.values()).filter(item=>!['miss-korea-2026-judging','miss-korea-2026-lecture'].includes(item.slug)).filter(item=>includeDrafts||item.status!=='draft').sort((a,b)=>{
   const ar=ranks.get(a.slug),br=ranks.get(b.slug);
   if(ar!==undefined||br!==undefined)return (ar??-1)-(br??-1);
   const priority=(s:string)=>s==='miss-korea-2026-judging'?0:s==='miss-korea-2026-lecture'?1:s==='han-beauty-mou'?2:3;
   if(a.updatedAt||b.updatedAt)return String(b.updatedAt??'').localeCompare(String(a.updatedAt??''));
   return priority(a.slug)-priority(b.slug);
 }).map(item=>includeDrafts?item:{...item,title:Object.fromEntries(locales.map(l=>[l,item.title[l]||item.title.kr])) as Record<Locale,string>,description:Object.fromEntries(locales.map(l=>[l,item.description[l]||item.description.kr])) as Record<Locale,string>,body:item.body?Object.fromEntries(locales.map(l=>[l,item.body?.[l]||item.body?.kr||''])) as Record<Locale,string>:undefined});
}
export async function saveNewsOrder(slugs:string[]){await upsert('news_order',{id:'main',slugs:JSON.stringify(slugs)},'id');}
export async function saveNews(item:NewsEdit){await upsert('news',{slug:item.slug,category:item.category,title:JSON.stringify(item.title),description:JSON.stringify(item.description),body:JSON.stringify(item.body??emptyTranslations()),image:item.image??null,source:item.source??null,status:item.status??'published',updated_at:new Date().toISOString(),gallery:JSON.stringify(item.gallery??[])},'slug');}
