import type {ImgHTMLAttributes} from 'react';
import {imageSources} from '@/lib/image-sources';
type Props=Omit<ImgHTMLAttributes<HTMLImageElement>,'src'> & {src:string;priority?:boolean};
export default function ResponsiveImage({src,priority=false,sizes='(max-width: 600px) 100vw, (max-width: 1024px) 60vw, 800px',loading,decoding='async',width,height,...props}:Props){
 const variant=imageSources(src);
 return <img {...props} data-content-source={src} src={variant?.src||src} srcSet={variant?.srcSet} sizes={variant?sizes:undefined} width={width??variant?.width} height={height??variant?.height} loading={loading??(priority||props.fetchPriority==='high'?'eager':'lazy')} decoding={decoding} fetchPriority={priority?'high':props.fetchPriority}/>;
}
