export type TextWeight={start:number;end:number;weight:400|700;fontStyle?:'normal'|'italic'};
export function validTextWeights(value:unknown,length:number):value is TextWeight[]|undefined {
 if(value===undefined)return true;
 if(!Array.isArray(value)||value.length>500)return false;
 let end=0;
 return value.every(r=>{const valid=r&&Number.isInteger(r.start)&&Number.isInteger(r.end)&&r.start>=end&&r.start<r.end&&r.end<=length&&(r.weight===400||r.weight===700)&&(r.fontStyle===undefined||['normal','italic'].includes(r.fontStyle));if(valid)end=r.end;return Boolean(valid);});
}
function compact(values:(Pick<TextWeight,'weight'|'fontStyle'>|undefined)[]):TextWeight[]{
 const ranges:TextWeight[]=[];
 for(let start=0;start<values.length;){const weight=values[start];let end=start+1;while(end<values.length&&JSON.stringify(values[end])===JSON.stringify(weight))end++;if(weight)ranges.push({start,end,...weight});start=end;}
 return ranges;
}
export function setTextWeight(length:number,ranges:TextWeight[],start:number,end:number,weight:400|700|undefined){
 const values:(Pick<TextWeight,'weight'|'fontStyle'>|undefined)[]=Array(length).fill(undefined);
 for(const r of ranges)values.fill({weight:r.weight,...(r.fontStyle?{fontStyle:r.fontStyle}:{})},r.start,r.end);
 for(let i=start;i<end;i++)values[i]=weight?{weight,...(values[i]?.fontStyle?{fontStyle:values[i]!.fontStyle}:{})}:undefined;return compact(values);
}
export function rebaseTextWeights(before:string,after:string,ranges:TextWeight[]){
 let prefix=0,suffix=0;while(prefix<before.length&&prefix<after.length&&before[prefix]===after[prefix])prefix++;
 while(suffix<before.length-prefix&&suffix<after.length-prefix&&before[before.length-1-suffix]===after[after.length-1-suffix])suffix++;
 const old:(Pick<TextWeight,'weight'|'fontStyle'>|undefined)[]=Array(before.length).fill(undefined);for(const r of ranges)old.fill({weight:r.weight,...(r.fontStyle?{fontStyle:r.fontStyle}:{})},r.start,r.end);
 return compact([...old.slice(0,prefix),...Array(after.length-prefix-suffix).fill(undefined),...(suffix?old.slice(before.length-suffix):[])]);
}
