'use client';
import StyleControls from './StyleControls';
import {resolveVisualLanguage} from '@/lib/resolve-visual-language';
import InlineTextEditor from './InlineTextEditor';
import {prepareImage} from '@/lib/prepare-image';
import {useCallback,useEffect,useRef,useState} from 'react';
import {locales,type Locale} from '@/content/site';
import {emptyDocument,type VisualDocument,type VisualEdit} from '@/lib/visual-content';
import type {NewsEdit} from '@/lib/cms';

const basePages=[['home','메인'],['about','협회 소개'],['education','교육 안내'],['education/personal-color','교육 · 퍼스널컬러'],['education/fashion-body-fit','교육 · 패션 바디핏'],['education/makeup-hair','교육 · 메이크업·헤어'],['education/beauty-image','교육 · 뷰티 이미지'],['education/total-image-branding','교육 · 토탈 이미지'],['certification','자격 인증'],['global','글로벌 네트워크'],['news','소식 목록'],['contact','문의']];
const languages={kr:'한국어',en:'English',cn:'简体中文',jp:'日本語'};
type Documents={page:VisualDocument;common:VisualDocument};
type Selection={scope:'page'|'common';edit:VisualEdit};
export default function VisualEditor(){
 const [path,setPath]=useState('home'),[locale,setLocale]=useState<Locale>('kr'),[news,setNews]=useState<NewsEdit[]>([]);
 const [docs,setDocs]=useState<Documents>({page:emptyDocument(),common:emptyDocument()});
 const [dirty,setDirty]=useState({page:false,common:false}),[selected,setSelected]=useState<Selection|null>(null);
 const [mode,setMode]=useState<'select'|'browse'|'layout'>('select'),[mobile,setMobile]=useState(false),[busy,setBusy]=useState(false),[loaded,setLoaded]=useState(false),[ready,setReady]=useState(false),[message,setMessage]=useState(''),[reload,setReload]=useState(0);
 const [autoSync,setAutoSync]=useState(true),[syncPending,setSyncPending]=useState(false);
 const [fullscreen,setFullscreen]=useState(true),[styleMobile,setStyleMobile]=useState(false);
 const iframe=useRef<HTMLIFrameElement>(null),draftKey=`ipib-visual-draft:${locale}:${path}`;
 const hasChanges=dirty.page||dirty.common;
 const url=`/${locale}${path==='home'?'':`/${path}`}`;
 const configure=useCallback(()=>{if(!loaded||!ready)return;iframe.current?.contentWindow?.postMessage({channel:'ipib-visual',type:'configure',...docs,mode},location.origin);},[docs,mode,loaded,ready]);
 useEffect(()=>{configure();},[configure]);
 useEffect(()=>{
  const listener=(event:MessageEvent)=>{
   if(event.origin!==location.origin||event.source!==iframe.current?.contentWindow||event.data?.channel!=='ipib-visual')return;
   if(event.data.locale!==locale||event.data.path!==path)return;
   if(event.data.type==='ready')setReady(true);
   if(event.data.type==='notice')setMessage(event.data.message);
   if(event.data.type==='selected'&&loaded)setSelected({scope:event.data.scope,edit:event.data.edit});
  };
  window.addEventListener('message',listener);return ()=>window.removeEventListener('message',listener);
 },[locale,path,loaded]);
 useEffect(()=>{
  const abort=new AbortController();setLoaded(false);setSelected(null);setMessage('저장된 내용을 불러오는 중입니다.');
  Promise.all([path,'common'].map(async scope=>{const response=await fetch(`/api/admin/visual?path=${encodeURIComponent(scope)}&locale=${locale}`,{cache:'no-store',signal:abort.signal});const data=await response.json();if(!response.ok)throw Error(data.error);return data as VisualDocument;})).then(([page,common])=>{
   if(abort.signal.aborted)return;setDocs({page,common});setDirty({page:false,common:false});setLoaded(true);setMessage('수정할 문구나 사진을 화면에서 클릭하세요. 지부 탭은 탐색 모드에서 선택할 수 있습니다.');
  }).catch(e=>{if(!abort.signal.aborted)setMessage(e.message||'내용을 불러오지 못했습니다.');});
  return ()=>abort.abort();
 },[path,locale,reload]);
 useEffect(()=>{fetch('/api/admin/content',{cache:'no-store'}).then(r=>r.json()).then(data=>setNews(data.news||[])).catch(()=>{});},[]);
 useEffect(()=>{const leave=(event:BeforeUnloadEvent)=>{if(hasChanges){event.preventDefault();event.returnValue='';}};window.addEventListener('beforeunload',leave);return ()=>window.removeEventListener('beforeunload',leave);},[hasChanges]);
 useEffect(()=>{if(!loaded||!hasChanges)return;try{sessionStorage.setItem(draftKey,JSON.stringify({docs,dirty}));}catch{/* Saving to the server remains available when browser storage is disabled. */}},[docs,dirty,loaded,hasChanges,draftKey]);
 const navigate=(nextPath:string,nextLocale:Locale)=>{if(busy)return;if(hasChanges&&!window.confirm('아직 저장하지 않은 내용이 있습니다. 다른 페이지로 이동할까요? 현재 내용은 이 창의 임시 보관에 남습니다.'))return;setReady(false);setLoaded(false);setDirty({page:false,common:false});setSelected(null);setPath(nextPath);setLocale(nextLocale);};
 const update=(changes:Partial<VisualEdit>)=>{
  if(!selected||!loaded||busy)return;
  const edit={...selected.edit,...changes};setSelected({...selected,edit});
  setDocs(current=>{const document=current[selected.scope];return {...current,[selected.scope]:{...document,edits:[...document.edits.filter(e=>e.id!==edit.id),edit]}};});
  setDirty(current=>({...current,[selected.scope]:true}));
 };
 const restore=()=>{if(!selected)return;setDocs(current=>({...current,[selected.scope]:{...current[selected.scope],edits:current[selected.scope].edits.filter(e=>e.id!==selected.edit.id)}}));setDirty(current=>({...current,[selected.scope]:true}));setSelected(null);setMessage('기본 내용으로 되돌렸습니다. 저장을 눌러 적용하세요.');};
 const syncDocument=async(scope:'page'|'common',document:VisualDocument)=>{
  const results=await Promise.allSettled(locales.filter(l=>l!==locale).map(async to=>{
   const resolved=await resolveVisualLanguage(`/${to}${path==='home'?'':`/${path}`}`,document.edits);
   const response=await fetch('/api/admin/visual-sync',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({path:scope==='page'?path:'common',from:locale,to,revision:document.revision,resolved})});
   const result=await response.json();if(!response.ok)throw Error(`${languages[to]}: ${result.error}`);
  }));
  const failures=results.filter((r):r is PromiseRejectedResult=>r.status==='rejected');if(failures.length)throw Error(failures.map(r=>r.reason.message).join(' '));
 };
 const retrySync=async()=>{if(busy||hasChanges||!loaded)return;setBusy(true);setMessage('다른 언어를 번역·동기화하는 중입니다.');try{await syncDocument('page',docs.page);await syncDocument('common',docs.common);setSyncPending(false);setMessage('모든 언어 동기화 완료.');}catch(e){setSyncPending(true);setMessage(e instanceof Error?e.message:'동기화하지 못했습니다.');}finally{setBusy(false);}};
 const save=async()=>{
  if(!loaded||busy)return;setBusy(true);setMessage('변경 내용을 저장하는 중입니다.');let saved=0;const nextDocs={...docs},nextDirty={...dirty};
  try{
   for(const scope of ['page','common'] as const){if(!dirty[scope])continue;
    const response=await fetch('/api/admin/visual',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({path:scope==='page'?path:'common',locale,...nextDocs[scope]})});
    const data=await response.json();if(!response.ok)throw Error(data.error);
    nextDocs[scope]=data;nextDirty[scope]=false;saved++;setDocs({...nextDocs});setDirty({...nextDirty});
    if(autoSync){setSyncPending(true);setMessage('현재 언어 저장 완료. 다른 언어를 번역·동기화하는 중입니다.');await syncDocument(scope,data);setSyncPending(false);}
   }
   try{sessionStorage.removeItem(draftKey);}catch{}
   setMessage(autoSync?'저장·모든 언어 동기화 완료. 방문자 화면을 새로고침하면 반영됩니다.':'현재 언어 저장 완료. 자동 동기화는 꺼져 있습니다.');
  }catch(e){setMessage(`${saved?'일부 영역은 저장되었습니다. ':''}${e instanceof Error?e.message:'저장에 실패했습니다.'} 미저장 내용은 유지됩니다. 다른 언어 반영이 끝나지 않았다면 ‘다른 언어 동기화 재시도’를 눌러 주세요.`);}finally{setBusy(false);}
 };
 const upload=async(file:File)=>{
  if(!selected||selected.edit.kind!=='image')return;
  if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>25000000){setMessage('JPG·PNG·WebP 사진을 25MB 이하로 선택해 주세요.');return;}
  const selection=selected;setBusy(true);setMessage('사진을 올리는 중입니다. 기존 문구 수정은 유지됩니다.');
  try{const form=new FormData();form.append('image',await prepareImage(file));const response=await fetch('/api/admin/upload',{method:'POST',body:form});const data=await response.json();if(!response.ok)throw Error(data.error);
   const edit={...selection.edit,value:data.url};setSelected({...selection,edit});setDocs(current=>({...current,[selection.scope]:{...current[selection.scope],edits:[...current[selection.scope].edits.filter(e=>e.id!==edit.id),edit]}}));setDirty(current=>({...current,[selection.scope]:true}));setMessage('사진 업로드 완료. 위치와 크기를 맞춘 뒤 변경 내용 저장을 누르세요.');
  }catch(e){setMessage(`${e instanceof Error?e.message:'사진 업로드에 실패했습니다.'} 다른 문구 변경은 그대로 저장할 수 있습니다.`);}finally{setBusy(false);}
 };
 const recover=()=>{try{const data=JSON.parse(sessionStorage.getItem(draftKey)||'null');if(!data){setMessage('이 페이지에 임시 보관된 편집 내용이 없습니다.');return;}if(data.docs.page.revision!==docs.page.revision||data.docs.common.revision!==docs.common.revision){setMessage('서버 내용이 변경되어 임시 보관을 바로 적용할 수 없습니다. 현재 내용을 먼저 확인해 주세요.');return;}setDocs(data.docs);setDirty(data.dirty);setSelected(null);setMessage('이 창에 임시 보관된 내용을 복원했습니다. 저장을 눌러 적용하세요.');}catch{setMessage('임시 보관 내용을 불러오지 못했습니다.');}};
 return <main className={`visual-admin ${fullscreen?'visual-expanded':''}`} id="main">
  <header className="visual-toolbar"><div><p className="eyebrow">IPIB ADMIN</p><h1>전체 페이지 편집</h1><p>화면에서 문구·사진·영역을 클릭하면 오른쪽 편집 도구가 열립니다. 변경 모습은 즉시 미리보기에 나타납니다.</p></div><a href="/admin/news" onClick={e=>{if(hasChanges&&!confirm('저장하지 않은 변경사항이 있습니다. 소식 관리로 이동할까요?'))e.preventDefault();}}>소식·게시글 관리</a><form action="/api/admin/logout" method="post" onSubmit={e=>{if(hasChanges&&!confirm('저장하지 않은 변경사항이 있습니다. 로그아웃할까요?'))e.preventDefault();}}><button type="submit">로그아웃</button></form></header>
  <div className="visual-controls"><label>페이지<select disabled={busy} value={path} onChange={e=>navigate(e.target.value,locale)}>{basePages.map(([value,label])=><option key={value} value={value}>{label}</option>)}{news.filter(n=>n.status!=='draft').map(n=><option key={n.slug} value={`news/${n.slug}`}>소식 · {n.title.kr||n.slug}</option>)}</select></label><label>언어<select disabled={busy} value={locale} onChange={e=>navigate(path,e.target.value as Locale)}>{locales.map(l=><option key={l} value={l}>{languages[l]}</option>)}</select></label><button type="button" aria-pressed={mode==='select'} disabled={!loaded||busy} onClick={()=>setMode('select')}>내용 선택</button><button type="button" aria-pressed={mode==='browse'} disabled={!loaded||busy} onClick={()=>setMode('browse')}>탐색 · 탭 선택</button><button type="button" aria-pressed={mode==='layout'} disabled={!loaded||busy} onClick={()=>setMode('layout')}>영역 · 레이아웃 선택</button><button type="button" onClick={()=>setFullscreen(!fullscreen)}>{fullscreen?'일반 화면':'편집 화면 크게'}</button><button type="button" aria-pressed={mobile} onClick={()=>setMobile(!mobile)}>{mobile?'PC 화면':'모바일 화면'}</button><a href={url} target="_blank" rel="noopener noreferrer">방문자 화면 ↗</a><button className="admin-save" disabled={busy||!loaded||!hasChanges} onClick={save}>{busy?'처리 중…':hasChanges?'변경 내용 저장':'저장됨'}</button></div>
  <div className="visual-sync-controls"><label><input type="checkbox" checked={autoSync} disabled={busy} onChange={e=>setAutoSync(e.target.checked)}/> 저장할 때 다른 언어 자동 번역·사진·서식 동기화</label><button type="button" disabled={busy||!loaded||hasChanges} onClick={retrySync}>{syncPending?'다른 언어 동기화 재시도':'저장된 내용 모든 언어 동기화'}</button><p>번역 문구를 언어별로 다듬을 때는 자동 동기화를 끄세요.</p></div>
  <p className="admin-message" role="status">{message}</p>
  <div className="visual-workspace"><section className={`visual-preview ${mobile?'is-mobile':''}`} aria-label="페이지 미리보기"><iframe key={`${locale}:${path}:${reload}`} ref={iframe} src={url} title="편집할 홈페이지" onLoad={()=>configure()}/></section>
   <aside className="visual-inspector"><h2>{selected?(selected.edit.kind==='image'?'사진 편집':selected.edit.kind==='layout'?'영역 레이아웃':'문구 편집'):'수정할 항목 선택'}</h2>
    {!selected&&<p>왼쪽의 홈페이지에서 문구나 사진을 클릭하세요. 섹션·카드 배치는 위의 ‘영역 · 레이아웃 선택’으로 선택할 수 있습니다. 홍콩·한국 지부처럼 탭 안의 내용은 ‘탐색 · 탭 선택’으로 먼저 열고 ‘내용 선택’으로 전환하세요.</p>}
    {selected&&<fieldset disabled={busy||!loaded}><p className="admin-note">{selected.scope==='common'?'공통 영역: 현재 언어의 모든 페이지에 적용됩니다.':'현재 페이지와 선택한 언어에 적용됩니다.'}</p>
     {selected.edit.kind==='text'?<InlineTextEditor key={selected.edit.id} edit={selected.edit} onChange={update}/>:selected.edit.kind==='image'?<><img className="visual-photo-preview" src={selected.edit.value} alt={selected.edit.alt||'선택한 사진'}/><label>사진 교체<input type="file" accept="image/jpeg,image/png,image/webp" onChange={e=>{const file=e.target.files?.[0];e.target.value='';if(file)upload(file);}}/></label><p className="admin-note">JPG·PNG·WebP 원본 최대 25MB. 업로드 전에 자동으로 용량을 줄입니다. 배경을 제거한 PNG를 올리면 기존 분홍색 배경을 유지할 수 있습니다.</p><label>사진 설명<input value={selected.edit.alt||''} maxLength={300} onChange={e=>update({alt:e.target.value})}/></label><label>사진 맞춤<select value={selected.edit.fit||'cover'} onChange={e=>update({fit:e.target.value as 'cover'|'contain'})}><option value="cover">프레임 채우기</option><option value="contain">사진 전체 보기</option></select></label><label>확대 {Math.round((selected.edit.scale||1)*100)}%<input type="range" min="1" max="2" step="0.05" value={selected.edit.scale||1} onChange={e=>update({scale:Number(e.target.value)})}/></label><label>좌우 위치<input type="range" min="0" max="100" value={selected.edit.x??50} onChange={e=>update({x:Number(e.target.value)})}/></label><label>상하 위치<input type="range" min="0" max="100" value={selected.edit.y??50} onChange={e=>update({y:Number(e.target.value)})}/></label></>:<p>선택한 영역의 배치·크기·여백을 조절하세요.</p>}
     <div className="visual-style-target"><button type="button" aria-pressed={!styleMobile} onClick={()=>setStyleMobile(false)}>기본 서식</button><button type="button" aria-pressed={styleMobile} onClick={()=>{setStyleMobile(true);setMobile(true);}}>모바일 서식</button></div><StyleControls edit={selected.edit} mobile={styleMobile} onChange={style=>update(styleMobile?{mobileStyle:style}:{style})}/><button type="button" onClick={()=>iframe.current?.contentWindow?.postMessage({channel:'ipib-visual',type:'parent'},location.origin)}>상위 영역 선택 · 전체 카드/섹션</button>
     <button type="button" onClick={restore}>이 항목을 기본 내용으로 복원</button></fieldset>}
    <hr/><h3>이 페이지의 수정 항목</h3>{(['page','common'] as const).map(scope=>docs[scope].edits.map(edit=><button key={`${scope}:${edit.id}`} disabled={busy} onClick={()=>setSelected({scope,edit})}>{edit.kind==='image'?'사진: ':edit.kind==='layout'?'영역: ':'문구: '}{(edit.kind==='image'?edit.alt||edit.source:edit.kind==='layout'?edit.selector:edit.value||'(빈 문구)').slice(0,55)}</button>))}<p>사진 안에 포함된 글자는 사진을 교체해 수정할 수 있습니다.</p><p>언어마다 별도로 저장됩니다. 사진이 업로드되지 않아도 문구 변경은 저장할 수 있습니다.</p><button disabled={!loaded||busy||hasChanges} onClick={recover}>이 창의 임시 보관 복원</button><button disabled={busy} onClick={()=>{if(hasChanges&&!confirm('편집 내용을 임시 보관하고 저장된 내용을 다시 불러올까요?'))return;setReady(false);setReload(n=>n+1);}}>저장된 내용 다시 불러오기</button>
   </aside>
  </div>
 </main>;
}
