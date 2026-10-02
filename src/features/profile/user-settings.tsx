'use client'

import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'
import { Switch } from '@mantine/core'
import { useLocale, useTranslations } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'
import {
    useGetUserSettings,
    useUpdateUserSettings,
    userSettingsUpdateSchema
} from '@/entities/user-settings/api/use-user-settings'
import { Button, Loader, SegmentedControl, Surface } from '@/shared/ui'
import { Bell, Languages } from 'lucide-react'

const settingsFormSchema = userSettingsUpdateSchema.extend({
    enableNotification: z.boolean(),
    lang: z.enum(['ru', 'en'])
})

type SettingsFormValues = z.infer<typeof settingsFormSchema>

export const ProfileUserSettings = () => {
    const t = useTranslations('profile')
    const locale = useLocale()
    const pathname = usePathname()
    const router = useRouter()
    const { data, isLoading } = useGetUserSettings()
    const { mutate: updateSettings, isPending } = useUpdateUserSettings()

    const form = useForm<SettingsFormValues>({
        resolver: zodResolver(settingsFormSchema),
        defaultValues: {
            enableNotification: false,
            lang: (locale === 'en' ? 'en' : 'ru') as 'ru' | 'en'
        }
    })

    useEffect(() => {
        if (!data) return
        form.reset({
            enableNotification: data.enableNotification,
            lang: data.lang === 'en' ? 'en' : 'ru'
        })
    }, [data, form])

    const onSubmit = (values: SettingsFormValues) => {
        updateSettings(values, {
            onSuccess: () => {
                form.reset(values)
                if (values.lang !== locale) {
                    router.replace(pathname, { locale: values.lang })
                }
            }
        })
    }

    if (isLoading) {
        return <Loader variant="section" size="sm" />
    }

    return (
        <Surface frost capsule className="overflow-hidden p-0">
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="divide-hairline divide-y">
                    <Controller
                        control={form.control}
                        name="enableNotification"
                        render={({ field }) => (
                            <div className="flex min-h-[4.25rem] items-center gap-3 px-4 py-3 sm:px-5">
                                <span className="bg-sage/15 text-sage flex size-9 shrink-0 items-center justify-center rounded-xl">
                                    <Bell size={15} strokeWidth={1.75} />
                                </span>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm leading-none font-medium">{t('notifications')}</p>
                                    <p className="text-muted-foreground mt-1 text-xs leading-snug">
                                        {t('notificationsHint')}
                                    </p>
                                </div>
                                <Switch
                                    checked={field.value}
                                    onChange={(e) => field.onChange(e.currentTarget.checked)}
                                    onBlur={field.onBlur}
                                    className="shrink-0 self-center"
                                />
                            </div>
                        )}
                    />
                    <Controller
                        control={form.control}
                        name="lang"
                        render={({ field }) => (
                            <div className="flex min-h-[4.25rem] flex-col justify-center gap-3 px-4 py-3 sm:flex-row sm:items-center sm:px-5">
                                <div className="flex min-w-0 flex-1 items-center gap-3">
                                    <span className="bg-primary/12 text-primary flex size-9 shrink-0 items-center justify-center rounded-xl">
                                        <Languages size={15} strokeWidth={1.75} />
                                    </span>
                                    <div className="min-w-0">
                                        <p className="text-sm leading-none font-medium">{t('language')}</p>
                                        <p className="text-muted-foreground mt-1 text-xs leading-snug">
                                            {t('settingsHint')}
                                        </p>
                                    </div>
                                </div>
                                <SegmentedControl
                                    value={field.value}
                                    onChange={(value) => field.onChange(value as 'ru' | 'en')}
                                    className="w-full shrink-0 sm:w-40"
                                    options={[
                                        { value: 'ru', label: 'RU' },
                                        { value: 'en', label: 'EN' }
                                    ]}
                                />
                            </div>
                        )}
                    />
                </div>
                <div className="border-hairline bg-muted/20 flex items-center justify-end border-t px-4 py-3 sm:px-5">
                    <Button
                        type="submit"
                        loading={isPending}
                        disabled={!form.formState.isDirty}
                        className="rounded-full"
                    >
                        {t('save')}
                    </Button>
                </div>
            </form>
        </Surface>
    )
}
