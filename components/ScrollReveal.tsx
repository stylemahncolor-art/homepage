'use client';
import {useEffect} from 'react';
import {usePathname} from 'next/navigation';

export function ScrollReveal(){
 const pathname=usePathname();
 useEffect(()=>{
  const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
  if(motion.matches || !('IntersectionObserver' in window))return;
  const nodes=Array.from(document.querySelectorAll<HTMLElement>('main .hero-spread, main>section:not(.editorial-hero), main .training-gallery, main .brand-color-grid, main .branch-directory'));
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
   if(entry.isIntersecting){entry.target.classList.add('reveal-visible');observer.unobserve(entry.target);}
  }),{threshold:0,rootMargin:'0px 0px -24px 0px'});
  nodes.forEach(el=>{if(el.getBoundingClientRect().top>=window.innerHeight){el.classList.add('scroll-reveal');observer.observe(el);}});
  const stop=()=>{if(motion.matches){observer.disconnect();nodes.forEach(el=>el.classList.remove('scroll-reveal','reveal-visible'));}};
  motion.addEventListener('change',stop);
  return()=>{observer.disconnect();motion.removeEventListener('change',stop);nodes.forEach(el=>el.classList.remove('scroll-reveal','reveal-visible'));};
 },[pathname]);
 return null;
}
