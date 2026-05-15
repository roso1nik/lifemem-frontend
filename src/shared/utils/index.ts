import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export * from './dayjs'
export * from './format-phone-number'
export * from './sha256'
export * from './path-without-lang'
