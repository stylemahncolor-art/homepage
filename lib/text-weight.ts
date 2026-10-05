export type TextWeight={start:number;end:number;weight:400|700};
export function validTextWeights(value:unknown,length:number):value is TextWeight[]|undefined {
 if(value===undefined)return true;
 if(!Array.isArray(value)||value.length>500)return false;
 let end=0;
 return value.every(r=>{const valid=r&&Number.isInteger(r.start)&&Number.isInteger(r.end)&&r.start>=end&&r.start<r.end&&r.end<=length&&(r.weight===400||r.weight===700);if(valid)end=r.end;return Boolean(valid);});
}
function compact(values:(400|700|undefined)[]):TextWeight[]{
 const ranges:TextWeight[]=[];
 for(let start=0;start<values.length;){const weight=values[start];let end=start+1;while(end<values.length&&values[end]===weight)end++;if(weight)ranges.push({start,end,weight});start=end;}
 return ranges;
}
export function setTextWeight(length:number,ranges:TextWeight[],start:number,end:number,weight:400|700|undefined){
 const values:(400|700|undefined)[]=Array(length).fill(undefined);
 for(const r of ranges)values.fill(r.weight,r.start,r.end);
 values.fill(weight,start,end);return compact(values);
}
export function rebaseTextWeights(before:string,after:string,ranges:TextWeight[]){
 let prefix=0,suffix=0;while(prefix<before.length&&prefix<after.length&&before[prefix]===after[prefix])prefix++;
 while(suffix<before.length-prefix&&suffix<after.length-prefix&&before[before.length-1-suffix]===after[after.length-1-suffix])suffix++;
 const old:(400|700|undefined)[]=Array(before.length).fill(undefined);for(const r of ranges)old.fill(r.weight,r.start,r.end);
 return compact([...old.slice(0,prefix),...Array(after.length-prefix-suffix).fill(undefined),...(suffix?old.slice(before.length-suffix):[])]);
}
