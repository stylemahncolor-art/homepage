import ResponsiveImage from './ResponsiveImage';
import type {Locale} from '@/content/site';

const profiles = [
  {
    id: 'biance-chan', name: 'Biance Chan', image: '/assets/biance-chan-cutout.png',
    kr: ['퍼스널컬러 애널리스트 Level 2', '바디핏 컨설턴트 Level 1', 'KFBP 인증 퍼스널컬러 강사', 'HAN Beauty 중국·홍콩 설립자 및 대표'],
    en: ['Personal Color Analyst Level 2', 'Bodyfit Consultant Level 1', 'Certificated Personal Color Lecturer of KFBP', 'Founder & CEO of HAN Beauty China & Hong Kong'],
    cn: ['个人色彩分析师 Level 2', '体型顾问 Level 1', 'KFBP 认证个人色彩讲师', 'HAN Beauty 中国及香港创始人兼首席执行官'],
    jp: ['パーソナルカラーアナリスト Level 2', 'ボディフィットコンサルタント Level 1', 'KFBP 認定パーソナルカラー講師', 'HAN Beauty 中国・香港の創設者・代表'],
  },
  {
    id: 'sonia-wong', name: 'Sonia Wong', image: '/assets/sonia-wong-cutout.png',
    kr: ['퍼스널컬러 애널리스트 Level 2', '바디핏 컨설턴트 Level 1', '홍콩 액티브웨어 브랜드 Sesamism 설립자', '패션 업계 경력 7년 이상'],
    en: ['Personal Color Analyst Level 2', 'Bodyfit Consultant Level 1', 'Founder of Sesamism Activewear  (HK)', 'Fashion Industry Professional with 7+ years of experience'],
    cn: ['个人色彩分析师 Level 2', '体型顾问 Level 1', '香港运动服饰品牌 Sesamism 创始人', '时尚行业经验超过7年'],
    jp: ['パーソナルカラーアナリスト Level 2', 'ボディフィットコンサルタント Level 1', '香港のアクティブウェアブランド Sesamism の創設者', 'ファッション業界で7年以上の経験'],
  },
];

export function HongKongInstructors({locale}: {locale: Locale}) {
  return <div className="branch-instructors">{profiles.map(profile =>
    <article className="branch-instructor" key={profile.id}>
      <div className={`instructor-photo instructor-photo-${profile.id}`}><ResponsiveImage sizes="(max-width:600px) 130px, 190px" src={profile.image} alt={profile.name} width={136} height={184} loading="lazy" /></div>
      <div className="instructor-content">
        <header className="instructor-heading"><h5>{profile.name}</h5><p className="instructor-position">{profile.id==='biance-chan'
          ? ({kr:'HAN Beauty 중국·홍콩 대표',en:'Founder & CEO of HAN Beauty China & Hong Kong',cn:'HAN Beauty 中国及香港创始人兼首席执行官',jp:'HAN Beauty 中国・香港の創設者・代表'})[locale]
          : ({kr:'Sesamism 설립자 · 패션 전문가',en:'Founder of Sesamism · Fashion professional',cn:'Sesamism 创始人 · 时尚专业人士',jp:'Sesamism 創設者・ファッション専門家'})[locale]}</p></header>
        <ul className="instructor-career">{profile[locale].map(line => <li key={line}>{line}</li>)}</ul>
      </div>
    </article>
  )}</div>;
}
