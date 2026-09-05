import type { LogFormat, LogRecord } from './types'

const LEVEL_LABEL: Record<LogRecord['level'], string> = {
    trace: 'TRACE',
    debug: 'DEBUG',
    info: 'INFO',
    warn: 'WARN',
    error: 'ERROR',
    fatal: 'FATAL'
}

const flattenFields = (record: LogRecord): Record<string, unknown> => {
    const fields: Record<string, unknown> = {
        ...(record.bindings ?? {}),
        ...(record.context ?? {}),
        ...(record.data ?? {})
    }
    if (record.err !== undefined) fields.err = record.err
    if (record.durationMs !== undefined) fields.durationMs = record.durationMs
    return fields
}

export const formatPretty = (record: LogRecord): string => {
    const label = LEVEL_LABEL[record.level]
    const fields = flattenFields(record)
    const parts: string[] = [`[${record.time}]`, label, record.msg]

    for (const [key, value] of Object.entries(fields)) {
        if (value === undefined) continue
        const rendered = typeof value === 'string' ? value : JSON.stringify(value)
        parts.push(`${key}=${rendered}`)
    }

    return parts.join(' ')
}

export const formatJson = (record: LogRecord): string => {
    const fields = flattenFields(record)
    return JSON.stringify({
        level: record.level,
        time: record.time,
        msg: record.msg,
        ...fields
    })
}

export const formatRecord = (record: LogRecord, format: LogFormat): string =>
    format === 'json' ? formatJson(record) : formatPretty(record)