'use client';
import {useRef,useState} from 'react';
import type {VisualEdit} from '@/lib/visual-content';
import {rebaseTextWeights,setTextWeight} from '@/lib/text-weight';
export default function InlineTextEditor({edit,onChange}:{edit:VisualEdit;onChange:(changes:Partial<VisualEdit>)=>void}){
 const input=useRef<HTMLTextAreaElement>(null),[range,setRange]=useState({start:0,end:0});
 const capture=()=>{const el=input.current;if(el)setRange({start:el.selectionStart,end:el.selectionEnd});};
 const apply=(weight:400|700|undefined)=>{if(range.start===range.end)return;onChange({weights:setTextWeight(edit.value.length,edit.weights||[],range.start,range.end,weight)});requestAnimationFrame(()=>{input.current?.focus();input.current?.setSelectionRange(range.start,range.end);});};
 return <div className="inline-text-editor"><label>표시할 문구<textarea ref={input} rows={8} maxLength={10000} value={edit.value} onSelect={capture} onChange={e=>{onChange({value:e.target.value,weights:rebaseTextWeights(edit.value,e.target.value,edit.weights||[])});capture();}}/></label>
  <h3>선택한 문장·글자 굵기</h3><p className="admin-note">위 입력창에서 원하는 문장이나 단어를 드래그한 뒤 아래 버튼을 누르세요.</p>
  <div className="visual-field-grid"><button type="button" disabled={range.start===range.end} onMouseDown={e=>e.preventDefault()} onClick={()=>apply(700)}>선택 부분 볼드</button><button type="button" disabled={range.start===range.end} onMouseDown={e=>e.preventDefault()} onClick={()=>apply(400)}>선택 부분 보통</button><button type="button" disabled={range.start===range.end} onMouseDown={e=>e.preventDefault()} onClick={()=>apply(undefined)}>선택 부분 굵기 초기화</button></div>
  <p className="admin-note" role="status">{range.start<range.end?`선택: ${edit.value.slice(range.start,range.end)}`:'선택한 글자가 없습니다.'}</p>
 </div>;
}
