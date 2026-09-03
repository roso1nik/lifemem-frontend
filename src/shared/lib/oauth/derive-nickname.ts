const NICKNAME_RE = /[^a-zA-Z0-9_]/g

export const sanitizeNickname = (value: string): string => {
    const cleaned = value.replace(NICKNAME_RE, '_').replace(/_+/g, '_').replace(/^_|_$/g, '')
    if (cleaned.length >= 2) return cleaned.slice(0, 32)
    if (cleaned.length === 1) return `${cleaned}_user`.slice(0, 32)
    return 'user'
}

export const deriveNicknameFromEmail = (email: string): string => {
    const local = email.split('@')[0] ?? 'user'
    return sanitizeNickname(local)
}

export const deriveNicknameFromGoogleJwt = (idToken: string): string => {
    try {
        const payload = JSON.parse(atob(idToken.split('.')[1] ?? '')) as {
            email?: string
            name?: string
            given_name?: string
        }
        if (payload.given_name) return sanitizeNickname(payload.given_name)
        if (payload.name) return sanitizeNickname(payload.name.split(' ')[0] ?? payload.name)
        if (payload.email) return deriveNicknameFromEmail(payload.email)
    } catch {
        // ignore
    }
    return 'user'
}

export const deriveNicknameFromApple = (fullName?: { givenName?: string; familyName?: string } | null): string => {
    if (fullName?.givenName) return sanitizeNickname(fullName.givenName)
    if (fullName?.familyName) return sanitizeNickname(fullName.familyName)
    return 'user'
}

export const deriveNicknameFromTelegram = (data: {
    username?: string
    first_name: string
    last_name?: string
}): string => {
    if (data.username) return sanitizeNickname(data.username)
    if (data.first_name) return sanitizeNickname(data.first_name)
    if (data.last_name) return sanitizeNickname(data.last_name)
    return 'user'
}
