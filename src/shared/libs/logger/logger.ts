import { getDefaultLogFormat, getDefaultLogLevel, shouldLog } from './config'
import { getLogContext } from './context'
import { formatRecord } from './format'
import { DEFAULT_REDACT_KEYS, redactDeep, serializeError } from './redact'
import { createConsoleTransport } from './transports/console'
import type { LogBindings, LogLevel, LogRecord, Logger, LoggerOptions, Transport } from './types'

const createSilentTransport = (): Transport => ({
    write() {
        /* no-op */
    }
})

const resolveErrorArgs = (
    dataOrErr?: LogBindings | Error,
    err?: Error
): { data?: LogBindings; err?: unknown } => {
    if (dataOrErr instanceof Error) {
        return { err: dataOrErr }
    }
    if (err) {
        return { data: dataOrErr, err }
    }
    if (dataOrErr && typeof dataOrErr === 'object' && 'err' in dataOrErr) {
        const { err: nestedErr, ...rest } = dataOrErr as LogBindings & { err?: unknown }
        return { data: rest, err: nestedErr }
    }
    return { data: dataOrErr }
}

export const createLogger = (options: LoggerOptions = {}): Logger => {
    const level = options.level ?? getDefaultLogLevel()
    const format = options.format ?? getDefaultLogFormat()
    const bindings = options.bindings ?? {}
    const redactKeys = options.redactKeys ?? [...DEFAULT_REDACT_KEYS]
    const transports =
        options.transports ??
        (level === 'silent' || (typeof process !== 'undefined' && process.env.NODE_ENV === 'test')
            ? [createSilentTransport()]
            : [createConsoleTransport()])

    const emit = (messageLevel: Exclude<LogLevel, 'silent'>, msg: string, data?: LogBindings, err?: unknown) => {
        try {
            if (!shouldLog(messageLevel, level)) return

            const redactedData = data ? (redactDeep(data, redactKeys) as LogBindings) : undefined
            const redactedBindings = redactDeep(bindings, redactKeys) as LogBindings
            const context = redactDeep(getLogContext(), redactKeys) as LogBindings
            const serializedErr = err !== undefined ? serializeError(err) : undefined

            const record: LogRecord = {
                level: messageLevel,
                time: new Date().toISOString(),
                msg,
                bindings: Object.keys(redactedBindings).length ? redactedBindings : undefined,
                context: Object.keys(context).length ? context : undefined,
                data: redactedData,
                err: serializedErr,
                durationMs:
                    redactedData && typeof redactedData.durationMs === 'number'
                        ? redactedData.durationMs
                        : undefined
            }

            if (record.durationMs !== undefined && record.data) {
                const { durationMs: _, ...rest } = record.data
                record.data = Object.keys(rest).length ? rest : undefined
            }

            const formatted = formatRecord(record, format)

            for (const transport of transports) {
                try {
                    transport.write(record, formatted)
                } catch {
                    /* transport must never break the app */
                }
            }
        } catch {
            /* logger must never throw */
        }
    }

    const logger: Logger = {
        level,
        trace: (msg, data) => emit('trace', msg, data),
        debug: (msg, data) => emit('debug', msg, data),
        info: (msg, data) => emit('info', msg, data),
        warn: (msg, data) => emit('warn', msg, data),
        error: (msg, dataOrErr, err) => {
            const resolved = resolveErrorArgs(dataOrErr, err)
            emit('error', msg, resolved.data, resolved.err)
        },
        fatal: (msg, dataOrErr, err) => {
            const resolved = resolveErrorArgs(dataOrErr, err)
            emit('fatal', msg, resolved.data, resolved.err)
        },
        child: (childBindings) =>
            createLogger({
                level,
                format,
                bindings: { ...bindings, ...childBindings },
                transports,
                redactKeys
            }),
        time: (label) => {
            const started = Date.now()
            return {
                end: (msg, data) => {
                    emit('info', msg ?? label, {
                        ...data,
                        durationMs: Date.now() - started,
                        label
                    })
                }
            }
        }
    }

    return logger
}

export const logger = createLogger({ bindings: { app: 'lifemem' } })