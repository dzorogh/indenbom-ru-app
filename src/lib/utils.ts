import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function joinUrl(...parts: string[]) {
  const segments = [];

  parts.forEach(part => {
    segments.push(...String(part).split('/'))
  })

  return new URL(segments.filter(s => s.length).join('/'));
}
