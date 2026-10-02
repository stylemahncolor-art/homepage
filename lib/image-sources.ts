import manifest from '@/content/image-variants.json';
type Variant={src:string;srcSet:string;width:number;height:number};
export const imageSources=(src:string)=>(manifest as Record<string,Variant>)[src];
