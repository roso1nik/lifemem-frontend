'use client'

import { useCallback, useMemo, useState } from 'react'
import { type CredentialResponse } from '@react-oauth/google'
import { Modal } from '@mantine/core'
import { useTranslations } from 'next-intl'
import { useBindings } from '@/entities/user/api/use-bindings'
import { OAuthProvider } from '@/entities/user/model'
import { useGoogleLink } from '@/entities/auth/api/oauth/use-google-link'
import { useAppleLink } from '@/entities/auth/api/oauth/use-apple-link'
import { useTelegramLink } from '@/entities/auth/api/oauth/use-telegram-link'
import { useGoogleUnlink } from '@/entities/auth/api/oauth/use-google-unlink'
import { useAppleUnlink } from '@/entities/auth/api/oauth/use-apple-unlink'
import { useTelegramUnlink } from '@/entities/auth/api/oauth/use-telegram-unlink'
import { TelegramLoginData } from '@/entities/auth/api/oauth/use-telegram-login'
import { Button, Surface } from '@/shared/ui'
import {
    GoogleLoginButton,
    GoogleOAuthProviderWrapper,
    TelegramLoginWidget,
    useAppleSignIn
} from '@/shared/lib/oauth'
import { isOAuthProviderConfigured, OAuthProviderKey } from '@/shared/config/oauth'

const PROVIDER_KEYS: Record<OAuthProvider, OAuthProviderKey> = {
    Google: 'google',
    Apple: 'apple',
    Telegram: 'telegram'
}

const PROVIDERS: OAuthProvider[] = ['Google', 'Apple', 'Telegram']

export const ProfileBindings = () => {
    const t = useTranslations('profile')
    const { data: bindings = [], isLoading } = useBindings()
    const { signIn: signInApple, isLoading: isAppleSdkLoading, isConfigured: isAppleConfigured } = useAppleSignIn()

    const { mutate: linkGoogle, isPending: isGoogleLinkPending } = useGoogleLink()
    const { mutate: linkApple, isPending: isAppleLinkPending } = useAppleLink()
    const { mutate: linkTelegram, isPending: isTelegramLinkPending } = useTelegramLink()
    const { mutate: unlinkGoogle, isPending: isGoogleUnlinkPending } = useGoogleUnlink()
    const { mutate: unlinkApple, isPending: isAppleUnlinkPending } = useAppleUnlink()
    const { mutate: unlinkTelegram, isPending: isTelegramUnlinkPending } = useTelegramUnlink()

    const [unlinkProvider, setUnlinkProvider] = useState<OAuthProvider | null>(null)
    const [linkingProvider, setLinkingProvider] = useState<OAuthProvider | null>(null)

    const visibleProviders = useMemo(
        () => PROVIDERS.filter((provider) => isOAuthProviderConfigured(PROVIDER_KEYS[provider])),
        []
    )

    const getBinding = (provider: OAuthProvider) => bindings.find((b) => b.provider === provider)

    const isPending =
        isGoogleLinkPending ||
        isAppleLinkPending ||
        isTelegramLinkPending ||
        isGoogleUnlinkPending ||
        isAppleUnlinkPending ||
        isTelegramUnlinkPending

    const handleGoogleLink = useCallback(
        (response: CredentialResponse) => {
            if (!response.credential) return
            linkGoogle(
                { idToken: response.credential },
                { onSettled: () => setLinkingProvider(null) }
            )
        },
        [linkGoogle]
    )

    const handleAppleLink = useCallback(async () => {
        try {
            const result = await signInApple()
            linkApple({ idToken: result.idToken }, { onSettled: () => setLinkingProvider(null) })
        } catch {
            setLinkingProvider(null)
        }
    }, [linkApple, signInApple])

    const handleTelegramLink = useCallback(
        (data: TelegramLoginData) => {
            linkTelegram({ telegramData: data }, { onSettled: () => setLinkingProvider(null) })
        },
        [linkTelegram]
    )

    const confirmUnlink = () => {
        if (!unlinkProvider) return
        const onSettled = () => setUnlinkProvider(null)

        if (unlinkProvider === 'Google') unlinkGoogle(undefined, { onSettled })
        if (unlinkProvider === 'Apple') unlinkApple(undefined, { onSettled })
        if (unlinkProvider === 'Telegram') unlinkTelegram(undefined, { onSettled })
    }

    if (visibleProviders.length === 0) return null

    return (
        <GoogleOAuthProviderWrapper>
            <Surface className="p-4">
                <h3 className="mb-3 text-sm font-medium">{t('bindings')}</h3>
                {isLoading ? (
                    <p className="text-muted-foreground text-sm">{t('loading')}</p>
                ) : (
                    <div className="flex flex-col gap-2">
                        {visibleProviders.map((provider) => {
                            const binding = getBinding(provider)

                            return (
                                <div
                                    key={provider}
                                    className="border-hairline flex items-center justify-between gap-3 rounded-xl px-3 py-2"
                                >
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium">{provider}</p>
                                        {binding ? (
                                            <p className="text-muted-foreground truncate text-xs">
                                                {binding.providerEmail ??
                                                    binding.providerUsername ??
                                                    binding.providerUserId}
                                            </p>
                                        ) : (
                                            <p className="text-muted-foreground text-xs">{t('notLinked')}</p>
                                        )}
                                    </div>
                                    {binding ? (
                                        <Button
                                            type="button"
                                            variant="subtle"
                                            size="sm"
                                            loading={isPending}
                                            onClick={() => setUnlinkProvider(provider)}
                                        >
                                            {t('unlink')}
                                        </Button>
                                    ) : (
                                        <Button
                                            type="button"
                                            variant="subtle"
                                            size="sm"
                                            loading={isPending}
                                            onClick={() => setLinkingProvider(provider)}
                                        >
                                            {t('link')}
                                        </Button>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                )}
            </Surface>

            <Modal
                opened={linkingProvider === 'Google'}
                onClose={() => setLinkingProvider(null)}
                title={t('linkGoogle')}
                centered
            >
                <GoogleLoginButton onSuccess={handleGoogleLink} onError={() => setLinkingProvider(null)} label={t('linkGoogle')} />
            </Modal>

            <Modal
                opened={linkingProvider === 'Apple' && isAppleConfigured}
                onClose={() => setLinkingProvider(null)}
                title={t('linkApple')}
                centered
            >
                <Button fullWidth loading={isAppleSdkLoading || isAppleLinkPending} onClick={handleAppleLink}>
                    {t('linkApple')}
                </Button>
            </Modal>

            <Modal
                opened={linkingProvider === 'Telegram'}
                onClose={() => setLinkingProvider(null)}
                title={t('linkTelegram')}
                centered
            >
                <TelegramLoginWidget onAuth={handleTelegramLink} label={t('linkTelegram')} />
            </Modal>

            <Modal
                opened={unlinkProvider !== null}
                onClose={() => setUnlinkProvider(null)}
                title={t('unlink')}
                centered
            >
                <p className="text-muted-foreground mb-4 text-sm">{t('unlinkConfirm')}</p>
                <div className="flex justify-end gap-2">
                    <Button variant="subtle" onClick={() => setUnlinkProvider(null)}>
                        {t('cancel')}
                    </Button>
                    <Button variant="danger" loading={isPending} onClick={confirmUnlink}>
                        {t('unlink')}
                    </Button>
                </div>
            </Modal>
        </GoogleOAuthProviderWrapper>
    )
}
