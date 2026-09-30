'use client';
import Link from './PageLink';
import Image from 'next/image';
import {usePathname} from 'next/navigation';
import {useRef,useState} from 'react';
import {List,X,Globe} from '@phosphor-icons/react';
import {locales,type Locale} from '@/content/site';
import {getDictionary} from '@/content';
import {nav,sections} from '@/content/redesign';
export function Header({locale}:{locale:Locale}){
 const [open,setOpen]=useState(false);const toggle=useRef<HTMLButtonElement>(null);
 const pathname=usePathname();const suffix=pathname.replace(/^\/(kr|en|cn|jp)/,'');const d=getDictionary(locale);
 const close=()=>setOpen(false);
 return <header className="header" onKeyDown={event=>{if(event.key==='Escape'&&open){close();toggle.current?.focus();}}}>
  <div className="header-inner">
   <Link href={`/${locale}`} className="logo" aria-label="IPIB Home" onClick={close}><Image src="/assets/ipib-official-logo.png" alt="IPIB" width={500} height={500} priority/></Link>
   <nav className="desktop-nav" aria-label="Main navigation">{sections.map((s,i)=><Link key={s} href={`/${locale}/${s}`} aria-current={suffix.startsWith('/'+s)?'page':undefined}>{nav[i]}</Link>)}</nav>
   <nav className="languages" aria-label={d.language}><Globe size={16} aria-hidden="true"/>{locales.map(l=><Link key={l} href={`/${l}${suffix}`} lang={l==='kr'?'ko':l==='cn'?'zh':l==='jp'?'ja':'en'} aria-current={locale===l?'true':undefined} onClick={close}>{{kr:'한국어',en:'English',cn:'中文',jp:'日本語'}[l]}</Link>)}</nav>
   <button ref={toggle} className="menu-toggle" aria-label={open?d.close:d.menu} aria-expanded={open} aria-controls="mobile-navigation" onClick={()=>setOpen(!open)}>{open?<X size={26}/>:<List size={26}/>}</button>
  </div>
  {open&&<nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation">{sections.map((s,i)=><Link key={s} href={`/${locale}/${s}`} onClick={close} aria-current={suffix.startsWith('/'+s)?'page':undefined}><span>{nav[i]}</span><span>{d.nav[i]}</span></Link>)}</nav>}
 </header>;
}
