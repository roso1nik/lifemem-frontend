'use client'

import { useEffect, useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'
import { Switch } from '@mantine/core'
import { useTranslations } from 'next-intl'
import {
    useGetServiceSettings,
    useUpdateServiceSettings
} from '@/entities/service-settings/api/use-service-settings'
import type { AuthMethodsSettings, ModelProvider } from '@/entities/service-settings/model'
import { useSearchAiModels } from '@/entities/ai-model/api/use-ai-model'
import { Button, Loader, SegmentedControl, Surface, TextInput } from '@/shared/ui'
import { AdminFilterCard } from '@/widgets/admin-shared/chrome'
import { AppWindow, Cpu, KeyRound } from 'lucide-react'

const AUTH_KEYS = ['email', 'freshCall', 'google', 'apple', 'telegram'] as const

const authMethodFormSchema = z.object({
    isLoginEnabled: z.boolean(),
    isRegistrationEnabled: z.boolean()
})

const settingsFormSchema = z.object({
    appVersion: z.number().int().min(0),
    authMethods: z.object({
        email: authMethodFormSchema,
        freshCall: authMethodFormSchema,
        google: authMethodFormSchema,
        apple: authMethodFormSchema,
        telegram: authMethodFormSchema
    }),
    models: z.object({
        provider: z.enum(['Polza', 'Openrouter']),
        analyze: z.object({
            premium: z.string().nullable(),
            lite: z.string().nullable()
        }),
        embedding: z.object({
            premium: z.string().nullable(),
            lite: z.string().nullable()
        })
    })
})

type SettingsFormValues = z.infer<typeof settingsFormSchema>

const normalizeAuth = (raw?: Partial<AuthMethodsSettings> | null): SettingsFormValues['authMethods'] => {
    const next: SettingsFormValues['authMethods'] = {
        email: { isLoginEnabled: false, isRegistrationEnabled: false },
        freshCall: { isLoginEnabled: false, isRegistrationEnabled: false },
        google: { isLoginEnabled: false, isRegistrationEnabled: false },
        apple: { isLoginEnabled: false, isRegistrationEnabled: false },
        telegram: { isLoginEnabled: false, isRegistrationEnabled: false }
    }
    for (const key of AUTH_KEYS) {
        const method = raw?.[key]
        if (!method) continue
        next[key] = {
            isLoginEnabled: method.isLoginEnabled,
            isRegistrationEnabled: method.isRegistrationEnabled
        }
    }
    return next
}

const ModelSelect = ({
    label,
    value,
    onChange,
    options,
    emptyLabel
}: {
    label: string
    value: string | null
    onChange: (value: string | null) => void
    options: { value: string; label: string }[]
    emptyLabel: string
}) => (
    <label className="flex flex-col gap-1.5">
        <span className="text-muted-foreground text-xs font-medium tracking-tight">{label}</span>
        <select
            className="border-hairline bg-background/80 text-foreground focus:border-primary rounded-[var(--radius-input)] border px-3 py-2.5 text-sm outline-none transition-colors"
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value || null)}
        >
            <option value="">{emptyLabel}</option>
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    </label>
)

