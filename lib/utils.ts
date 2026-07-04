import { AU_STATE_CODES } from './constants'

export function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export function formatPhone(phone: string | null): string {
  if (!phone) return ''
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)} ${digits.slice(6)}`
  }
  return phone
}

export function getStateLabel(abbreviation: string): string {
  return AU_STATE_CODES[abbreviation.toUpperCase()] ?? abbreviation
}
