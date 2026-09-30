import {trainingDimensions} from '@/content/training-dimensions';
import Image from 'next/image';
import Link from './PageLink';
import {ArrowUpRight,ChatCircleDots} from '@phosphor-icons/react/dist/ssr';
import {getDictionary} from '@/content';
import {extra,sections,nav} from '@/content/redesign';
import {source,type Locale} from '@/content/site';

const imageSizes:Record<string,[number,number]>={
 ...trainingDimensions,
 'archive-practice.jpg':[933,1334], 'archive-color.jpg':[1000,1334],
 'education-body-fit.webp':[1280,1342],
 'education-personal-color.webp':[1280,1280],
 'education-beauty-image.webp':[1536,2048],
 'education-total-image.webp':[1152,2048],
 'education-makeup-hair.webp':[1536,2048],
 'ipib-hanbeauty-exchange.jpg':[1280,1132], 'ipib-hanbeauty-mou.jpg':[1440,1081],
 'president-kim-manhee-01.png':[1024,1536], 'president-kim-manhee-02.jpg':[912,1104],
 'official-study-03.jpg':[748,996]
};
export function Photo({name,alt,className='',eager=false}:{name:string;alt:string;className?:string;eager?:boolean}){
 const [width,height]=imageSizes[name]||[1200,1600];
 return <div className={`photo ${className}`}><Image src={`/assets/${name}`} alt={alt} width={width} height={height} loading={eager?'eager':'lazy'} sizes="(max-width:768px) 100vw, (max-width:1440px) 60vw, 850px" style={{width:'100%',height:'auto'}}/></div>;
}
export function More({locale,to,children}:{locale:Locale;to:string;children:React.ReactNode}){
 return <Link className="text-link" href={`/${locale}/${to}`}>{children}<ArrowUpRight size={19} aria-hidden="true"/></Link>;
}
export function Partnership({locale}:{locale:Locale}){
 const d=getDictionary(locale);
 return <section className="partnership"><div className="wrap partnership-grid"><div><p className="eyebrow">GLOBAL PARTNERSHIP</p><h2>{d.partnershipTitle.replace('\n',' ')}</h2></div><div><p>{d.partnershipText}</p><Link className="partnership-cta" href={`/${locale}/contact`}><ChatCircleDots size={23} weight="regular" aria-hidden="true"/><span>{d.partnershipCta}</span></Link></div></div></section>;
}
export function Footer({locale}:{locale:Locale}){
 const d=getDictionary(locale),t=extra[locale];
 return <footer className="site-footer"><div className="wrap footer-grid">
  <div className="footer-brand"><Link className="footer-logo" href={`/${locale}`} aria-label="IPIB Home"><Image src="/assets/ipib-official-logo.png" alt="IPIB" width={500} height={500}/></Link><p>International Personal Color<br/>Image Branding Association Inc.</p></div>
  <div className="footer-information"><p className="eyebrow">IPIB / SEOUL, KOREA</p><strong>{d.legalName}</strong><p>{d.address}</p><a className="footer-email" href={`mailto:${source.email}`}>{source.email}</a></div>
  <nav className="footer-nav" aria-label="Footer navigation">{sections.map((s,i)=><Link href={`/${locale}/${s}`} key={s}>{nav[i]}</Link>)}</nav>
 </div><div className="wrap footer-bottom"><p>{d.representative}<br/>{d.registration}</p><div><details><summary>{t.privacy}</summary><p>{d.privacyText}</p></details></div><p>© IPIB. All rights reserved. <a className="admin-entry" href="/admin" target="_blank" rel="noopener noreferrer" aria-label="관리자 페이지 새 탭에서 열기">관리자</a></p></div></footer>;
}
