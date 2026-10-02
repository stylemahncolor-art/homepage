import VisualContent from '@/components/VisualContent';
import {ScrollReveal} from '@/components/ScrollReveal';
import {Header} from '@/components/Header';
import {Footer} from '@/components/Site';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { locales, languageTags, type Locale } from '@/content/site';
import { getDictionary } from '@/content';
export function generateStaticParams(){return locales.map(locale=>({locale}));}
export async function generateMetadata({params}:{params:Promise<{locale:string}>}):Promise<Metadata>{
 const {locale}=await params; if(!locales.includes(locale as Locale))notFound(); const d=getDictionary(locale as Locale);
 return {metadataBase:new URL('https://ipib.kr'),title:`IPIB | ${d.nav[1]} · ${d.nav[2]} · ${d.nav[3]}`,description:d.heroText,icons:{icon:'/assets/ipib-official-logo.png'},alternates:{canonical:`/${locale}`,languages:{ko:'/kr',en:'/en','zh-Hans':'/cn',ja:'/jp','x-default':'/kr'}},openGraph:{title:`IPIB — ${d.heroTitle.join(' ')}`,description:d.heroText,url:`/${locale}`,siteName:'IPIB',type:'website',locale:({kr:'ko_KR',en:'en_US',cn:'zh_CN',jp:'ja_JP'})[locale]},robots:{index:true,follow:true}};
}
export default async function Layout({children,params}:{children:React.ReactNode;params:Promise<{locale:string}>}){const {locale}=await params;if(!locales.includes(locale as Locale))notFound();return <><script dangerouslySetInnerHTML={{__html:`document.documentElement.lang=${JSON.stringify(languageTags[locale as Locale])}`}}/><a className="skip-link" href="#main">{getDictionary(locale as Locale).skip}</a><Header locale={locale as Locale}/>{children}<ScrollReveal key={locale}/><Footer locale={locale as Locale}/><VisualContent/></>;}

