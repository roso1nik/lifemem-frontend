'use client'

import { useState } from 'react'
import { useLogin, isPhoneCodeResponse } from '@/entities/auth/api/use-login'
import { useConfirmPhoneLogin } from '@/entities/auth/api/use-confirm-phone-login'
import { ROUTES } from '@/shared/router'
import { AuthTabs, Button, PasswordInput, PinInput, SegmentedControl, TextInput } from '@/shared/ui'
import { Lock, Mail, Phone } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { useTranslations } from 'next-intl'
import { LoadingOverlay, Tooltip } from '@mantine/core'
import z from 'zod'
import { emailSchema } from '@/shared/types'
import { formatPhoneNumber } from '@/shared/utils'

type LoginMode = 'email' | 'phone'

const emailLoginSchema = z.object({
    email: emailSchema,
    password: z.string().min(6, 'Минимум 6 символов')
})

const phoneLoginSchema = z.object({
    phone: z.string().min(10, 'Введите номер телефона')
})

type EmailLoginValues = z.infer<typeof emailLoginSchema>
type PhoneLoginValues = z.infer<typeof phoneLoginSchema>

const OAuthButtons = () => {
    const t = useTranslations('auth')
    const providers = ['Google', 'Apple', 'Telegram'] as const

    return (
        <div className="mt-4 flex flex-col gap-2">
            <p className="text-muted-foreground text-center text-xs">{t('orContinueWith')}</p>
            <div className="flex gap-2">
                {providers.map((provider) => (
                    <Tooltip key={provider} label={t('oauthSoon')} withArrow>
                        <span className="flex-1">
                            <Button type="button" variant="subtle" fullWidth disabled className="pointer-events-none">
                                {provider}
                            </Button>
                        </span>
                    </Tooltip>
                ))}
            </div>
        </div>
    )
}

const LoginForm = () => {
    const t = useTranslations('auth')
    const [mode, setMode] = useState<LoginMode>('email')
    const [phoneStep, setPhoneStep] = useState<'phone' | 'code'>('phone')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [code, setCode] = useState('')

    const { mutate: login, isPending: isLoginPending } = useLogin()
    const { mutate: confirmPhoneLogin, isPending: isConfirmPending } = useConfirmPhoneLogin()

    const emailForm = useForm<EmailLoginValues>({
        resolver: zodResolver(emailLoginSchema),
        defaultValues: { email: '', password: '' }
    })

    const phoneForm = useForm<PhoneLoginValues>({
        resolver: zodResolver(phoneLoginSchema),
        defaultValues: { phone: '' }
    })

    const isPending = isLoginPending || isConfirmPending

    const onEmailSubmit = (data: EmailLoginValues) => {
        login({ email: data.email, password: data.password })
    }

    const onPhoneSubmit = (data: PhoneLoginValues) => {
        const digits = data.phone.replace(/\D/g, '')
        setPhoneNumber(digits)
        login(
            { phone: digits },
            {
                onSuccess: (response) => {
                    if (isPhoneCodeResponse(response.data)) {
                        setPhoneStep('code')
                    }
                }
            }
        )
    }

    const onCodeSubmit = () => {
        if (code.length < 4) return
        confirmPhoneLogin({ phone: phoneNumber, code })
    }

  return (
        <div className="relative flex flex-col gap-1">
            <AuthTabs active="login" />
            <SegmentedControl
                value={mode}
                onChange={(value) => {
                    setMode(value as LoginMode)
                    setPhoneStep('phone')
                    setCode('')
                }}
                options={[
                    { value: 'email', label: t('viaEmail') },
                    { value: 'phone', label: t('viaPhone') }
                ]}
                className="mb-4"
            />

            {mode === 'email' ? (
                <form className="flex flex-col gap-4" onSubmit={emailForm.handleSubmit(onEmailSubmit)}>
                    <Controller
                        control={emailForm.control}
                        name="email"
                        render={({ field }) => (
                            <TextInput
                                {...field}
                                label={t('email')}
                                required
                                error={emailForm.formState.errors.email?.message}
                                type="email"
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
                                required
                                error={emailForm.formState.errors.password?.message}
                                placeholder={t('passwordPlaceholder')}
                                leftSection={<Lock size={16} />}
                            />
                        )}
                    />
                    <Button type="submit" fullWidth loading={isLoginPending}>
                        {t('submitLogin')}
                    </Button>
                </form>
            ) : phoneStep === 'phone' ? (
                <form className="flex flex-col gap-4" onSubmit={phoneForm.handleSubmit(onPhoneSubmit)}>
                    <Controller
                        control={phoneForm.control}
                        name="phone"
                        render={({ field }) => (
                            <TextInput
                                label={t('phone')}
                                required
                                error={phoneForm.formState.errors.phone?.message}
                                type="tel"
                                placeholder={t('phonePlaceholder')}
                                leftSection={<Phone size={16} />}
                                value={field.value}
                                onBlur={field.onBlur}
                                onChange={(e) => field.onChange(formatPhoneNumber(e.currentTarget.value))}
                            />
                        )}
                    />
                    <Button type="submit" fullWidth loading={isLoginPending}>
                        {t('sendCode')}
                    </Button>
                </form>
            ) : (
                <div className="flex flex-col gap-4">
                    <p className="text-muted-foreground text-center text-sm">{t('confirmPhoneHint', { phone: phoneNumber })}</p>
                    <PinInput value={code} onChange={setCode} />
                    <Button type="button" fullWidth loading={isConfirmPending} onClick={onCodeSubmit}>
                        {t('submitLogin')}
                    </Button>
                    <button
                        type="button"
                        className="text-primary text-sm hover:underline"
                        onClick={() => {
                            setPhoneStep('phone')
                            setCode('')
                        }}
                    >
                        {t('changePhone')}
                    </button>
                </div>
            )}

            <OAuthButtons />

            {mode === 'email' && (
                <Link href={ROUTES.FORGOT_PASSWORD} className="text-primary mt-3 self-end text-sm hover:underline">
                    {t('forgotPassword')}
                </Link>
            )}
            <LoadingOverlay visible={isPending} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} />
        </div>
    )
}

export default LoginForm
