'use client';
import type {VisualEdit} from '@/lib/visual-content';
import {fonts,type VisualStyle} from '@/lib/visual-style';
export default function StyleControls({edit,mobile,onChange}:{edit:VisualEdit;mobile:boolean;onChange:(style:VisualStyle)=>void}){
 const style=(mobile?edit.mobileStyle:edit.style)||{};
 const set=(key:string,value:string)=>{const next={...style};if(value==='')delete next[key];else next[key]=value;onChange(next);};
 const numeric=(label:string,key:string,unit='px',min=-1000,max=2000)=><label key={key}>{label}<input type="number" min={min} max={max} step={key==='lineHeight'?0.05:1} placeholder="기본값 유지" value={style[key]?.replace(unit,'')??''} onChange={e=>set(key,e.target.value===''?'':`${e.target.value}${unit}`)}/></label>;
 const select=(label:string,key:string,options:[string,string][])=><label key={key}>{label}<select value={style[key]||''} onChange={e=>set(key,e.target.value)}><option value="">기본값 유지</option>{options.map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label>;
 const translate=(style.translate||'0px 0px').split(' ').map(v=>parseInt(v));
 const offset=(axis:number,value:string)=>{const next=[...translate];next[axis]=Number(value)||0;set('translate',`${next[0]}px ${next[1]}px`);};
 const crop=(style.clipPath?.match(/\d+/g)||['0','0','0','0']).map(Number);
 return <div className="style-controls">
  <p className="admin-note">{mobile?'모바일 전용 설정: 600px 이하 화면에 적용됩니다.':'기본 설정: 모든 화면에 적용됩니다.'} 빈 항목은 기존 디자인을 유지합니다.</p>
  {edit.kind==='text'&&<><h3>글자 서식</h3><div className="visual-field-grid">{numeric('크기 (px)','fontSize','px',8,240)}{numeric('줄간격 (배수)','lineHeight','',0.5,4)}{numeric('자간 (px)','letterSpacing','px',-10,30)}<label>글자 색<input type="color" value={style.color||'#172a42'} onChange={e=>set('color',e.target.value)}/><button type="button" onClick={()=>set('color','')}>기본 색</button></label></div>
  {select('폰트','fontFamily',[[fonts.sans,'기본 고딕'],[fonts.gowun,'고운돋움'],[fonts.serif,'바탕·세리프'],[fonts.hand,'영문 손글씨']])}
  {select('굵기','fontWeight',[['300','얇게'],['400','보통'],['500','중간'],['600','조금 굵게'],['700','볼드'],['900','매우 굵게']])}
  {select('기울임','fontStyle',[['normal','보통'],['italic','기울임']])}{select('글자 효과','textDecoration',[['none','없음'],['underline','밑줄'],['line-through','취소선']])}
  {select('정렬','textAlign',[['left','왼쪽'],['center','가운데'],['right','오른쪽'],['justify','양쪽']])}
  <p className="admin-note">위 문구 입력창에서 Enter를 누르면 화면에서도 줄바꿈됩니다. 서식은 선택한 문구가 들어 있는 항목에 적용됩니다.</p></>}
  <h3>{edit.kind==='layout'?'영역 레이아웃':'크기·위치'}</h3><div className="visual-field-grid">{numeric('너비 (%)','width','%',1,200)}{numeric('높이 (px)','height','px',1,2000)}<label>좌우 이동 (px)<input type="number" min={-2000} max={2000} value={translate[0]} onChange={e=>offset(0,e.target.value)}/></label><label>상하 이동 (px)<input type="number" min={-2000} max={2000} value={translate[1]} onChange={e=>offset(1,e.target.value)}/></label>{numeric('모서리 (px)','borderRadius','px',0,500)}</div>
  {edit.kind==='image'&&<><h3>사진 자르기</h3><p className="admin-note">원본을 보존하며 선택한 가장자리를 가립니다.</p><div className="visual-field-grid">{['위','오른쪽','아래','왼쪽'].map((label,index)=><label key={label}>{label} {crop[index]}%<input type="range" min="0" max="50" value={crop[index]} onChange={e=>{const next=[...crop];next[index]=Number(e.target.value);set('clipPath',`inset(${next.map(v=>`${v}%`).join(' ')})`);}}/></label>)}</div></>}
  {edit.kind==='layout'&&<>{select('배치 방식','display',[['block','세로 기본'],['flex','가로·세로 배치'],['grid','격자 배치'],['none','이 영역 숨기기']])}
  {select('배치 방향','flexDirection',[['row','가로'],['column','세로'],['row-reverse','가로 역순'],['column-reverse','세로 역순']])}
  {select('격자 열 수','gridTemplateColumns',[1,2,3,4].map(n=>[`repeat(${n}, minmax(0, 1fr))`,`${n}열`] as [string,string]))}
  {select('넘치는 항목','flexWrap',[['wrap','다음 줄로'],['nowrap','한 줄 유지']])}
  {select('세로 정렬','alignItems',[['stretch','프레임 채우기'],['flex-start','위'],['center','가운데'],['flex-end','아래']])}
  {select('가로 정렬','justifyContent',[['flex-start','왼쪽'],['center','가운데'],['flex-end','오른쪽'],['space-between','균등 간격']])}
  <div className="visual-field-grid">{numeric('항목 간격 (px)','gap','px',0,300)}{numeric('배치 순서','order','',-99,99)}</div>
  <p className="admin-note">격자 열 수는 ‘격자 배치’를 선택한 영역에 적용됩니다. 순서는 상위 영역이 가로·세로 또는 격자 배치일 때 적용됩니다.</p></>}
  <h3>여백·배경</h3><div className="visual-field-grid">{numeric('바깥 위','marginTop')}{numeric('바깥 아래','marginBottom')}{numeric('바깥 왼쪽','marginLeft')}{numeric('바깥 오른쪽','marginRight')}{numeric('안쪽 위','paddingTop','px',0,500)}{numeric('안쪽 아래','paddingBottom','px',0,500)}{numeric('안쪽 왼쪽','paddingLeft','px',0,500)}{numeric('안쪽 오른쪽','paddingRight','px',0,500)}<label>배경 색<input type="color" value={style.backgroundColor||'#ffffff'} onChange={e=>set('backgroundColor',e.target.value)}/><button type="button" onClick={()=>set('backgroundColor','')}>기본 배경</button></label></div>
  <button type="button" onClick={()=>onChange({})}>{mobile?'모바일 서식':'이 항목의 서식'} 초기화</button>
 </div>;
}
