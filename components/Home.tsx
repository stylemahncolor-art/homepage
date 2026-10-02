import ResponsiveImage from './ResponsiveImage';
import {BrandText} from './BrandText';
import {HomeNewsCarousel} from './HomeNewsCarousel';
import {SocialChannels} from './SocialChannels';
import {training} from '@/content/training';
import {EducationSystem} from './EducationSystem';
import {educationSystem} from '@/content/education-system';
import Link from './PageLink';
import {ArrowUpRight} from '@phosphor-icons/react/dist/ssr';
import {getDictionary} from '@/content';
import {extra,slugs} from '@/content/redesign';
import {fields,source,type Locale} from '@/content/site';
import {Photo,More,Partnership} from './Site';
import type {PageEdit,NewsEdit} from '@/lib/cms';

export function Home({locale,edit,news}:{locale:Locale;edit:PageEdit|null;news:NewsEdit[]}){
 const d=getDictionary(locale),t=extra[locale],v=training[locale];

 return <main id="main" className="home">
  <section className="editorial-hero wrap">
   {locale==='kr' ? <div className="approved-hero">
    <div className="approved-hero-art"><ResponsiveImage src="/assets/ipib-approved-hero-white.png" sizes="(max-width:1280px) 100vw, 1280px" width={1536} height={1024} alt="" fetchPriority="high"/></div>
    <div className="approved-hero-accessible"><h1>{t.hero}</h1><p><BrandText text={t.intro}/></p></div>
    <More locale={locale} to="about">{d.aboutLink}</More>
   </div> : <>
   <p className="hero-kicker">PERSONAL COLOR & IMAGE BRANDING</p>
   <div className="hero-heading"><div className="hero-title-block"><h1>{(edit?.title||t.hero).split('\n').map((line,i)=><span className="hero-title-line" key={i}>{line}</span>)}</h1></div><div className="hero-intro"><p className="lead"><BrandText text={edit?.description||t.intro}/></p><More locale={locale} to="about">{d.aboutLink}</More></div></div>
   </>}
   <div className="hero-spread">
    <figure className="hero-main-image">{edit?.image?<ResponsiveImage className="cms-hero-image" src={edit.image} alt={edit.title}/>:<Photo eager name="ipib-training-02.jpg" alt={v.lecture}/>}</figure>
    <div className="hero-sidebar"><figure><div className="photo"><ResponsiveImage src="/assets/ipib-home-training.png" width={1152} height={2048} alt={v.practice} sizes="(max-width:768px) 90vw, 400px" loading="lazy"/></div></figure></div>
   </div>

  </section>
  <section className="wrap institution-intro"><p className="eyebrow">ABOUT IPIB</p><div><h2>{d.aboutTitle.replace('\n',' ')}</h2><p className="lead">{educationSystem[locale].summary}</p><p>{d.aboutText}</p></div></section>
  <section className="learning-hub"><div className="wrap">
   <div className="learning-heading"><p className="eyebrow">EDUCATION</p><h2>{d.educationTitle.replace('\n',' ')}</h2></div>
   <div className="learning-layout"><div className="learning-fields"><p className="lead">{d.fieldsText}</p><div className="professional-field-grid">{fields.map((f,i)=><Link className={`professional-field-card field-scene-${i}`} href={`/${locale}/education/${slugs[i]}`} key={f}><span className="professional-field-photo" aria-hidden="true"><span className="field-scene-crop"><ResponsiveImage src="/assets/professional-fields-scenes.png" alt="" sizes="1200px"/></span></span><span className="professional-field-caption">{f}</span></Link>)}</div></div>
    <aside className="certification-summary"><p className="eyebrow">CERTIFICATION</p><h3>{d.certificationTitle.replace('\n',' ')}</h3><p>{d.certificationText}</p><More locale={locale} to="certification">{d.certificateCta}</More></aside>
   </div>
  </div></section>
  <EducationSystem locale={locale} compact/>
  <section className="wrap global-hub"><div className="global-heading"><p className="eyebrow">GLOBAL NETWORK</p><h2>{v.globalTitle}</h2></div><div className="global-summary"><p className="lead">{v.globalText}</p><Link className="mou-teaser" href={`/${locale}/news/han-beauty-mou`}><Photo name="ipib-hanbeauty-exchange.jpg" alt={t.mou}/><div><span className="eyebrow">MOU ARCHIVE / HONG KONG</span><h3><BrandText text={t.mou}/></h3><ArrowUpRight size={22} aria-hidden="true"/></div></Link></div></section>
  <section className="wrap journal-hub"><div className="section-heading horizontal"><div><p className="eyebrow">SELECTED ACTIVITIES & NEWS</p><h2>{d.newsTitle}</h2></div></div><div className="editorial-stories">
   <HomeNewsCarousel news={news} locale={locale}/>


  </div></section>
  <SocialChannels locale={locale}/>
 </main>;
}
