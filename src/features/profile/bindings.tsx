'use client'

import { useBindings } from '@/entities/user/api/use-bindings'
import { OAuthProvider } from '@/entities/user/model'
import { Button, Surface } from '@/shared/ui'
import { useTranslations } from 'next-intl'
import { Tooltip } from '@mantine/core'

const PROVIDERS: OAuthProvider[] = ['Google', 'Apple', 'Telegram']

export const ProfileBindings = () => {
    const t = useTranslations('profile')
    const { data: bindings = [], isLoading } = useBindings()

    const getBinding = (provider: OAuthProvider) => bindings.find((b) => b.provider === provider)

    return (
        <Surface className="p-4">
            <h3 className="mb-3 text-sm font-medium">{t('bindings')}</h3>
            {isLoading ? (
                <p className="text-muted-foreground text-sm">{t('loading')}</p>
            ) : (
                <div className="flex flex-col gap-2">
                    {PROVIDERS.map((provider) => {
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
                                            {binding.providerEmail ?? binding.providerUsername ?? binding.providerUserId}
                                        </p>
                                    ) : (
                                        <p className="text-muted-foreground text-xs">{t('notLinked')}</p>
                                    )}
                                </div>
                                {!binding && (
                                    <Tooltip label={t('linkSoon')} withArrow>
                                        <span>
                                            <Button type="button" variant="subtle" size="sm" disabled className="pointer-events-none">
                                                {t('link')}
                                            </Button>
                                        </span>
                                    </Tooltip>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}
        </Surface>
    )
}
