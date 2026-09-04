import {
    AsYouType,
    isValidPhoneNumber,
    parsePhoneNumberFromString,
    type CountryCode
} from 'libphonenumber-js'

const onlyPhoneChars = (value: string) => value.replace(/[^\d+]/g, '')

export const normalizePhoneInput = (value: string): string => {
    const cleaned = onlyPhoneChars(value)
    if (!cleaned) return ''

    const digits = cleaned.replace(/\+/g, '')
    if (!digits) return '+'

    return `+${digits}`
}

export const formatPhoneNumber = (value: string): string => {
    const normalized = normalizePhoneInput(value)
    if (!normalized) return ''
    if (normalized === '+') return '+'

    return new AsYouType().input(normalized)
}

export const toE164Phone = (value: string): string | undefined => {
    const normalized = normalizePhoneInput(value)
    if (!normalized || normalized === '+') return undefined

    const parsed = parsePhoneNumberFromString(normalized)
    if (parsed?.number) return parsed.number

    return normalized.length > 1 ? normalized : undefined
}

export const isValidPhone = (value: string): boolean => {
    const e164 = toE164Phone(value)
    return Boolean(e164 && isValidPhoneNumber(e164))
}

export const getPhoneCountry = (value: string): CountryCode | undefined => {
    const formatter = new AsYouType()
    formatter.input(normalizePhoneInput(value))
    return formatter.getCountry()
}

export type PhoneHintState =
    | { kind: 'default' }
    | { kind: 'valid' }
    | { kind: 'progress'; remaining: number; mask: string }

export const getPhoneHintState = (value: string): PhoneHintState => {
    const normalized = normalizePhoneInput(value)
    if (!normalized || normalized === '+') return { kind: 'default' }
    if (isValidPhone(normalized)) return { kind: 'valid' }

    const formatter = new AsYouType()
    formatter.input(normalized)
    if (!formatter.getCountry()) return { kind: 'default' }

    const template = formatter.getTemplate()
    const totalSlots = template.match(/x/g)?.length ?? 0
    const current = normalized.replace(/\D/g, '').length

    if (totalSlots === 0) return { kind: 'default' }

    const remaining = Math.max(totalSlots - current, 0)
    if (remaining === 0) return { kind: 'default' }

    return {
        kind: 'progress',
        remaining,
        mask: template.replace(/x/g, '·')
    }
}
