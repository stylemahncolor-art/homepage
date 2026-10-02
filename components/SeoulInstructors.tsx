import ResponsiveImage from './ResponsiveImage';
import type {Locale} from '@/content/site';
const profiles=[
  {
    "id": "kang-minkyung",
    "name": {
      "kr": "강민경",
      "en": "Min Kang",
      "cn": "강민경 · Min Kang",
      "jp": "강민경 · Min Kang"
    },
    "role": {
      "kr": "스타일만 이미지 컨설턴트 · 한국어·영어",
      "en": "STYLEMAHN image consultant · Korean & English",
      "cn": "STYLEMAHN形象顾问 · 韩语、英语",
      "jp": "STYLEMAHNイメージコンサルタント・韓国語／英語"
    },
    "lines": {
      "kr": [
        "2026 미스코리아 퍼스널컬러 특강",
        "롯데홈쇼핑 퍼스널 이미지 브랜딩",
        "퍼스널컬러·패션 바디핏 자격 교육",
        "퍼스널컬러 바디핏·스타일 컨설턴트 1·2급",
        "국민대학교 금속공예학과 졸업"
      ],
      "en": [
        "2026 Miss Korea personal color lecture",
        "Personal image branding for Lotte Home Shopping",
        "Personal color & fashion body-fit certification training",
        "Personal color body-fit & style consultant, Levels 1 & 2",
        "Graduate, Metal Craft, Kookmin University"
      ],
      "cn": [
        "2026韩国小姐个人色彩特讲",
        "乐天购物个人形象品牌塑造",
        "个人色彩与时尚体型资格课程教学",
        "个人色彩体型及风格顾问1级、2级",
        "韩国国民大学金属工艺专业毕业"
      ],
      "jp": [
        "2026ミスコリアのパーソナルカラー特別講義",
        "ロッテホームショッピングのパーソナルイメージブランディング",
        "パーソナルカラー・ボディフィット資格教育",
        "パーソナルカラー・ボディフィット／スタイルコンサルタント1・2級",
        "国民大学校金属工芸学科卒業"
      ]
    }
  },
  {
    "id": "choi-eunjin",
    "name": {
      "kr": "최은진",
      "en": "Choi Eunjin",
      "cn": "최은진 · Choi Eunjin",
      "jp": "최은진 · Choi Eunjin"
    },
    "role": {
      "kr": "스타일만 이미지 컨설턴트 · 한국어·영어",
      "en": "STYLEMAHN image consultant · Korean & English",
      "cn": "STYLEMAHN形象顾问 · 韩语、英语",
      "jp": "STYLEMAHNイメージコンサルタント・韓国語／英語"
    },
    "lines": {
      "kr": [
        "삼성물산·KB손해보험·한화생명 임직원 컨설팅",
        "외국인 대상 퍼스널컬러 자격 교육",
        "헤어 살롱 대상 퍼스널 헤어컬러 교육",
        "전 컬러인사이트 일산 대표·마포 수석 컨설턴트",
        "KBP 퍼스널컬러 전문가·메이크업 국가기술자격"
      ],
      "en": [
        "Employee consultations for Samsung C&T, KB Insurance & Hanwha Life",
        "Personal color certification training for international students",
        "Personal hair-color training for hair salons",
        "Former head of Color Insight Ilsan & senior consultant at Mapo",
        "KBP personal color expert & national makeup qualification"
      ],
      "cn": [
        "三星物产、KB保险、韩华生命员工咨询",
        "面向外国学员的个人色彩资格课程教学",
        "面向美发沙龙的个人发色教学",
        "曾任Color Insight一山负责人、麻浦首席顾问",
        "KBP个人色彩专家资格、韩国化妆国家技术资格"
      ],
      "jp": [
        "サムスン物産・KB損害保険・ハンファ生命の社員向けコンサルティング",
        "外国人向けパーソナルカラー資格教育",
        "ヘアサロン向けパーソナルヘアカラー教育",
        "元Color Insight一山代表・麻浦チーフコンサルタント",
        "KBPパーソナルカラー専門家資格・韓国メイクアップ国家技術資格"
      ]
    }
  },
  {
    "id": "xu-xiaoxin",
    "name": {
      "kr": "Xu Xiaoxin",
      "en": "Xu Xiaoxin",
      "cn": "Xu Xiaoxin",
      "jp": "Xu Xiaoxin"
    },
    "role": {
      "kr": "퍼스널컬러 컨설턴트 · 중국어 통역",
      "en": "Personal color consultant · Chinese interpreter",
      "cn": "个人色彩顾问 · 中文口译",
      "jp": "パーソナルカラーコンサルタント・中国語通訳"
    },
    "lines": {
      "kr": [
        "서경대학교 피부미용학과 졸업·석사과정 재학",
        "퍼스널컬러 바디핏·스타일 컨설턴트 1·2급",
        "CIDESCO 국제 피부미용 자격",
        "중국 메이크업 아티스트·샤오홍슈 메이크업 콘텐츠 활동",
        "색채·메이크업·스킨케어·스타일링 교육 및 실무 10년 이상"
      ],
      "en": [
        "Beauty Arts graduate & master’s student, Seokyeong University",
        "Personal color body-fit & style consultant, Levels 1 & 2",
        "CIDESCO international beauty therapy qualification",
        "Makeup artist in China & Xiaohongshu makeup content creator",
        "Over 10 years in color, makeup, skincare & styling education and practice"
      ],
      "cn": [
        "西京大学皮肤美容学本科毕业、硕士在读",
        "个人色彩体型及风格顾问1级、2级",
        "CIDESCO国际美容资格",
        "中国化妆师、小红书化妆内容创作",
        "色彩、化妆、护肤及造型教育与实务经验10年以上"
      ],
      "jp": [
        "西京大学皮膚美容学科卒業・修士課程在学",
        "パーソナルカラー・ボディフィット／スタイルコンサルタント1・2級",
        "CIDESCO国際美容資格",
        "中国でのメイクアップアーティスト活動・小紅書のメイクコンテンツ制作",
        "色彩・メイク・スキンケア・スタイリングの教育と実務10年以上"
      ]
    }
  }
];
export function SeoulInstructors({locale}:{locale:Locale}){return <div className="branch-instructors">{profiles.map(p=><article className="branch-instructor" key={p.id}><div className={`instructor-photo instructor-photo-${p.id}`}><ResponsiveImage sizes="(max-width:600px) 130px, 190px" src={`/assets/${p.id}${p.id==='xu-xiaoxin'?'-cutout':''}.png`} alt={p.name[locale]} width={160} height={210}/></div><div className="instructor-content"><header className="instructor-heading"><h5>{p.name[locale]}</h5><p className="instructor-position">{p.role[locale]}</p></header><ul className="instructor-career">{p.lines[locale].map(line=><li key={line}>{line}</li>)}</ul></div></article>)}</div>}
