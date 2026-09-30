import type {AnchorHTMLAttributes} from 'react';

// Use document navigation for public pages so links work without hydration
// and each destination reads the latest published CMS content.
export default function PageLink(props:AnchorHTMLAttributes<HTMLAnchorElement>){
 return <a {...props}/>;
}
