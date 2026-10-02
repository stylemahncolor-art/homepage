'use client';
import ResponsiveImage from './ResponsiveImage';
import {BrandText} from './BrandText';
import {ArrowUpRight,EnvelopeSimple,ChatCircle} from '@phosphor-icons/react';
import Image from 'next/image';
import {useState} from 'react';
import Link from './PageLink';
import type {NewsEdit} from '@/lib/cms';
import {extra} from '@/content/redesign';
import {getDictionary} from '@/content';
import {source,type Locale} from '@/content/site';
export function ContactOptions({locale}:{locale:Locale}){const t=extra[locale],d=getDictionary(locale);const options=[...d.contactTypes,t.general];const [value,setValue]=useState(0);return <div className="contact-options"><fieldset><legend>{t.choose}</legend>{options.map((o,i)=><label key={o}><input type="radio" name="inquiry" checked={value===i} onChange={()=>setValue(i)}/>{o}</label>)}</fieldset><div className="contact-compose"><p className="eyebrow">CONTACT CHANNELS</p><h2 aria-live="polite">{options[value]}</h2><div className="contact-actions"><a className="text-link contact-email" href={`mailto:stylemahn@naver.com?subject=${encodeURIComponent('IPIB — '+options[value])}`}><EnvelopeSimple size={21} aria-hidden="true"/>{t.email} <span aria-hidden="true"><ArrowUpRight size={18} aria-hidden="true"/></span></a><a className="text-link contact-place" href={source.naverPlace} target="_blank" rel="noopener noreferrer"><ResponsiveImage src="/assets/social/naver.svg" className="contact-naver-mark" alt=""/>{{kr:"스타일만 바로가기",en:"Visit STYLEMAHN",cn:"前往STYLEMAHN",jp:"STYLEMAHNを見る"}[locale]}<ArrowUpRight size={18} aria-hidden="true"/></a><a className="text-link contact-kakao" href={source.kakao} target="_blank" rel="noopener noreferrer"><ChatCircle size={21} weight="fill" aria-hidden="true"/>{{kr:"카카오톡 채널 문의",en:"KakaoTalk inquiry",cn:"KakaoTalk咨询",jp:"KakaoTalkで相談"}[locale]}<ArrowUpRight size={18} aria-hidden="true"/></a></div><p>{t.mailNote}</p></div></div>}
export function NewsList({locale,entries}:{locale:Locale;entries:NewsEdit[]}){const t=extra[locale];const [category,setCategory]=useState(-1);const filtered=entries.filter(a=>category===-1||a.category===category);return <><div className="filters" role="group" aria-label="News categories">{[t.all,...t.categories].map((c,i)=><button aria-pressed={category===i-1} key={c} onClick={()=>setCategory(i-1)}>{c}</button>)}</div>{filtered.length?filtered.map(entry=><Link className={`news-feature ${entry.image?'':'news-feature-text'}`} key={entry.slug} href={`/${locale}/news/${entry.slug}`}>{entry.image&&<ResponsiveImage src={entry.image} loading="lazy" className="news-list-image" alt={entry.title[locale]}/>}<div><span className="eyebrow">{t.categories[entry.category]}</span><h2><BrandText text={entry.title[locale]}/></h2><p><BrandText text={entry.description[locale]}/></p><span className="text-link">{t.discover}<ArrowUpRight size={18} aria-hidden="true"/></span></div></Link>):<p className="empty-state" role="status">{t.empty}</p>}</>}


