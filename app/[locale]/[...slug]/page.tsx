import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {DetailPage} from '@/components/Pages';
import {sections,slugs} from '@/content/redesign';
import {getNews,getPageEdit} from '@/lib/cms';
import {locales,type Locale} from '@/content/site';
import {getDictionary} from '@/content';

export const dynamic='force-dynamic';
export async function generateMetadata({params}:{params:Promise<{locale:Locale;slug:string[]}>}):Promise<Metadata>{
 const {locale,slug}=await params;
 if(!locales.includes(locale))notFound();
 const path=slug.join('/'),d=getDictionary(locale);
 const field=slugs.indexOf(slug[1]),entry=(await getNews()).find(a=>path==='news/'+a.slug);
 const title=entry?entry.title[locale]:slug[0]==='education'&&field>=0?d.fieldNames[field]:d.nav[sections.indexOf(slug[0])];
 const descriptions=[d.aboutText,d.fieldsText,d.certificationText,d.globalText,d.newsText,d.contactText];
 const description=entry?entry.description[locale]:slug[0]==='education'&&field>=0?d.fieldDescriptions[field]:descriptions[sections.indexOf(slug[0])];
 return {title:`${title} | IPIB`,description,alternates:{canonical:`/${locale}/${path}`,languages:{ko:`/kr/${path}`,en:`/en/${path}`,'zh-Hans':`/cn/${path}`,ja:`/jp/${path}`,'x-default':`/kr/${path}`}},openGraph:{title:`${title} | IPIB`,description,url:`/${locale}/${path}`,siteName:'IPIB',type:entry?'article':'website'}};
}
export default async function Page({params}:{params:Promise<{locale:Locale;slug:string[]}>}){
 const {locale,slug}=await params;const path=slug.join('/');
 if(!locales.includes(locale))notFound();
 const news=await getNews();
 if(!sections.includes(path)&&!slugs.some(s=>path==='education/'+s)&&!news.some(n=>path==='news/'+n.slug))notFound();
 const edit=sections.includes(path)?await getPageEdit(path,locale):null;
 return <DetailPage locale={locale} slug={path} edit={edit} news={news}/>;
}
