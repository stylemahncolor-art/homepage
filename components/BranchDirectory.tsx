'use client';
import {SeoulInstructors} from './SeoulInstructors';
import {useState} from 'react';
import {MapPin,UserCircle,ArrowRight} from '@phosphor-icons/react';
import {Tabs,TabsList,TabsTrigger,TabsContent} from './ui/tabs';
import type {Locale} from '@/content/site';
const copy={
 kr:{title:'국가별 지부',intro:'국가별 IPIB 지부를 확인해 보세요.',countries:['한국','홍콩','중국','베트남'],cities:[['서울 지부','경기 지부','부산 지부'],['홍콩 지부'],['심천 지부','베이징 지부','상해 지부'],['베트남 지부']],draft:'지부 정보 준비 중',teachers:'전문가 소개',pending:'전문가 소개 준비 중',note:'지부 정보와 전문가 소개는 확인 후 순차적으로 안내합니다.',select:'지부 선택'},
 en:{title:'Our branches',intro:'Explore IPIB branches by country and region.',countries:['Korea','Hong Kong','China','Vietnam'],cities:[['Seoul branch','Gyeonggi branch','Busan branch'],['Hong Kong branch'],['Shenzhen branch','Beijing branch','Shanghai branch'],['Vietnam branch']],draft:'Branch details coming soon',teachers:'Our experts',pending:'Expert profiles coming soon',note:'Confirmed branch names and expert profiles will be added here.',select:'Select a branch'},
 cn:{title:'各地分部',intro:'了解各国家和地区的 IPIB 分部。',countries:['韩国','香港','中国','越南'],cities:[['首尔分部','京畿分部','釜山分部'],['香港分部'],['深圳分部','北京分部','上海分部'],['越南分部']],draft:'分部信息待更新',teachers:'专家介绍',pending:'专家介绍即将更新',note:'分部名称及专家信息将在确认后陆续公布。',select:'选择分部'},
 jp:{title:'国・地域別の支部',intro:'国・地域別のIPIB支部をご覧ください。',countries:['韓国','香港','中国','ベトナム'],cities:[['ソウル支部','京畿支部','釜山支部'],['香港支部'],['深圳支部','北京支部','上海支部'],['ベトナム支部']],draft:'支部情報を準備中',teachers:'専門家紹介',pending:'専門家紹介を準備中',note:'支部名と専門家は、確認後に順次掲載します。',select:'支部を選択'}
};
export function BranchDirectory({locale}:{locale:Locale}){
 const t=copy[locale];const [country,setCountry]=useState('0');const [branch,setBranch]=useState(0);
 return <section className="wrap branch-directory" aria-labelledby="branches-title"><div className="section-heading"><p className="eyebrow">IPIB BRANCHES</p><h2 id="branches-title">{t.title}</h2><p>{t.intro}</p></div>
 <Tabs value={country} onValueChange={value=>{setCountry(value);setBranch(0)}} className="branch-tabs"><TabsList className="country-tabs" aria-label={t.title}>{t.countries.map((name,i)=><TabsTrigger value={String(i)} key={name}>{name}</TabsTrigger>)}</TabsList>
 {t.countries.map((name,i)=><TabsContent value={String(i)} key={name}><div className="branch-layout"><div className="branch-choices" aria-label={t.select}>{t.cities[i].map((city,j)=><button type="button" key={city} aria-pressed={branch===j} aria-controls={`branch-detail-${i}`} onClick={()=>setBranch(j)}><MapPin size={22} aria-hidden="true"/><span><strong>{city}</strong><small>{i===0&&j===0?t.teachers:t.draft}</small></span><ArrowRight size={19} aria-hidden="true"/></button>)}</div><div className="branch-detail" id={`branch-detail-${i}`} aria-live="polite"><p className="eyebrow">{name}</p><h3>{t.cities[i][branch]??t.cities[i][0]}</h3><h4>{t.teachers}</h4>{i===0&&branch===0?<SeoulInstructors locale={locale}/>:<div className="branch-empty"><UserCircle size={44} weight="light" aria-hidden="true"/><p>{t.pending}</p></div>}</div></div></TabsContent>)}
 </Tabs><p className="branch-note">{t.note}</p></section>;
}
