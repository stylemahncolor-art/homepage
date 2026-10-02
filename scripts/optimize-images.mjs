import sharp from 'sharp';
import {createHash} from 'node:crypto';
import {readdir,readFile,writeFile,mkdir,stat} from 'node:fs/promises';
import path from 'node:path';

const root=path.resolve('public/assets'),out=path.resolve('public/optimized/assets');
const manifest={};let originalBytes=0,optimizedBytes=0;
async function walk(dir){const entries=await readdir(dir,{withFileTypes:true});return (await Promise.all(entries.map(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]))).flat();}
const files=(await walk(root)).filter(p=>/\.(png|jpe?g|webp)$/i.test(p));
for(const file of files){
 try{
 const original=await readFile(file),relative=path.relative(root,file).split(path.sep).join('/');
 const metadata=await sharp(original,{failOn:'none'}).metadata();if(!metadata.width||!metadata.height||metadata.pages>1)continue;
 const hash=createHash('sha256').update(original).digest('hex').slice(0,10);
 const widths=[...new Set([320,640,960,1440].filter(w=>w<metadata.width).concat(Math.min(metadata.width,1440)))];
 const variants=[];
 for(const width of widths){
  const name=`${relative}.${hash}.${width}.webp`,target=path.join(out,name);
  await mkdir(path.dirname(target),{recursive:true});
  try{if(!(await stat(target)).size)throw Error('Empty variant');}catch{await sharp(original,{failOn:'none'}).rotate().resize({width,withoutEnlargement:true}).webp({quality:82,alphaQuality:100,effort:4}).toFile(target);}
  variants.push({width,src:`/optimized/assets/${name}`});
 }
 const fallback=variants.find(v=>v.width>=640)||variants.at(-1);
 manifest[`/assets/${relative}`]={src:fallback.src,srcSet:variants.map(v=>`${v.src} ${v.width}w`).join(', '),width:metadata.width,height:metadata.height};
 originalBytes+=original.length;optimizedBytes+=(await stat(path.join('public',fallback.src))).size;
 }catch(error){console.warn(`Keeping original image ${path.relative(root,file)}: ${error.message}`);}
}
const migrated=JSON.parse(await readFile('content/migrated-media.json','utf8'));
for(const [key,value] of Object.entries(migrated)){if(manifest[value.path])manifest[`/api/media/${key}`]=manifest[value.path];}
await writeFile('content/image-variants.json',JSON.stringify(manifest));
console.log(`Image variants: ${files.length} originals; 640px fallbacks ${(originalBytes/1048576).toFixed(1)} MB → ${(optimizedBytes/1048576).toFixed(1)} MB. Original files preserved.`);
