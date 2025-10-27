import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function translateSeniorityLevel(level: string | string[] | undefined): string {
  if (!level) return "-";
  
  // Handle array (take first value if array)
  const levelStr = Array.isArray(level) ? level[0] : level;
  const normalized = levelStr.toLowerCase().trim();
  
  // Map to Swedish terms
  const translations: Record<string, string> = {
    'cxo': 'Styrelse',
    'owner': 'Styrelse',
    'director': 'Styrelse',
    'vp': 'Vice VD',
    'manager': 'Chef',
    'senior': 'Senior',
    'entry': 'Junior',
    'training': 'Trainee'
  };
  
  return translations[normalized] || levelStr;
}
