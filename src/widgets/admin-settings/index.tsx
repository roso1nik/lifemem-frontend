'use client'

import { useEffect, useState } from 'react'
import { Switch } from '@mantine/core'
import { useTranslations } from 'next-intl'
import {
    useGetServiceSettings,
    useUpdateServiceSettings,
    type ServiceSettingsUpdateRequest
} from '@/entities/service-settings/api/use-service-settings'
import type { AuthMethod, AuthMethodsSettings, ModelProvider, ModelsSettings } from '@/entities/service-settings/model'
import { Button, SegmentedControl, Surface, TextInput } from '@/shared/ui'

const AUTH_KEYS: (keyof AuthMethodsSettings)[] = ['email', 'freshCall', 'google', 'apple', 'telegram']

const EMPTY_AUTH_METHOD: AuthMethod = {
    isRegistrationEnabled: false,
    isLoginEnabled: false,
    allowAllCountry: true,
    countriesWhitelist: []
}

const DEFAULT_AUTH_METHODS: AuthMethodsSettings = {
    email: EMPTY_AUTH_METHOD,
    freshCall: EMPTY_AUTH_METHOD,
    google: EMPTY_AUTH_METHOD,
    apple: EMPTY_AUTH_METHOD,
    telegram: EMPTY_AUTH_METHOD
}

const DEFAULT_MODELS: ModelsSettings = {
    provider: 'Polza',
    analyze: { premium: null, lite: null },
    embedding: { premium: null, lite: null }
}

const normalizeAuthMethods = (raw?: Partial<AuthMethodsSettings> | null): AuthMethodsSettings => {
    const next = { ...DEFAULT_AUTH_METHODS }
    for (const key of AUTH_KEYS) {
        const method = raw?.[key]
        if (!method) continue
        next[key] = { ...EMPTY_AUTH_METHOD, ...method }
    }
    return next
}

export const AdminServiceSettings = () => {
    const t = useTranslations('admin')
    const { data, isLoading, isError } = useGetServiceSettings()
    const { mutate: update, isPending } = useUpdateServiceSettings()

    const [appVersion, setAppVersion] = useState(0)
    const [authMethods, setAuthMethods] = useState<AuthMethodsSettings | null>(null)
    const [provider, setProvider] = useState<ModelProvider>('Polza')
    const [analyzePremium, setAnalyzePremium] = useState('')
    const [analyzeLite, setAnalyzeLite] = useState('')
    const [embeddingPremium, setEmbeddingPremium] = useState('')
    const [embeddingLite, setEmbeddingLite] = useState('')

    useEffect(() => {
        if (!data?.json) return

        const json = data.json
        const models: ModelsSettings = {
            ...DEFAULT_MODELS,
            ...json.models,
            analyze: { ...DEFAULT_MODELS.analyze, ...json.models?.analyze },
            embedding: { ...DEFAULT_MODELS.embedding, ...json.models?.embedding }
        }

        setAppVersion(json.appVersion ?? 0)
        setAuthMethods(normalizeAuthMethods(json.authMethods))
        setProvider(models.provider === 'Openrouter' ? 'Openrouter' : 'Polza')
        setAnalyzePremium(models.analyze.premium ?? '')
        setAnalyzeLite(models.analyze.lite ?? '')
        setEmbeddingPremium(models.embedding.premium ?? '')
        setEmbeddingLite(models.embedding.lite ?? '')
    }, [data])

    const patchAuth = (key: keyof AuthMethodsSettings, field: 'isLoginEnabled' | 'isRegistrationEnabled', value: boolean) => {
        setAuthMethods((prev) => {
            if (!prev) return prev
            return {
                ...prev,
                [key]: { ...prev[key], [field]: value }
            }
        })
    }

    const onSave = () => {
        if (!authMethods) return
        const payload: ServiceSettingsUpdateRequest = {
            appVersion,
            authMethods: Object.fromEntries(
                AUTH_KEYS.map((key) => [
                    key,
                    {
                        isLoginEnabled: authMethods[key].isLoginEnabled,
                        isRegistrationEnabled: authMethods[key].isRegistrationEnabled
                    }
                ])
            ),
            models: {
                provider,
                analyze: {
                    premium: analyzePremium.trim() || null,
                    lite: analyzeLite.trim() || null
                },
                embedding: {
                    premium: embeddingPremium.trim() || null,
                    lite: embeddingLite.trim() || null
                }
            }
        }
        update(payload)
    }

    if (isLoading) return <p className="text-muted-foreground text-sm">{t('loading')}</p>
    if (isError || !authMethods) return <p className="text-sm text-red-600">{t('error')}</p>

    return (
        <div className="flex max-w-2xl flex-col gap-6">
            <Surface className="flex flex-col gap-3 p-4">
                <h2 className="text-sm font-medium">{t('settings.appVersion')}</h2>
                <TextInput
                    type="number"
                    value={String(appVersion)}
                    onChange={(e) => setAppVersion(Number(e.currentTarget.value) || 0)}
                />
            </Surface>

            <Surface className="flex flex-col gap-4 p-4">
                <h2 className="text-sm font-medium">{t('settings.authMethods')}</h2>
                {AUTH_KEYS.map((key) => (
                    <div key={key} className="border-hairline flex flex-col gap-2 border-b pb-3 last:border-0 last:pb-0">
                        <p className="text-sm font-medium">{t(`settings.auth.${key}`)}</p>
                        <Switch
                            checked={authMethods[key].isLoginEnabled}
                            onChange={(e) => patchAuth(key, 'isLoginEnabled', e.currentTarget.checked)}
                            label={t('settings.loginEnabled')}
                        />
                        <Switch
                            checked={authMethods[key].isRegistrationEnabled}
                            onChange={(e) => patchAuth(key, 'isRegistrationEnabled', e.currentTarget.checked)}
                            label={t('settings.registrationEnabled')}
                        />
                    </div>
                ))}
            </Surface>

            <Surface className="flex flex-col gap-3 p-4">
                <h2 className="text-sm font-medium">{t('settings.models')}</h2>
                <p className="text-muted-foreground text-xs">{t('settings.provider')}</p>
                <SegmentedControl
                    value={provider}
                    onChange={(v) => setProvider(v as ModelProvider)}
                    options={[
                        { value: 'Polza', label: 'Polza' },
                        { value: 'Openrouter', label: 'Openrouter' }
                    ]}
                />
                <TextInput
                    label={t('settings.analyzePremium')}
                    value={analyzePremium}
                    onChange={(e) => setAnalyzePremium(e.currentTarget.value)}
                />
                <TextInput
                    label={t('settings.analyzeLite')}
                    value={analyzeLite}
                    onChange={(e) => setAnalyzeLite(e.currentTarget.value)}
                />
                <TextInput
                    label={t('settings.embeddingPremium')}
                    value={embeddingPremium}
                    onChange={(e) => setEmbeddingPremium(e.currentTarget.value)}
                />
                <TextInput
                    label={t('settings.embeddingLite')}
                    value={embeddingLite}
                    onChange={(e) => setEmbeddingLite(e.currentTarget.value)}
                />
            </Surface>

            <Button type="button" loading={isPending} className="self-start" onClick={onSave}>
                {t('save')}
            </Button>
        </div>
    )
}
