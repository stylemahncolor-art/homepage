'use client';
import ResponsiveImage from './ResponsiveImage';
import {BrandText} from './BrandText';
import {useRef,useState} from 'react';
import {ArrowLeft,ArrowRight} from '@phosphor-icons/react';
import type {NewsEdit} from '@/lib/cms';
import type {Locale} from '@/content/site';
export function HomeNewsCarousel({news,locale}:{news:NewsEdit[];locale:Locale}){
 const track=useRef<HTMLDivElement>(null);const [edges,setEdges]=useState({start:true,end:false});
 const labels={kr:['이전 소식','다음 소식','협회 소식'],en:['Previous news','Next news','IPIB news'],cn:['上一条新闻','下一条新闻','协会动态'],jp:['前のニュース','次のニュース','協会ニュース']}[locale];
 function move(direction:number){const el=track.current;if(!el)return;const card=el.firstElementChild as HTMLElement|null;el.scrollBy({left:direction*((card?.offsetWidth||300)+20),behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});}
 return <div className="home-news-carousel"><div className="home-news-track" ref={track} onScroll={()=>{const el=track.current;if(el)setEdges({start:el.scrollLeft<2,end:el.scrollLeft+el.clientWidth>=el.scrollWidth-2});}} aria-label={labels[2]}>{news.map(item=><a className="home-news-card" key={item.slug} href={`/${locale}/news/${item.slug}`}>{item.image&&<ResponsiveImage sizes="(max-width:600px) 85vw, 400px" src={item.image} alt={item.title[locale]||item.title.kr} loading="lazy"/>}<p className="eyebrow">IPIB NEWS</p><h3><BrandText text={item.title[locale]||item.title.kr}/></h3><p className="home-news-description"><BrandText text={item.description[locale]||item.description.kr}/></p></a>)}</div>{news.length>1&&<div className="home-news-controls"><button type="button" onClick={()=>move(-1)} disabled={edges.start} aria-label={labels[0]}><ArrowLeft size={20}/></button><button type="button" onClick={()=>move(1)} disabled={edges.end} aria-label={labels[1]}><ArrowRight size={20}/></button></div>}</div>;
}
