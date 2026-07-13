import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(input: string | number | Date): string {
  return new Date(input).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export const FREE_SHIPPING_THRESHOLD = 799
export const SHIPPING_FEE = 59

export function calcShipping(
  subtotal: number,
  opts?: { threshold?: number; fee?: number }
): number {
  const threshold = opts?.threshold ?? FREE_SHIPPING_THRESHOLD
  const fee = opts?.fee ?? SHIPPING_FEE
  if (subtotal <= 0) return 0
  return subtotal >= threshold ? 0 : fee
}

// Stores list-style fields (images, ingredients, keywords, dosha) as a single
// string in SQLite, while Postgres would also accept the same String column.
// This helper normalizes either a joined string or a real array back to string[].
export function asStringArray(v: unknown): string[] {
  if (Array.isArray(v)) return v.map((x) => String(x))
  if (typeof v === 'string') return v.split(/[,\n]/).map((s) => s.trim()).filter(Boolean)
  return []
}
