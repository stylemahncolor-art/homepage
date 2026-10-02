import Image from './ResponsiveImage';
import {levels,educationSystem} from '@/content/education-system';
import type {Locale} from '@/content/site';
export function EducationSystem({locale,compact=false}:{locale:Locale;compact?:boolean}){
 const t=educationSystem[locale];
 const medalBounds=[[35,42,355,350],[41,40,348,343],[36,32,366,365],[41,16,367,368],[24,22,385,381]];
 return <section className={`wrap level-system${compact?' level-system-compact':''}`} aria-labelledby="level-system-title">
 <div className="section-heading"><p className="eyebrow">IPIB EDUCATION & CERTIFICATION</p><h2 id="level-system-title">{t.title}</h2><p className="lead">{t.intro}</p></div>
 <ol className="level-list">{levels.map((l,i)=><li key={l.level}>
 <span className="medal-frame"><span className="medal-art"><Image src={`/assets/ipib-level-${l.level}.png`} alt={`IPIB Level ${l.level} — ${l.english}`} width={426} height={426} style={{width:`${426/medalBounds[i][2]*100}%`,height:`${426/medalBounds[i][3]*100}%`,left:`${-medalBounds[i][0]/medalBounds[i][2]*100}%`,top:`${-medalBounds[i][1]/medalBounds[i][3]*100}%`}}/></span></span>
 <div className="level-copy"><p className="eyebrow">LEVEL {l.level} <span className="level-code">IPIB {l.code}</span></p><h3>{t.names[i]}</h3><p className="level-english" lang="en">{l.english}</p>{!compact&&<p>{t.descriptions[i]}</p>}{!compact&&i===2&&<p className="level-prerequisite">{t.prerequisite}</p>}</div>
 {!compact&&<p className="level-audience">{i<3?t.both:t.company}</p>}
 </li>)}</ol>
 {!compact&&<div className="level-membership"><h3>{t.membership}</h3><dl><div><dt>{t.personal}</dt><dd>{t.range1}</dd></div><div><dt>{t.corporate}</dt><dd>{t.range2}</dd></div></dl><p>{t.conditions}</p><p>{t.note}</p></div>}
 
 </section>;
}
