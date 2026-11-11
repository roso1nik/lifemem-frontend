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
import type { AuthMethodsSettings, ModelProvider, ModelTierSettings } from '@/entities/service-settings/model'
import { useSearchAiModels } from '@/entities/ai-model/api/use-ai-model'
import { Button, Loader, SegmentedControl, Surface, TextInput } from '@/shared/ui'
import { AdminFilterCard } from '@/widgets/admin-shared/chrome'
import { AppWindow, Cpu, KeyRound } from 'lucide-react'

const AUTH_KEYS = ['email', 'freshCall', 'google', 'apple', 'telegram'] as const
const MODEL_TIERS = ['analyze', 'vision', 'stt', 'sttRefine', 'rag'] as const

const authMethodFormSchema = z.object({
    isLoginEnabled: z.boolean(),
    isRegistrationEnabled: z.boolean(),
    allowAllCountry: z.boolean(),
    countriesWhitelist: z.string()
})

const tierSchema = z.object({
    premium: z.string().nullable(),
    lite: z.string().nullable()
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
        analyze: tierSchema,
        vision: tierSchema,
        stt: tierSchema,
        sttRefine: tierSchema,
        rag: tierSchema
    })
})

type SettingsFormValues = z.infer<typeof settingsFormSchema>

const emptyTier = (): ModelTierSettings => ({ premium: null, lite: null })

const parseCountries = (raw: string) =>
    raw
        .split(/[\s,;]+/)
        .map((item) => item.trim().toUpperCase())
        .filter(Boolean)

const normalizeAuth = (raw?: Partial<AuthMethodsSettings> | null): SettingsFormValues['authMethods'] => {
    const next: SettingsFormValues['authMethods'] = {
        email: {
            isLoginEnabled: false,
            isRegistrationEnabled: false,
            allowAllCountry: true,
            countriesWhitelist: ''
        },
        freshCall: {
            isLoginEnabled: false,
            isRegistrationEnabled: false,
            allowAllCountry: true,
            countriesWhitelist: ''
        },
        google: {
            isLoginEnabled: false,
            isRegistrationEnabled: false,
            allowAllCountry: true,
            countriesWhitelist: ''
        },
        apple: {
            isLoginEnabled: false,
            isRegistrationEnabled: false,
            allowAllCountry: true,
            countriesWhitelist: ''
        },
        telegram: {
            isLoginEnabled: false,
            isRegistrationEnabled: false,
            allowAllCountry: true,
            countriesWhitelist: ''
        }
    }
    for (const key of AUTH_KEYS) {
        const method = raw?.[key]
        if (!method) continue
        next[key] = {
            isLoginEnabled: method.isLoginEnabled,
            isRegistrationEnabled: method.isRegistrationEnabled,
            allowAllCountry: method.allowAllCountry ?? true,
            countriesWhitelist: (method.countriesWhitelist ?? []).join(', ')
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
                analyze: emptyTier(),
                vision: emptyTier(),
                stt: emptyTier(),
                sttRefine: emptyTier(),
                rag: emptyTier()
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
                vision: {
                    premium: json.models?.vision?.premium ?? null,
                    lite: json.models?.vision?.lite ?? null
                },
                stt: {
                    premium: json.models?.stt?.premium ?? null,
                    lite: json.models?.stt?.lite ?? null
                },
                sttRefine: {
                    premium: json.models?.sttRefine?.premium ?? null,
                    lite: json.models?.sttRefine?.lite ?? null
                },
                rag: {
                    premium: json.models?.rag?.premium ?? null,
                    lite: json.models?.rag?.lite ?? null
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
            vision: items
                .filter((m) => m.type === 'ImageToText')
                .map((m) => ({ value: m.id, label: m.name })),
            audio: items
                .filter((m) => m.type === 'TextToText')
                .map((m) => ({ value: m.id, label: m.name }))
        }
    }, [modelsData])

    const tierOptions = (tier: (typeof MODEL_TIERS)[number]) => {
        if (tier === 'vision') return modelOptions.vision
        if (tier === 'stt' || tier === 'sttRefine') return modelOptions.audio
        return modelOptions.text
    }

    const onSubmit = (values: SettingsFormValues) => {
        update(
            {
                appVersion: values.appVersion,
                authMethods: Object.fromEntries(
                    AUTH_KEYS.map((key) => {
                        const method = values.authMethods[key]
                        return [
                            key,
                            {
                                isLoginEnabled: method.isLoginEnabled,
                                isRegistrationEnabled: method.isRegistrationEnabled,
                                allowAllCountry: method.allowAllCountry,
                                countriesWhitelist: method.allowAllCountry
                                    ? undefined
                                    : parseCountries(method.countriesWhitelist)
                            }
                        ]
                    })
                ),
                models: values.models
            },
            {
                onSuccess: () => form.reset(values)
            }
        )
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
                            <Controller
                                control={form.control}
                                name={`authMethods.${key}.allowAllCountry`}
                                render={({ field }) => (
                                    <Switch
                                        checked={field.value}
                                        onChange={(e) => field.onChange(e.currentTarget.checked)}
                                        label={t('settings.allowAllCountry')}
                                    />
                                )}
                            />
                            {!form.watch(`authMethods.${key}.allowAllCountry`) && (
                                <Controller
                                    control={form.control}
                                    name={`authMethods.${key}.countriesWhitelist`}
                                    render={({ field }) => (
                                        <TextInput
                                            {...field}
                                            label={t('settings.countriesWhitelist')}
                                            placeholder={t('settings.countriesPlaceholder')}
                                        />
                                    )}
                                />
                            )}
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
                {MODEL_TIERS.map((tier) => (
                    <div key={tier} className="grid gap-3 sm:grid-cols-2">
                        <Controller
                            control={form.control}
                            name={`models.${tier}.premium`}
                            render={({ field }) => (
                                <ModelSelect
                                    label={t(`settings.${tier}Premium`)}
                                    value={field.value}
                                    onChange={field.onChange}
                                    options={tierOptions(tier)}
                                    emptyLabel={t('settings.modelNone')}
                                />
                            )}
                        />
                        <Controller
                            control={form.control}
                            name={`models.${tier}.lite`}
                            render={({ field }) => (
                                <ModelSelect
                                    label={t(`settings.${tier}Lite`)}
                                    value={field.value}
                                    onChange={field.onChange}
                                    options={tierOptions(tier)}
                                    emptyLabel={t('settings.modelNone')}
                                />
                            )}
                        />
                    </div>
                ))}
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
