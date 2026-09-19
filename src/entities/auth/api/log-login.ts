import { logOnServer } from '@/shared/libs/logger/server'

type LoginIdentity =
    | { kind: 'email'; email: string }
    | { kind: 'phone'; phone: string }
    | { kind: 'oauth'; method: 'google' | 'apple' | 'telegram' }

type LoginResultKind = 'попытка' | 'успех' | 'код отправлен' | 'ошибка'

const identityPart = (identity: LoginIdentity): string => {
    switch (identity.kind) {
        case 'email':
            return `email: ${identity.email}`
        case 'phone':
            return `phone: ${identity.phone}`
        case 'oauth':
            return `метод: ${identity.method}`
    }
}

export const formatLoginLogMessage = (
    identity: LoginIdentity,
    result?: LoginResultKind,
    reason?: string
): string => {
    const parts = [`ЛОГИН — ${identityPart(identity)}`]

    if (result && result !== 'попытка') {
        parts.push(`результат: ${result}`)
    }

    if (reason) {
        parts.push(`причина: ${reason}`)
    }

    return parts.join(' | ')
}

export const logLoginAttempt = (identity: LoginIdentity): void => {
    void logOnServer('info', formatLoginLogMessage(identity, 'попытка'), {
        event: 'login_attempt',
        ...identity
    })
}

export const logLoginSuccess = (identity: LoginIdentity): void => {
    void logOnServer('info', formatLoginLogMessage(identity, 'успех'), {
        event: 'login_success',
        ...identity
    })
}

export const logLoginCodeSent = (identity: Extract<LoginIdentity, { kind: 'phone' }>): void => {
    void logOnServer('info', formatLoginLogMessage(identity, 'код отправлен'), {
        event: 'login_code_sent',
        ...identity
    })
}

export const logLoginError = (identity: LoginIdentity, reason: string): void => {
    void logOnServer('warn', formatLoginLogMessage(identity, 'ошибка', reason), {
        event: 'login_error',
        reason,
        ...identity
    })
}

export const resolveLoginIdentity = (data: {
    email?: string
    phone?: string
}): LoginIdentity | null => {
    if (data.email) return { kind: 'email', email: data.email }
    if (data.phone) return { kind: 'phone', phone: data.phone }
    return null
}