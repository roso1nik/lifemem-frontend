export const DEFAULT_REDACT_KEYS = [
    'password',
    'token',
    'accessToken',
    'refreshToken',
    'authorization',
    'cookie',
    'secret',
    'idToken',
    'code',
    'hash'
] as const

const REDACTED = '[REDACTED]'

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null && !Array.isArray(value) && !(value instanceof Error)

export const serializeError = (err: unknown): Record<string, unknown> | undefined => {
    if (!err) return undefined

    if (err instanceof Error) {
        const cause = err.cause !== undefined ? serializeError(err.cause) : undefined
        return {
            name: err.name,
            message: err.message,
            stack: err.stack,
            ...(cause ? { cause } : {})
        }
    }

    if (typeof err === 'string') return { message: err }
    if (isPlainObject(err)) return redactDeep(err) as Record<string, unknown>
    return { message: String(err) }
}

export const redactDeep = (
    value: unknown,
    redactKeys: readonly string[] = DEFAULT_REDACT_KEYS,
    seen = new WeakSet<object>()
): unknown => {
    if (value === null || value === undefined) return value

    if (typeof value !== 'object') return value

    if (value instanceof Error) return serializeError(value)

    if (seen.has(value)) return '[Circular]'

    if (Array.isArray(value)) {
        seen.add(value)
        return value.map((item) => redactDeep(item, redactKeys, seen))
    }

    if (!isPlainObject(value)) return String(value)

    seen.add(value)
    const result: Record<string, unknown> = {}
    const lowerKeys = new Set(redactKeys.map((k) => k.toLowerCase()))

    for (const [key, nested] of Object.entries(value)) {
        if (lowerKeys.has(key.toLowerCase())) {
            result[key] = REDACTED
            continue
        }
        result[key] = redactDeep(nested, redactKeys, seen)
    }

    return result
}