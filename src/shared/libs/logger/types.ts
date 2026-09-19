export const LOG_LEVELS = ['trace', 'debug', 'info', 'warn', 'error', 'fatal', 'silent'] as const

export type LogLevel = (typeof LOG_LEVELS)[number]

export type LogFormat = 'pretty' | 'json'

export type LogBindings = Record<string, unknown>

export type LogContext = LogBindings

export interface LogRecord {
    level: Exclude<LogLevel, 'silent'>
    time: string
    msg: string
    bindings?: LogBindings
    context?: LogContext
    data?: LogBindings
    err?: unknown
    durationMs?: number
}

export interface Transport {
    write(record: LogRecord, formatted: string): void
}

export interface LoggerOptions {
    level?: LogLevel
    format?: LogFormat
    bindings?: LogBindings
    transports?: Transport[]
    redactKeys?: string[]
}

export interface Logger {
    level: LogLevel
    trace: (msg: string, data?: LogBindings) => void
    debug: (msg: string, data?: LogBindings) => void
    info: (msg: string, data?: LogBindings) => void
    warn: (msg: string, data?: LogBindings) => void
    error: (msg: string, data?: LogBindings | Error, err?: Error) => void
    fatal: (msg: string, data?: LogBindings | Error, err?: Error) => void
    child: (bindings: LogBindings) => Logger
    time: (label: string) => { end: (msg?: string, data?: LogBindings) => void }
}