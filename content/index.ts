import { kr } from './kr';
import { en } from './en';
import { cn } from './cn';
import { jp } from './jp';
import type { Locale } from './site';
export const dictionaries = { kr, en, cn, jp };
export const getDictionary = (locale: Locale) => dictionaries[locale];
