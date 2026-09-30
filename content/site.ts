export const locales = ['kr', 'en', 'cn', 'jp'] as const;
export type Locale = typeof locales[number];
export const languageTags = { kr: 'ko', en: 'en', cn: 'zh-Hans', jp: 'ja' };
export const fields = ['Personal Color', 'Fashion & Body Fit', 'Makeup & Hair', 'Beauty Image', 'Total Image Branding'];
export const source = {
  home:'https://www.ipib.kr/', about:'https://www.ipib.kr/%ED%98%91',
  certificate:'https://www.ipib.kr/ipibcertificate', international:'https://www.ipib.kr/25',
  mou:'https://www.ipib.kr/IPIBxMOU', blog:'https://blog.naver.com/stylemahn',
  instagram:'https://www.instagram.com/stylemahn_/', kakao:'https://pf.kakao.com/_xcMxbqn',
  email:'stylemahn@naver.com',
  naverPlace:'https://map.naver.com/p/entry/place/1035001643',
};
// Replace only with approved IPIB photographs. Null is an explicit placeholder.
export const media: Record<'hero'|'education'|'leadership', string | null> = { hero: null, education: null, leadership: null };