export const AdminServiceSettings = () => {
    const t = useTranslations('admin')
    const { data, isLoading, isError } = useGetServiceSettings()
    const { mutate: update, isPending } = useUpdateServiceSettings()
    const { mutate: searchModels, data: modelsData } = useSearchAiModels()

    const form = useForm<SettingsFormValues>({
        resolver: zodResolver(settingsFormSchema),
        defaultValues: {
            appVersion: 0,
            authMethods: normalizeAuth(null),
            models: {
                provider: 'Polza',
                analyze: { premium: null, lite: null },
                embedding: { premium: null, lite: null }
            }
        }
    })

    useEffect(() => {
        searchModels({
            pagination: { page: 1, count: 100 },
            sorts: { name: 'ASC' }
        })
    }, [searchModels])

    useEffect(() => {
        if (!data?.json) return
        const json = data.json
        form.reset({
            appVersion: json.appVersion ?? 0,
            authMethods: normalizeAuth(json.authMethods),
            models: {
                provider: json.models?.provider === 'Openrouter' ? 'Openrouter' : 'Polza',
                analyze: {
                    premium: json.models?.analyze?.premium ?? null,
                    lite: json.models?.analyze?.lite ?? null
                },
                embedding: {
                    premium: json.models?.embedding?.premium ?? null,
                    lite: json.models?.embedding?.lite ?? null
                }
            }
        })
    }, [data, form])

    const modelOptions = useMemo(() => {
        const items = modelsData?.data.data ?? []
        return {
            text: items
                .filter((m) => m.type === 'TextToText' || m.type === 'ImageToText')
                .map((m) => ({ value: m.id, label: `${m.name} (${m.type})` })),
            embedding: items
                .filter((m) => m.type === 'Embedding')
                .map((m) => ({ value: m.id, label: m.name }))
        }
    }, [modelsData])

    const onSubmit = (values: SettingsFormValues) => {
        update(values, {
            onSuccess: () => form.reset(values)
        })
    }

    if (isLoading) return <Loader variant="section" size="sm" />
    if (isError) return <p className="text-sm text-red-600">{t('error')}</p>

    return (
        <form className="flex max-w-2xl flex-col gap-5" onSubmit={form.handleSubmit(onSubmit)}>
            <AdminFilterCard className="flex flex-col gap-3">
                <div className="flex items-center gap-2.5">
                    <span className="bg-primary/12 text-primary flex size-8 items-center justify-center rounded-xl">
                        <AppWindow size={15} />
                    </span>
                    <h2 className="text-sm font-semibold tracking-tight">{t('settings.appVersion')}</h2>
                </div>
                <Controller
                    control={form.control}
                    name="appVersion"
                    render={({ field }) => (
                        <TextInput
                            type="number"
                            value={String(field.value)}
                            onChange={(e) => field.onChange(Number(e.currentTarget.value) || 0)}
                            onBlur={field.onBlur}
                        />
                    )}
                />
            </AdminFilterCard>

            <Surface frost capsule className="flex flex-col gap-1 overflow-hidden p-0">
                <div className="flex items-center gap-2.5 px-4 pt-4 pb-2 sm:px-5">
                    <span className="bg-sage/15 text-sage flex size-8 items-center justify-center rounded-xl">
                        <KeyRound size={15} />
                    </span>
                    <h2 className="text-sm font-semibold tracking-tight">{t('settings.authMethods')}</h2>
                </div>
                <div className="divide-hairline divide-y">
                    {AUTH_KEYS.map((key) => (
                        <div key={key} className="flex flex-col gap-2.5 px-4 py-3.5 sm:px-5">
                            <p className="text-sm font-medium tracking-tight">{t(`settings.auth.${key}`)}</p>
                            <Controller
                                control={form.control}
                                name={`authMethods.${key}.isLoginEnabled`}
                                render={({ field }) => (
                                    <Switch
                                        checked={field.value}
                                        onChange={(e) => field.onChange(e.currentTarget.checked)}
                                        label={t('settings.loginEnabled')}
                                    />
                                )}
                            />
                            <Controller
                                control={form.control}
                                name={`authMethods.${key}.isRegistrationEnabled`}
                                render={({ field }) => (
                                    <Switch
                                        checked={field.value}
                                        onChange={(e) => field.onChange(e.currentTarget.checked)}
                                        label={t('settings.registrationEnabled')}
                                    />
                                )}
                            />
                        </div>
                    ))}
                </div>
            </Surface>

            <Surface frost capsule className="flex flex-col gap-4 p-4 sm:p-5">
                <div className="flex items-center gap-2.5">
                    <span className="bg-primary/12 text-primary flex size-8 items-center justify-center rounded-xl">
                        <Cpu size={15} />
                    </span>
                    <h2 className="text-sm font-semibold tracking-tight">{t('settings.models')}</h2>
                </div>
                <Controller
                    control={form.control}
                    name="models.provider"
                    render={({ field }) => (
                        <div className="flex flex-col gap-2">
                            <p className="text-muted-foreground text-xs">{t('settings.provider')}</p>
                            <SegmentedControl
                                value={field.value}
                                onChange={(v) => field.onChange(v as ModelProvider)}
                                options={[
                                    { value: 'Polza', label: 'Polza' },
                                    { value: 'Openrouter', label: 'Openrouter' }
                                ]}
                            />
                        </div>
                    )}
                />
                <Controller
                    control={form.control}
                    name="models.analyze.premium"
                    render={({ field }) => (
                        <ModelSelect
                            label={t('settings.analyzePremium')}
                            value={field.value}
                            onChange={field.onChange}
                            options={modelOptions.text}
                            emptyLabel={t('settings.modelNone')}
                        />
                    )}
                />
                <Controller
                    control={form.control}
                    name="models.analyze.lite"
                    render={({ field }) => (
                        <ModelSelect
                            label={t('settings.analyzeLite')}
                            value={field.value}
                            onChange={field.onChange}
                            options={modelOptions.text}
                            emptyLabel={t('settings.modelNone')}
                        />
                    )}
                />
                <Controller
                    control={form.control}
                    name="models.embedding.premium"
                    render={({ field }) => (
                        <ModelSelect
                            label={t('settings.embeddingPremium')}
                            value={field.value}
                            onChange={field.onChange}
                            options={modelOptions.embedding}
                            emptyLabel={t('settings.modelNone')}
                        />
                    )}
                />
                <Controller
                    control={form.control}
                    name="models.embedding.lite"
                    render={({ field }) => (
                        <ModelSelect
                            label={t('settings.embeddingLite')}
                            value={field.value}
                            onChange={field.onChange}
                            options={modelOptions.embedding}
                            emptyLabel={t('settings.modelNone')}
                        />
                    )}
                />
            </Surface>

            <Button
                type="submit"
                loading={isPending}
                disabled={!form.formState.isDirty}
                className="self-start rounded-full px-5"
            >
                {t('save')}
            </Button>
        </form>
    )
}
