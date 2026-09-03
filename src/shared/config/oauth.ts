import { ServiceSettings } from '@/entities/service-settings/model'

export type OAuthProviderKey = 'google' | 'apple' | 'telegram'

const normalizeTelegramBotUsername = (value: string) => value.replace(/^@/, '').trim()

export const OAUTH_CONFIG = {
    googleClientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? '',
    appleClientId: process.env.NEXT_PUBLIC_APPLE_CLIENT_ID ?? '',
    appleRedirectUri: process.env.NEXT_PUBLIC_APPLE_REDIRECT_URI ?? '',
    telegramBotUsername: normalizeTelegramBotUsername(process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME ?? ''),
    telegramBotId: (process.env.NEXT_PUBLIC_TELEGRAM_BOT_ID ?? '').trim()
} as const

export const isOAuthProviderConfigured = (provider: OAuthProviderKey): boolean => {
    switch (provider) {
        case 'google':
            return OAUTH_CONFIG.googleClientId.length > 0
        case 'apple':
            return OAUTH_CONFIG.appleClientId.length > 0
        case 'telegram':
            return OAUTH_CONFIG.telegramBotUsername.length > 0
    }
}

export const isOAuthProviderEnabled = (
    settings: ServiceSettings | undefined,
    provider: OAuthProviderKey
): boolean => {
    if (!isOAuthProviderConfigured(provider)) return false
    const method = settings?.json?.authMethods?.[provider]
    if (!method) return true
    return method.isLoginEnabled
}
