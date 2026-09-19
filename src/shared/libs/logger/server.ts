'use server'

import { logger } from './logger'
import type { LogBindings, LogLevel } from './types'

const writableLevels = ['trace', 'debug', 'info', 'warn', 'error', 'fatal'] as const

type WritableLevel = (typeof writableLevels)[number]

const isWritableLevel = (level: LogLevel): level is WritableLevel =>
    (writableLevels as readonly string[]).includes(level)

/**
 * Fire-and-forget server logging from client components.
 * Writes to the Next.js / Node process stdout (terminal), not the browser console.
 */
export async function logOnServer(
    level: LogLevel,
    message: string,
    context?: LogBindings
): Promise<void> {
    if (!isWritableLevel(level)) return

    const method = logger[level]
    if (level === 'error' || level === 'fatal') {
        method(message, context)
        return
    }

    method(message, context)
}