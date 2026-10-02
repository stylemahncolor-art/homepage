import type {Locale} from '@/content/site';

const profiles = [
  {
    id: 'biance-chan', name: 'Biance Chan', image: '/assets/biance-chan-cutout.png',
    kr: ['퍼스널컬러 애널리스트 Level 2', '바디핏 컨설턴트 Level 1', 'KFBP 인증 퍼스널컬러 강사', 'HAN Beauty 중국·홍콩 설립자 및 대표'],
    en: ['Personal Color Analyst Level 2', 'Bodyfit Consultant Level 1', 'Certificated Personal Color Lecturer of KFBP', 'Founder & CEO of HAN Beauty China & Hong Kong'],
  },
  {
    id: 'sonia-wong', name: 'Sonia Wong', image: '/assets/sonia-wong-cutout.png',
    kr: ['퍼스널컬러 애널리스트 Level 2', '바디핏 컨설턴트 Level 1', '홍콩 액티브웨어 브랜드 Sesamism 설립자', '패션 업계 경력 7년 이상'],
    en: ['Personal Color Analyst Level 2', 'Bodyfit Consultant Level 1', 'Founder of Sesamism Activewear  (HK)', 'Fashion Industry Professional with 7+ years of experience'],
  },
];

export function HongKongInstructors({locale}: {locale: Locale}) {
  return <div className="branch-instructors">{profiles.map(profile =>
    <article className="branch-instructor" key={profile.id}>
      <div className={`instructor-photo instructor-photo-${profile.id}`}><img src={profile.image} alt={profile.name} width={136} height={184} loading="lazy" /></div>
      <div className="instructor-content">
        <header className="instructor-heading"><h5>{profile.name}</h5></header>
        <ul className="instructor-career">{profile[locale === 'kr' ? 'kr' : 'en'].map(line => <li key={line}>{line}</li>)}</ul>
      </div>
    </article>
  )}</div>;
}
