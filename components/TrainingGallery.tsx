import {Photo} from './Site';
import {training} from '@/content/training';
import type {Locale} from '@/content/site';
const gallery=[3,4,5,6,7,8,9,11,12,13,15,16].map((photo,index)=>({photo,index}));
const globalPhotoIndexes=new Set([6,7,9]);
export function TrainingGallery({locale}:{locale:Locale}){const t=training[locale];return <section className="wrap training-gallery"><div className="section-heading"><p className="eyebrow">IPIB IN PRACTICE</p><h2>{t.title}</h2><p className="lead">{t.text}</p></div><div className="training-photo-grid">{gallery.filter(({index})=>!globalPhotoIndexes.has(index)).map(({photo,index})=><figure key={photo}><a className="photo-original" href={`/assets/ipib-training-${String(photo).padStart(2,'0')}.jpg`} target="_blank" rel="noopener noreferrer" aria-label={t.photos[index]+" — "+({kr:"원본 사진 보기",en:"View original photo",cn:"查看原图",jp:"元の写真を見る"}[locale])}><Photo name={`ipib-training-${String(photo).padStart(2,'0')}.jpg`} alt={t.photos[index]}/></a><figcaption>{t.photos[index]}</figcaption></figure>)}</div></section>}
export function TeachingProfile({locale}:{locale:Locale}){const t=training[locale];return <section className="wrap teaching-profile"><div className="section-heading"><p className="eyebrow">PROFESSIONAL LEADERSHIP</p><h2>{t.leadership}</h2><p className="lead">{t.authority}</p></div><Photo name="ipib-training-14.jpg" alt={t.lecture}/></section>}

export function GlobalEducationGallery({locale}:{locale:Locale}){
 const t=training[locale];
 const title={kr:'해외 교육 현장',en:'Education across borders',cn:'海外教学现场',jp:'海外教育の現場'}[locale];
 return <section className="wrap training-gallery"><div className="section-heading"><p className="eyebrow">GLOBAL EDUCATION</p><h2>{title}</h2></div><div className="training-photo-grid">{gallery.filter(({index})=>globalPhotoIndexes.has(index)).map(({photo,index})=><figure key={photo}><a className="photo-original" href={`/assets/ipib-training-${String(photo).padStart(2,'0')}.jpg`} target="_blank" rel="noopener noreferrer" aria-label={t.photos[index]+" — "+({kr:"원본 사진 보기",en:"View original photo",cn:"查看原图",jp:"元の写真を見る"}[locale])}><Photo name={`ipib-training-${String(photo).padStart(2,'0')}.jpg`} alt={t.photos[index]}/></a><figcaption>{t.photos[index]}</figcaption></figure>)}</div></section>;
}
