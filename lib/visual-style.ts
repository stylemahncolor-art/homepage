export const fonts={default:'',sans:"Arial, 'Malgun Gothic', sans-serif",gowun:"'IPIB Gowun', sans-serif",serif:"Georgia, 'Batang', serif",hand:"'IPIB Hand', cursive"};
const length=/^-?(?:\d{1,4}(?:\.\d{1,2})?)(?:px|%|rem)$/;
const positive=/^(?:\d{1,4}(?:\.\d{1,2})?)(?:px|%|rem)$/;
const rules:Record<string,(value:string)=>boolean>={
 fontSize:v=>positive.test(v),color:v=>/^#[a-f0-9]{6}$/i.test(v),backgroundColor:v=>/^#[a-f0-9]{6}$/i.test(v),
 lineHeight:v=>/^(?:[0-4](?:\.\d{1,2})?)$/.test(v),letterSpacing:v=>length.test(v),fontWeight:v=>/^[1-9]00$/.test(v),fontStyle:v=>['normal','italic'].includes(v),textDecoration:v=>['none','underline','line-through'].includes(v),fontFamily:v=>Object.values(fonts).includes(v)&&v!=='',textAlign:v=>['left','center','right','justify'].includes(v),whiteSpace:v=>['normal','pre-wrap','pre-line'].includes(v),
 width:v=>v==='auto'||positive.test(v),height:v=>v==='auto'||positive.test(v),maxWidth:v=>v==='none'||positive.test(v),
 marginTop:v=>length.test(v),marginBottom:v=>length.test(v),marginLeft:v=>v==='auto'||length.test(v),marginRight:v=>v==='auto'||length.test(v),
 paddingTop:v=>positive.test(v),paddingBottom:v=>positive.test(v),paddingLeft:v=>positive.test(v),paddingRight:v=>positive.test(v),gap:v=>positive.test(v),borderRadius:v=>positive.test(v),
 display:v=>['block','flex','grid','none'].includes(v),flexDirection:v=>['row','column','row-reverse','column-reverse'].includes(v),flexWrap:v=>['wrap','nowrap'].includes(v),alignItems:v=>['stretch','flex-start','center','flex-end'].includes(v),justifyContent:v=>['flex-start','center','flex-end','space-between','space-around'].includes(v),
 gridTemplateColumns:v=>/^repeat\([1-4], minmax\(0, 1fr\)\)$/.test(v),order:v=>/^-?\d{1,3}$/.test(v),translate:v=>/^-?\d{1,4}px -?\d{1,4}px$/.test(v),
 overflow:v=>['hidden','visible'].includes(v),clipPath:v=>/^inset\((?:[0-9]|[1-4][0-9]|50)% (?:[0-9]|[1-4][0-9]|50)% (?:[0-9]|[1-4][0-9]|50)% (?:[0-9]|[1-4][0-9]|50)%\)$/.test(v)
};
export type VisualStyle=Record<string,string>;
export function validVisualStyle(style:unknown):style is VisualStyle{return style===undefined||Boolean(style&&typeof style==='object'&&!Array.isArray(style)&&Object.entries(style).length<=40&&Object.entries(style).every(([key,value])=>typeof value==='string'&&Object.hasOwn(rules,key)&&rules[key](value)));}
export const cssProperty=(name:string)=>name.replace(/[A-Z]/g,c=>'-'+c.toLowerCase());
