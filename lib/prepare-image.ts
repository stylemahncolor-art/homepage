// Resize in the administrator's browser before uploading. Transparency is retained.
export async function prepareImage(file:File):Promise<File>{
 if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size===0)throw Error('JPG·PNG·WebP 사진을 선택해 주세요.');
 if(file.size>25000000)throw Error('사진 원본은 25MB 이하로 선택해 주세요.');
 const url=URL.createObjectURL(file);
 try{
  const image=new Image();image.src=url;await image.decode();
  const ratio=Math.min(1,1600/Math.max(image.naturalWidth,image.naturalHeight));
  const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(image.naturalWidth*ratio));canvas.height=Math.max(1,Math.round(image.naturalHeight*ratio));
  const context=canvas.getContext('2d');if(!context)throw Error('사진을 처리할 수 없습니다.');context.drawImage(image,0,0,canvas.width,canvas.height);
  const blob=await new Promise<Blob|null>(resolve=>canvas.toBlob(resolve,'image/webp',.84));
  if(!blob||blob.type!=='image/webp'){
   if(file.size<=4000000)return file;throw Error('사진을 4MB 이하로 줄여서 다시 선택해 주세요.');
  }
  if(blob.size>4000000)throw Error('사진을 4MB 이하로 줄여서 다시 선택해 주세요.');
  return new File([blob],file.name.replace(/\.[^.]+$/,'')+'.webp',{type:'image/webp'});
 }finally{URL.revokeObjectURL(url);}
}
