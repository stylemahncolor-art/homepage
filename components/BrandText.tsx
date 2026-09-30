/** Keep the partner's company name intact at every breakpoint. */
export function BrandText({text}:{text:string}){
 return <>{text.split(/(HAN\s+Beauty)/gi).map((part,index)=>/^HAN\s+Beauty$/i.test(part)?<span className="brand-name-nowrap" key={index}>HAN Beauty</span>:part)}</>;
}
