'use client'

import { useCallback, useState } from 'react'
import { OAUTH_CONFIG } from '@/shared/config/oauth'
import { TelegramLoginData } from '@/entities/auth/api/oauth/use-telegram-login'
import { Loader } from '@mantine/core'
import { useTranslations } from 'next-intl'
import { cn } from '@/shared/utils'
import classes from './telegram-login-widget.module.css'

const TELEGRAM_SCRIPT_SRC = 'https://telegram.org/js/telegram-widget.js?22'
const TELEGRAM_OAUTH_ORIGIN = 'https://oauth.telegram.org'

type TelegramLoginWidgetProps = {
    onAuth: (data: TelegramLoginData) => void
    size?: 'large' | 'medium' | 'small'
    className?: string
    label?: string
}

declare global {
    interface Window {
        Telegram?: {
            Login?: {
                auth: (
                    options: { bot_id: string | number; request_access?: boolean | string },
                    callback: (data: TelegramLoginData | false) => void
                ) => void
            }
        }
    }
}

const loadTelegramScript = (): Promise<void> =>
    new Promise((resolve, reject) => {
        if (typeof window === 'undefined') {
            reject(new Error('Telegram login is only available in browser'))
            return
        }

        if (window.Telegram?.Login?.auth) {
            resolve()
            return
        }

        const existing = document.querySelector<HTMLScriptElement>(`script[src="${TELEGRAM_SCRIPT_SRC}"]`)
        if (existing) {
            existing.addEventListener('load', () => resolve())
            existing.addEventListener('error', () => reject(new Error('Failed to load Telegram')))
            return
        }

        const script = document.createElement('script')
        script.src = TELEGRAM_SCRIPT_SRC
        script.async = true
        script.onload = () => resolve()
        script.onerror = () => reject(new Error('Failed to load Telegram'))
        document.head.appendChild(script)
    })

const isTelegramAuthData = (value: unknown): value is TelegramLoginData => {
    if (!value || typeof value !== 'object') return false
    const data = value as TelegramLoginData
    return typeof data.id === 'number' && typeof data.first_name === 'string' && typeof data.hash === 'string'
}

const openTelegramPopup = (username: string, onAuth: (data: TelegramLoginData) => void) => {
    const width = 550
    const height = 470
    const left = Math.max(0, (window.screen.width - width) / 2)
    const top = Math.max(0, (window.screen.height - height) / 2)
    const origin = window.location.origin
    const url =
        `${TELEGRAM_OAUTH_ORIGIN}/embed/${encodeURIComponent(username)}` +
        `?origin=${encodeURIComponent(origin)}` +
        `&return_to=${encodeURIComponent(window.location.href)}` +
        `&request_access=write&size=large`

    const popup = window.open(
        url,
        'telegram_oauth',
        `width=${width},height=${height},left=${left},top=${top},status=0,location=0,menubar=0,toolbar=0`
    )

    const onMessage = (event: MessageEvent) => {
        if (event.origin !== TELEGRAM_OAUTH_ORIGIN) return
        let payload: { event?: string; auth_data?: unknown; result?: unknown } = {}
        try {
            payload = typeof event.data === 'string' ? JSON.parse(event.data) : event.data
        } catch {
            return
        }

        const authData = payload.event === 'auth_user' ? payload.auth_data : payload.event === 'auth_result' ? payload.result : null
        if (!isTelegramAuthData(authData)) return

        window.removeEventListener('message', onMessage)
        popup?.close()
        onAuth(authData)
    }

    window.addEventListener('message', onMessage)
    popup?.focus()
}

const TelegramPlaneIcon = () => (
    <svg className={classes.icon} width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
            fill="currentColor"
            d="M9.78 18.65 10.06 14.32 17.69 7.3c.34-.31-.07-.46-.52-.19L7.74 13.3 3.47 12c-.93-.29-.94-.92.2-1.38L20.78 4.27c.77-.33 1.52.18 1.24 1.34l-2.9 13.67c-.2.91-.79 1.13-1.6.7l-4.42-3.26-2.13 2.06c-.24.25-.45.46-.79.46Z"
        />
    </svg>
)

export const TelegramLoginWidget = ({ onAuth, className, label }: TelegramLoginWidgetProps) => {
    const t = useTranslations('auth')
    const [isLoading, setIsLoading] = useState(false)
    const username = OAUTH_CONFIG.telegramBotUsername
    const botId = OAUTH_CONFIG.telegramBotId

    const handleClick = useCallback(async () => {
        if (!username) return
        setIsLoading(true)
        try {
            await loadTelegramScript()
            if (botId && window.Telegram?.Login?.auth) {
                window.Telegram.Login.auth({ bot_id: botId, request_access: 'write' }, (data) => {
                    if (data && isTelegramAuthData(data)) onAuth(data)
                })
                return
            }
            openTelegramPopup(username, onAuth)
        } finally {
            setIsLoading(false)
        }
    }, [botId, onAuth, username])

    if (!username) return null

    return (
        <button
            type="button"
            className={cn(classes.telegram, className)}
            disabled={isLoading}
            onClick={handleClick}
        >
            {isLoading ? <Loader size={18} color="white" /> : <TelegramPlaneIcon />}
            <span className={classes.label}>{label ?? t('oauthTelegram')}</span>
        </button>
    )
}
