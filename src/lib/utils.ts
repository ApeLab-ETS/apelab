import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combina classi CSS con supporto per Tailwind
 * Unisce più nomi di classe e li fonde utilizzando tailwind-merge
 * @param inputs Una o più classi CSS da combinare
 * @returns Una stringa di classi CSS combinata e ottimizzata per Tailwind
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
