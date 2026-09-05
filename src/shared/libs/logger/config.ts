import { LOG_LEVELS, type LogFormat, type LogLevel } from './types'

const isLogLevel = (value: string): value is LogLevel =>
    (LOG_LEVELS as readonly string[]).includes(value)

const readEnv = (key: string): string | undefined => {
    if (typeof process === 'undefined' || !process.env) return undefined
    return process.env[key]
}

const getNodeEnv = (): string => readEnv('NODE_ENV') ?? 'development'

export const getDefaultLogLevel = (): LogLevel => {
    const fromEnv = readEnv('LOG_LEVEL')?.toLowerCase()
    if (fromEnv && isLogLevel(fromEnv)) return fromEnv

    const nodeEnv = getNodeEnv()
    if (nodeEnv === 'test') return 'silent'
    if (nodeEnv === 'production') return 'info'
    return 'debug'
}

export const getDefaultLogFormat = (): LogFormat => {
    const fromEnv = readEnv('LOG_FORMAT')?.toLowerCase()
    if (fromEnv === 'pretty' || fromEnv === 'json') return fromEnv
    return getNodeEnv() === 'production' ? 'json' : 'pretty'
}

export const LEVEL_PRIORITY: Record<LogLevel, number> = {
    trace: 10,
    debug: 20,
    info: 30,
    warn: 40,
    error: 50,
    fatal: 60,
    silent: 100
}

export const shouldLog = (messageLevel: Exclude<LogLevel, 'silent'>, minLevel: LogLevel): boolean =>
    LEVEL_PRIORITY[messageLevel] >= LEVEL_PRIORITY[minLevel]