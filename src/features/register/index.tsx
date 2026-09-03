'use client'

import { useState } from 'react'
import { useRegister, registerSchema } from '@/entities/user/api/use-register'
import { AuthTabs, Button, PasswordInput, SegmentedControl, TextInput } from '@/shared/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoadingOverlay } from '@mantine/core'
import { Mail, Lock, User, Phone } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslations, useLocale } from 'next-intl'
import z from 'zod'
import { emailSchema } from '@/shared/types'
import { formatPhoneNumber } from '@/shared/utils'
import { OAuthLoginButtons } from '@/features/oauth'

type RegisterMode = 'email' | 'phone'

const emailRegisterSchema = registerSchema
    .extend({
        email: emailSchema,
        password: z.string().min(8)
    })
    .omit({ phoneNumber: true })

const phoneRegisterSchema = registerSchema
    .extend({
        phoneNumber: z.string().min(10)
    })
    .omit({ email: true, password: true })

const RegisterForm = () => {
    const t = useTranslations('auth')
    const locale = useLocale()
    const [mode, setMode] = useState<RegisterMode>('email')
    const { mutate: register, isPending } = useRegister()

    const emailForm = useForm<z.infer<typeof emailRegisterSchema>>({
        resolver: zodResolver(emailRegisterSchema),
        defaultValues: { nickname: '', email: '', password: '', initSettings: { lang: locale } }
    })

    const phoneForm = useForm<z.infer<typeof phoneRegisterSchema>>({
        resolver: zodResolver(phoneRegisterSchema),
        defaultValues: { nickname: '', phoneNumber: '', initSettings: { lang: locale } }
    })

    const onEmailSubmit = (data: z.infer<typeof emailRegisterSchema>) => {
        register(data)
    }

    const onPhoneSubmit = (data: z.infer<typeof phoneRegisterSchema>) => {
        register({
            ...data,
            phoneNumber: data.phoneNumber.replace(/\D/g, '')
        })
    }

    return (
        <div className="relative flex flex-col gap-1">
            <AuthTabs active="register" />
            <SegmentedControl
                value={mode}
                onChange={(value) => setMode(value as RegisterMode)}
                options={[
                    { value: 'email', label: t('viaEmail') },
                    { value: 'phone', label: t('viaPhone') }
                ]}
                className="mb-4"
            />

            {mode === 'email' ? (
                <form className="flex flex-col gap-4" onSubmit={emailForm.handleSubmit(onEmailSubmit)}>
                    <Controller
                        name="nickname"
                        control={emailForm.control}
                        render={({ field }) => (
                            <TextInput
                                {...field}
                                label={t('nickname')}
                                error={emailForm.formState.errors.nickname?.message}
                                placeholder={t('nicknamePlaceholder')}
                                leftSection={<User size={16} />}
                            />
                        )}
                    />
                    <Controller
                        name="email"
                        control={emailForm.control}
                        render={({ field }) => (
                            <TextInput
                                {...field}
                                type="email"
                                label={t('email')}
                                error={emailForm.formState.errors.email?.message}
                                placeholder={t('emailPlaceholder')}
                                leftSection={<Mail size={16} />}
                            />
                        )}
                    />
                    <Controller
                        control={emailForm.control}
                        name="password"
                        render={({ field }) => (
                            <PasswordInput
                                {...field}
                                label={t('password')}
                                error={emailForm.formState.errors.password?.message}
                                placeholder={t('passwordPlaceholder')}
                                leftSection={<Lock size={16} />}
                            />
                        )}
                    />
                    <Button type="submit" fullWidth loading={isPending}>
                        {t('submitRegister')}
                    </Button>
                </form>
            ) : (
                <form className="flex flex-col gap-4" onSubmit={phoneForm.handleSubmit(onPhoneSubmit)}>
                    <Controller
                        name="nickname"
                        control={phoneForm.control}
                        render={({ field }) => (
                            <TextInput
                                {...field}
                                label={t('nickname')}
                                error={phoneForm.formState.errors.nickname?.message}
                                placeholder={t('nicknamePlaceholder')}
                                leftSection={<User size={16} />}
                            />
                        )}
                    />
                    <Controller
                        name="phoneNumber"
                        control={phoneForm.control}
                        render={({ field }) => (
                            <TextInput
                                label={t('phone')}
                                error={phoneForm.formState.errors.phoneNumber?.message}
                                type="tel"
                                placeholder={t('phonePlaceholder')}
                                leftSection={<Phone size={16} />}
                                value={field.value}
                                onBlur={field.onBlur}
                                onChange={(e) => field.onChange(formatPhoneNumber(e.currentTarget.value))}
                            />
                        )}
                    />
                    <Button type="submit" fullWidth loading={isPending}>
                        {t('submitRegister')}
                    </Button>
                </form>
            )}
            <OAuthLoginButtons />
            <LoadingOverlay visible={isPending} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} />
        </div>
    )
}

export default RegisterForm
