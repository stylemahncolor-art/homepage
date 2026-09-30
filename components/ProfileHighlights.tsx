import {Buildings,Briefcase,ChalkboardTeacher} from '@phosphor-icons/react/dist/ssr';
import type {Locale} from '@/content/site';
const copy={
 kr:{roles:[['IPIB','협회장'],['STYLEMAHN','대표'],['건국대학교','외래교수']],years:'여 년',experience:'이미지 컨설팅 경력',expert:'퍼스널 이미지 컨설팅 전문가'},
 en:{roles:[['IPIB','President'],['STYLEMAHN','CEO'],['Konkuk University','Adjunct lecturer']],years:'years approx.',experience:'Image consulting experience',expert:'Personal image consulting expert'},
 cn:{roles:[['IPIB','协会会长'],['STYLEMAHN','代表'],['建国大学','外聘讲师']],years:'年左右',experience:'形象咨询经验',expert:'个人形象咨询专家'},
 jp:{roles:[['IPIB','会長'],['STYLEMAHN','代表'],['建国大学','非常勤講師']],years:'年ほど',experience:'イメージコンサルティングの経験',expert:'パーソナルイメージコンサルティング専門家'}
};
const icons=[Buildings,Briefcase,ChalkboardTeacher];
export function ProfileHighlights({locale,name}:{locale:Locale,name:string}){const t=copy[locale];return <div className="profile-signature"><h2>{name}<span className="profile-name-dot" aria-hidden="true"/></h2><p className="profile-specialty">{t.expert}</p><p className="profile-experience-note"><span lang="en">30 years</span><span aria-hidden="true"> · </span>{t.experience}</p><div className="profile-highlights"><dl className="profile-roles">{t.roles.map(([organization,role],i)=>{const Icon=icons[i];return <div key={organization}><Icon size={28} weight="light" aria-hidden="true"/><dt>{organization}</dt><dd>{role}</dd></div>})}</dl></div></div>}
