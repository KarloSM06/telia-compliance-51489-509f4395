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

export function formatJobTitle(title: string | string[] | undefined): string {
  if (!title) return "-";
  
  // Handle array (take first value if array)
  const titleStr = Array.isArray(title) ? title[0] : title;
  
  // Return cleaned title
  return titleStr.trim();
}

export function formatCurrency(value: number, currency: string = 'SEK'): string {
  return `${value.toLocaleString('sv-SE', { maximumFractionDigits: 0 })} ${currency}`;
}
