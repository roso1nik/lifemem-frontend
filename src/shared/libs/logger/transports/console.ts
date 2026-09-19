import type { LogRecord, Transport } from '../types'

const consoleMethod = (level: LogRecord['level']): 'debug' | 'info' | 'warn' | 'error' | 'log' => {
    switch (level) {
        case 'trace':
        case 'debug':
            return 'debug'
        case 'info':
            return 'info'
        case 'warn':
            return 'warn'
        case 'error':
        case 'fatal':
            return 'error'
        default:
            return 'log'
    }
}

export const createConsoleTransport = (): Transport => ({
    write(record, formatted) {
        const method = consoleMethod(record.level)
        const fn = console[method] ?? console.log
        fn(formatted)
    }
})