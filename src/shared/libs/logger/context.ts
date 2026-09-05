import type { LogContext } from './types'

type AlsLike = {
    run: <T>(store: { context: LogContext }, fn: () => T) => T
    getStore: () => { context: LogContext } | undefined
}

const createAls = (): AlsLike | null => {
    if (typeof window !== 'undefined') return null

    try {
        // Lazy load so client bundles that never call this stay free of node builtins.
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { AsyncLocalStorage } = require('node:async_hooks') as typeof import('node:async_hooks')
        return new AsyncLocalStorage<{ context: LogContext }>()
    } catch {
        return null
    }
}

const asyncLocalStorage = createAls()

export const getLogContext = (): LogContext => asyncLocalStorage?.getStore()?.context ?? {}

export const runWithLogContext = <T>(context: LogContext, fn: () => T): T => {
    if (!asyncLocalStorage) return fn()
    const parent = getLogContext()
    return asyncLocalStorage.run({ context: { ...parent, ...context } }, fn)
}