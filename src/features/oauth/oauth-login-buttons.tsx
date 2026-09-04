'use client'

import { FC, ReactNode, useCallback, useMemo, useState } from 'react'
import { type CredentialResponse } from '@react-oauth/google'
import { useLocale, useTranslations } from 'next-intl'
import { useGetServiceSettings } from '@/entities/service-settings/api/use-service-settings'
import { useGoogleLogin } from '@/entities/auth/api/oauth/use-google-login'
import { useAppleLogin } from '@/entities/auth/api/oauth/use-apple-login'
import { useTelegramLogin, TelegramLoginData } from '@/entities/auth/api/oauth/use-telegram-login'
import { Button } from '@/shared/ui'
import {
    deriveNicknameFromApple,
    deriveNicknameFromGoogleJwt,
    deriveNicknameFromTelegram,
    GoogleLoginButton,
    isNicknameConflictError,
    TelegramLoginWidget,
    useAppleSignIn
} from '@/shared/lib/oauth'
import { isOAuthProviderEnabled, OAuthProviderKey } from '@/shared/config/oauth'
import { OAuthNicknameModal } from './oauth-nickname-modal'

type PendingLogin =
    | { provider: 'google'; idToken: string; nickname: string }
    | { provider: 'apple'; idToken: string; nickname: string }
    | { provider: 'telegram'; telegramData: TelegramLoginData; nickname: string }

interface OAuthLoginButtonsProps {
    phoneComponent?: ReactNode
}

export const OAuthLoginButtons: FC<OAuthLoginButtonsProps> = ({ phoneComponent }) => {
    const t = useTranslations('auth')
    const locale = useLocale()
    const { data: settings } = useGetServiceSettings()
    const { signIn: signInApple, isLoading: isAppleSdkLoading, isConfigured: isAppleConfigured } = useAppleSignIn()

    const { mutate: googleLogin, isPending: isGooglePending } = useGoogleLogin()
    const { mutate: appleLogin, isPending: isApplePending } = useAppleLogin()
    const { mutate: telegramLogin, isPending: isTelegramPending } = useTelegramLogin()

    const [pending, setPending] = useState<PendingLogin | null>(null)
    const [nicknameModalOpen, setNicknameModalOpen] = useState(false)

    const enabledProviders = useMemo(() => {
        const providers: OAuthProviderKey[] = ['google', 'apple', 'telegram']
        return providers.filter((provider) => isOAuthProviderEnabled(settings, provider))
    }, [settings])

    const submitLogin = useCallback(
        (payload: PendingLogin) => {
            const initSettings = { lang: locale }

            const onError = (error: unknown) => {
                if (isNicknameConflictError(error)) {
                    setPending(payload)
                    setNicknameModalOpen(true)
                }
            }

            if (payload.provider === 'google') {
                googleLogin({ idToken: payload.idToken, nickname: payload.nickname, initSettings }, { onError })
                return
            }

            if (payload.provider === 'apple') {
                appleLogin({ idToken: payload.idToken, nickname: payload.nickname, initSettings }, { onError })
                return
            }

            telegramLogin(
                {
                    telegramData: payload.telegramData,
                    nickname: payload.nickname,
                    initSettings
                },
                { onError }
            )
        },
        [appleLogin, googleLogin, locale, telegramLogin]
    )

    const handleGoogleSuccess = (response: CredentialResponse) => {
        if (!response.credential) return
        submitLogin({
            provider: 'google',
            idToken: response.credential,
            nickname: deriveNicknameFromGoogleJwt(response.credential)
        })
    }

    const handleAppleClick = async () => {
        try {
            const result = await signInApple()
            submitLogin({
                provider: 'apple',
                idToken: result.idToken,
                nickname: deriveNicknameFromApple(result.fullName)
            })
        } catch {
            // user cancelled or SDK error — toast handled in hook if needed
        }
    }

    const handleTelegramAuth = (data: TelegramLoginData) => {
        submitLogin({
            provider: 'telegram',
            telegramData: data,
            nickname: deriveNicknameFromTelegram(data)
        })
    }

    const handleNicknameSubmit = (nickname: string) => {
        if (!pending) return
        setNicknameModalOpen(false)
        submitLogin({ ...pending, nickname })
        setPending(null)
    }

    if (enabledProviders.length === 0) return null

    const isPending = isGooglePending || isApplePending || isTelegramPending

    return (
        <>
            <div className="mt-5 flex flex-col gap-3">
                <div className="text-muted-foreground flex items-center gap-3 text-xs">
                    <span className="bg-border h-px flex-1" />
                    <span className="shrink-0 tracking-wide lowercase">{t('orContinueWith')}</span>
                    <span className="bg-border h-px flex-1" />
                </div>
                <div className="flex flex-col gap-2">
                    {phoneComponent}
                    {enabledProviders.includes('google') && <GoogleLoginButton onSuccess={handleGoogleSuccess} />}
                    {enabledProviders.includes('apple') && isAppleConfigured && (
                        <Button
                            type="button"
                            variant="subtle"
                            fullWidth
                            loading={isAppleSdkLoading || isApplePending}
                            onClick={handleAppleClick}
                        >
                            {t('oauthApple')}
                        </Button>
                    )}
                    {enabledProviders.includes('telegram') && <TelegramLoginWidget onAuth={handleTelegramAuth} />}
                </div>
            </div>

            <OAuthNicknameModal
                opened={nicknameModalOpen}
                defaultNickname={pending?.nickname ?? ''}
                loading={isPending}
                onClose={() => {
                    setNicknameModalOpen(false)
                    setPending(null)
                }}
                onSubmit={handleNicknameSubmit}
            />
        </>
    )
}
