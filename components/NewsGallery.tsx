'use client';
import {useState} from 'react';
import type {Locale} from '@/content/site';
export function NewsGallery({images,title,locale}:{images:string[];title:string;locale:Locale}){
 const [index,setIndex]=useState(0);const labels={kr:['사진 갤러리','이전 사진','다음 사진'],en:['Photo gallery','Previous photo','Next photo'],cn:['照片集','上一张','下一张'],jp:['フォトギャラリー','前の写真','次の写真']}[locale];
 if(!images.length)return null;
 return <section className="news-gallery" aria-label={labels[0]}><h2>{labels[0]}</h2><a className="news-gallery-stage" href={images[index]} target="_blank" rel="noopener noreferrer" aria-label={({kr:"원본 사진 보기",en:"View original photo",cn:"查看原图",jp:"元の写真を見る"}[locale])}><img src={images[index]} alt={`${title} — ${index+1}`}/></a>{images.length>1&&<><div className="news-gallery-controls"><button type="button" disabled={index===0} onClick={()=>setIndex(i=>i-1)}>{labels[1]}</button><span aria-live="polite">{index+1} / {images.length}</span><button type="button" disabled={index===images.length-1} onClick={()=>setIndex(i=>i+1)}>{labels[2]}</button></div><div className="news-gallery-thumbs">{images.map((url,i)=><button type="button" key={url} aria-label={`${labels[0]} ${i+1}`} aria-pressed={i===index} onClick={()=>setIndex(i)}><img src={url} loading="lazy" alt=""/></button>)}</div></>}</section>;
}
