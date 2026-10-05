'use client';
import {cssProperty} from '@/lib/visual-style';
import {imageSources} from '@/lib/image-sources';
import {useEffect} from 'react';
import {usePathname} from 'next/navigation';
import {emptyDocument,validVisualEdits,type VisualEdit,type VisualDocument} from '@/lib/visual-content';

// Only text nodes and image attributes are changed. Saved content is never HTML.
export default function VisualContent(){
 const pathname=usePathname();
 useEffect(()=>{
  const parts=pathname.split('/').filter(Boolean),locale=parts[0],path=parts.slice(1).join('/')||'home';
  if(!['kr','en','cn','jp'].includes(locale))return;
  let docs:{page:VisualDocument;common:VisualDocument}={page:emptyDocument(),common:emptyDocument()};
  let active=true,editing=false,mode='select',frame=0;
  const detailOriginals=new Map<HTMLDetailsElement,boolean>();
  const styleOriginals=new Map<HTMLElement,string|null>();
  const textOriginals=new Map<Text,{source:string;applied:string;wrapper?:HTMLSpanElement}>();
  const inlineNodes=new Map<HTMLSpanElement,Text>();
  const imageOriginals=new Map<HTMLImageElement,{src:string;srcset:string|null;style:string|null;alt:string;applied:string}>();
  const send=(type:string,data:object={})=>{if(window.parent!==window)window.parent.postMessage({channel:'ipib-visual',type,path,locale,...data},window.location.origin);};
  const selectorFor=(element:Element)=>{
   const root=element.closest('main,header.header,footer.site-footer');if(!root)return null;
   const segments:string[]=[];let current=element;
   while(current!==root){const parent=current.parentElement;if(!parent)return null;const siblings=Array.from(parent.children).filter(e=>e.tagName===current.tagName);segments.unshift(`${current.tagName.toLowerCase()}:nth-of-type(${siblings.indexOf(current)+1})`);current=parent;}
   return [root.tagName.toLowerCase(),...segments].join(' > ');
  };
  const safeText=(node:Text)=>Boolean(node.textContent?.trim()&&node.parentElement&&!node.parentElement.closest('script,style,svg,textarea,input,select,[contenteditable],.admin-entry'));
  const locate=(edit:VisualEdit)=>{try{return document.querySelector(edit.selector);}catch{return null;}};
  const apply=()=>{
   if(!active)return;
   observer.disconnect();
   for(const [element,style] of styleOriginals){if(element.isConnected){if(style===null)element.removeAttribute('style');else element.setAttribute('style',style);}}styleOriginals.clear();
   // Restore previous patches before reapplying; React may have rendered a new tab.
   for(const [node,original] of textOriginals){if(original.wrapper){if(original.wrapper.isConnected)original.wrapper.replaceWith(node);inlineNodes.delete(original.wrapper);original.wrapper=undefined;}if(!node.isConnected){textOriginals.delete(node);continue;}if(node.nodeValue===original.applied)node.nodeValue=original.source;else if(node.nodeValue!==original.source)textOriginals.delete(node);}
   for(const [image,original] of imageOriginals){if(!image.isConnected){imageOriginals.delete(image);continue;}if(image.getAttribute('src')===original.applied){image.setAttribute('src',original.src);if(original.srcset===null)image.removeAttribute('srcset');else image.setAttribute('srcset',original.srcset);if(original.style===null)image.removeAttribute('style');else image.setAttribute('style',original.style);image.alt=original.alt;}else imageOriginals.delete(image);}
   for(const edit of [...docs.common.edits,...docs.page.edits]){
    const element=locate(edit);if(!element)continue;
    if(edit.kind==='layout'){if(element.tagName!==edit.source)continue;}
    else if(edit.kind==='text'){
     const node=element.childNodes[edit.textIndex??-1];if(!node||node.nodeType!==Node.TEXT_NODE||node.nodeValue!==edit.source||!safeText(node as Text))continue;
     if(element instanceof HTMLElement&&!styleOriginals.has(element))styleOriginals.set(element,element.getAttribute('style'));
     if(element instanceof HTMLElement)element.style.setProperty('white-space','pre-wrap','important');
     textOriginals.set(node as Text,{source:edit.source,applied:edit.value});node.nodeValue=edit.value;
     if(edit.weights?.length){
      const wrapper=document.createElement('span');wrapper.dataset.visualInline='true';
      let offset=0;for(const run of edit.weights){if(run.start>offset)wrapper.append(document.createTextNode(edit.value.slice(offset,run.start)));const span=document.createElement('span');span.textContent=edit.value.slice(run.start,run.end);span.style.setProperty('font-weight',String(run.weight),'important');if(run.fontStyle)span.style.setProperty('font-style',run.fontStyle,'important');wrapper.append(span);offset=run.end;}
      if(offset<edit.value.length)wrapper.append(document.createTextNode(edit.value.slice(offset)));
      node.replaceWith(wrapper);textOriginals.get(node as Text)!.wrapper=wrapper;inlineNodes.set(wrapper,node as Text);
     }
    }else if(edit.kind==='image'){
     if(!(element instanceof HTMLImageElement)||(element.getAttribute('data-content-source')||element.getAttribute('src'))!==edit.source)continue;
     if(!imageOriginals.has(element))imageOriginals.set(element,{src:element.getAttribute('src')||edit.source,srcset:element.getAttribute('srcset'),style:element.getAttribute('style'),alt:element.alt,applied:edit.value});
     const variant=imageSources(edit.value);const original=imageOriginals.get(element)!;original.applied=variant?.src||edit.value;
     if(variant)element.setAttribute('srcset',variant.srcSet);else element.removeAttribute('srcset');element.src=original.applied;element.alt=edit.alt||'';
     // Keep the existing frame; give replacement portraits an explicit crop.
     element.style.setProperty('width','100%');element.style.setProperty('height','100%');element.style.setProperty('max-width','100%');
     element.style.setProperty('object-fit',edit.fit||'cover');element.style.setProperty('object-position',`${edit.x??50}% ${edit.y??50}%`);
     element.style.setProperty('position','relative');element.style.setProperty('left','auto');element.style.setProperty('top','auto');
     element.style.setProperty('transform',`scale(${edit.scale??1})`);element.style.setProperty('transform-origin',`${edit.x??50}% ${edit.y??50}%`);
    }
    if(element instanceof HTMLElement&&(edit.style||edit.mobileStyle)){if(!styleOriginals.has(element))styleOriginals.set(element,element.getAttribute('style'));const styles={...edit.style,...(window.innerWidth<=600?edit.mobileStyle:{})};for(const [name,value] of Object.entries(styles))element.style.setProperty(cssProperty(name),value,'important');}
   }
   observer.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['src','srcset']});
  };
  const observer=new MutationObserver(()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(apply);});
  const message=(event:MessageEvent)=>{
   if(event.origin!==location.origin||event.source!==window.parent||window.parent===window||event.data?.channel!=='ipib-visual')return;
   const data=event.data;
   if(data.type==='resolve'&&typeof data.requestId==='string'&&validVisualEdits(data.edits)){
    const resolved:VisualEdit[]=[],missing:string[]=[];
    for(const edit of data.edits){const element=locate(edit);if(!element){missing.push(edit.id);continue;}
     if(edit.kind==='text'){const child=element.childNodes[edit.textIndex??-1];const node=child instanceof HTMLSpanElement?inlineNodes.get(child):child;if(!node||node.nodeType!==Node.TEXT_NODE){missing.push(edit.id);continue;}resolved.push({...edit,source:textOriginals.get(node as Text)?.source||node.nodeValue||''});}
     else if(edit.kind==='image'&&element instanceof HTMLImageElement)resolved.push({...edit,source:element.getAttribute('data-content-source')||imageOriginals.get(element)?.src||element.getAttribute('src')||''});
     else if(edit.kind==='layout')resolved.push({...edit,source:element.tagName});else missing.push(edit.id);
    }send('resolved',{requestId:data.requestId,edits:resolved,missing});return;
   }
   if(data.type==='parent'){const current=document.querySelector('[data-visual-selected]');const parent=current?.parentElement;if(parent&&selectorFor(parent))selectLayout(parent);return;}
   if(data.type==='configure'&&validVisualEdits(data.page?.edits)&&validVisualEdits(data.common?.edits)){
    editing=true;mode=data.mode==='browse'?'browse':data.mode==='layout'?'layout':'select';docs={page:data.page,common:data.common};apply();
    // Reveal collapsed content in the editor so its text can be selected.
    if(mode!=='browse')document.querySelectorAll<HTMLDetailsElement>('main details,footer.site-footer details').forEach(detail=>{if(!detailOriginals.has(detail))detailOriginals.set(detail,detail.open);detail.open=true;});
    document.documentElement.classList.toggle('visual-selecting',mode!=='browse');
   }
  };
  const selectLayout=(element:Element)=>{const selector=selectorFor(element);if(!selector)return;const scope=selector.startsWith('main')?'page':'common';const existing=docs[scope].edits.find(e=>e.kind==='layout'&&e.selector===selector);const edit:VisualEdit=existing??{id:crypto.randomUUID(),kind:'layout',selector,source:element.tagName,value:''};document.querySelectorAll('[data-visual-selected]').forEach(e=>e.removeAttribute('data-visual-selected'));element.setAttribute('data-visual-selected','true');send('selected',{scope,edit});};
  const click=(event:MouseEvent)=>{
   if(!editing||!(event.target instanceof Element))return;
   if(mode==='browse'){if(event.target.closest('a')){event.preventDefault();event.stopPropagation();send('notice',{message:'다른 페이지는 위쪽 페이지 목록에서 선택해 주세요. 탭과 펼치기 버튼은 이 화면에서 사용할 수 있습니다.'});}return;}
   const target=event.target;if(target.closest('.admin-entry')){event.preventDefault();event.stopPropagation();return;}
   if(mode==='layout'){const container=target.closest('section,article,figure,div,main,header,footer');if(container){event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();selectLayout(container);}return;}
   const image=target.closest('img');
   const inline=target.closest<HTMLSpanElement>('[data-visual-inline]')||Array.from(inlineNodes.keys()).find(wrapper=>wrapper.contains(target))||null;
   let node:Node|null=null;
   if(inline)node=inlineNodes.get(inline)||null;
   else if(!image){
    const doc=document as Document&{caretPositionFromPoint?:(x:number,y:number)=>{offsetNode:Node}|null;caretRangeFromPoint?:(x:number,y:number)=>Range|null};
    node=doc.caretPositionFromPoint?.(event.clientX,event.clientY)?.offsetNode??doc.caretRangeFromPoint?.(event.clientX,event.clientY)?.startContainer??null;
    if(!node||node.nodeType!==Node.TEXT_NODE||!target.contains(node)||!safeText(node as Text))node=Array.from(target.childNodes).find(n=>n.nodeType===Node.TEXT_NODE&&safeText(n as Text))??null;
   }
   const element=image||inline?.parentElement||node?.parentElement;if(!element)return;
   const selector=selectorFor(element);if(!selector)return;
   event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();
   const scope=selector.startsWith('main')?'page':'common';
   const source=image?(image.getAttribute('data-content-source')||imageOriginals.get(image)?.src||image.getAttribute('src')||''):(textOriginals.get(node as Text)?.source||node?.nodeValue||'');
   const textIndex=node?Array.from(element.childNodes).indexOf((inline||node) as ChildNode):undefined;
   const existing=docs[scope].edits.find(e=>e.selector===selector&&e.source===source&&e.kind===(image?'image':'text')&&(image||e.textIndex===textIndex));
   const computed=image?getComputedStyle(image):null;
   const edit:VisualEdit=existing??{id:crypto.randomUUID(),kind:image?'image':'text',selector,source,value:image?source:node?.nodeValue||'',...(image?{alt:image.alt,fit:computed?.objectFit==='contain'?'contain':'cover',x:50,y:50,scale:1}:{textIndex})};
   document.querySelectorAll('[data-visual-selected]').forEach(e=>e.removeAttribute('data-visual-selected'));element.setAttribute('data-visual-selected','true');
   send('selected',{scope,edit});
  };
  const resize=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(apply);};window.addEventListener('resize',resize);
  window.addEventListener('message',message);document.addEventListener('click',click,true);
  const abort=new AbortController();
  fetch(`/api/site-content?path=${encodeURIComponent(path)}&locale=${locale}`,{cache:'no-store',signal:abort.signal}).then(async r=>{if(!r.ok)return;const data=await r.json();if(active&&!editing&&validVisualEdits(data.page?.edits)&&validVisualEdits(data.common?.edits))docs=data;}).catch(()=>{}).finally(()=>{if(active){apply();send('ready');}});
  return ()=>{active=false;abort.abort();cancelAnimationFrame(frame);observer.disconnect();window.removeEventListener('resize',resize);for(const [element,style] of styleOriginals){if(element.isConnected){if(style===null)element.removeAttribute('style');else element.setAttribute('style',style);}}window.removeEventListener('message',message);document.removeEventListener('click',click,true);for(const [node,original] of textOriginals){if(original.wrapper?.isConnected)original.wrapper.replaceWith(node);if(node.isConnected&&node.nodeValue===original.applied)node.nodeValue=original.source;}inlineNodes.clear();
   for(const [image,original] of imageOriginals){if(image.isConnected&&image.getAttribute('src')===original.applied){image.setAttribute('src',original.src);if(original.srcset===null)image.removeAttribute('srcset');else image.setAttribute('srcset',original.srcset);if(original.style===null)image.removeAttribute('style');else image.setAttribute('style',original.style);image.alt=original.alt;}}
   for(const [detail,open] of detailOriginals){if(detail.isConnected)detail.open=open;}
   document.documentElement.classList.remove('visual-selecting');document.querySelectorAll('[data-visual-selected]').forEach(e=>e.removeAttribute('data-visual-selected'));};
 },[pathname]);
 return null;
}
