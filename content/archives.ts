import type {Locale} from './site';
// Add only records supported by official IPIB sources. MOU records are archives,
// not claims about current operating branches or active partner status.
export type ArchiveRecord={slug:string;category:number;partner?:string;location?:string;image?:string;document?:string;source?:string;title:Record<Locale,string>;description:Record<Locale,string>};
export const archives:ArchiveRecord[]=[{
 slug:'han-beauty-mou',category:3,partner:'HAN Beauty',location:'Hong Kong',
 image:'/assets/ipib-hanbeauty-exchange.jpg',document:'/assets/ipib-hanbeauty-mou.jpg',source:'https://www.ipib.kr/IPIBxMOU',
 title:{kr:'IPIB × HAN Beauty 홍콩 MOU',en:'IPIB × HAN Beauty Hong Kong MOU',cn:'IPIB × 香港 HAN Beauty 合作备忘录',jp:'IPIB × 香港 HAN Beauty MOU'},
 description:{kr:'기존 공식 홈페이지에 공개된 HAN Beauty 홍콩과의 MOU 및 교류 기록입니다.',en:'A record of the MOU and exchange with HAN Beauty Hong Kong, published on the existing official website.',cn:'现有官方网站公开的与香港 HAN Beauty 签署合作备忘录及交流活动记录。',jp:'既存の公式サイトで公開された、香港 HAN BeautyとのMOUと交流の記録です。'}
}];
