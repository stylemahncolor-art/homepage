import type {VisualEdit} from './visual-content';
export function resolveVisualLanguage(url:string,edits:VisualEdit[]):Promise<VisualEdit[]>{
 if(!edits.length)return Promise.resolve([]);
 return new Promise((resolve,reject)=>{
  const frame=document.createElement('iframe'),requestId=crypto.randomUUID();
  frame.setAttribute('aria-hidden','true');frame.tabIndex=-1;frame.style.cssText='position:fixed;left:-10000px;top:0;width:1280px;height:900px;visibility:hidden;pointer-events:none';
  const finish=(error?:string,value?:VisualEdit[])=>{clearInterval(timer);clearTimeout(timeout);window.removeEventListener('message',listener);frame.remove();if(error)reject(Error(error));else resolve(value||[]);};
  const listener=(event:MessageEvent)=>{if(event.origin!==location.origin||event.source!==frame.contentWindow||event.data?.channel!=='ipib-visual'||event.data.requestId!==requestId)return;if(event.data.type==='resolved')finish(event.data.missing?.length?'다른 언어에서 편집 위치를 찾지 못했습니다. 저장된 원문은 유지됩니다.':undefined,event.data.edits);};
  window.addEventListener('message',listener);frame.src=url;document.body.append(frame);
  const timer=setInterval(()=>frame.contentWindow?.postMessage({channel:'ipib-visual',type:'resolve',requestId,edits},location.origin),400);
  const timeout=setTimeout(()=>finish('다른 언어의 화면을 불러오지 못했습니다. 잠시 후 동기화를 다시 시도해 주세요.'),45000);
 });
}
