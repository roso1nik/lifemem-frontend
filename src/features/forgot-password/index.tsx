'use client'

import { useState } from 'react'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { Mail, Lock } from 'lucide-react'
import { useTranslations } from 'next-intl'
import toast from 'react-hot-toast'
import {
    useRequestPasswordReset,
    useConfirmPasswordReset,
    requestPasswordResetSchema,
    confirmPasswordResetSchema
} from '@/entities/auth/api/use-password-reset'
import { Link, useRouter } from '@/i18n/navigation'
import { ROUTES } from '@/shared/router'
import { Button, PasswordInput, PinInput, TextInput } from '@/shared/ui'

type RequestValues = z.infer<typeof requestPasswordResetSchema>

const confirmFormSchema = confirmPasswordResetSchema
    .omit({ email: true })
    .extend({
        confirmPassword: z.string().min(8)
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: 'passwords_mismatch',
        path: ['confirmPassword']
    })

type ConfirmValues = z.infer<typeof confirmFormSchema>

export const ForgotPasswordForm = () => {
    const t = useTranslations('auth')
    const router = useRouter()
    const [step, setStep] = useState<'request' | 'confirm'>('request')
    const [email, setEmail] = useState('')

    const { mutate: requestReset, isPending: isRequestPending } = useRequestPasswordReset()
    const { mutate: confirmReset, isPending: isConfirmPending } = useConfirmPasswordReset()

    const requestForm = useForm<RequestValues>({
        resolver: zodResolver(requestPasswordResetSchema),
        defaultValues: { email: '' }
    })

    const confirmForm = useForm<ConfirmValues>({
        resolver: zodResolver(confirmFormSchema),
        defaultValues: { code: '', newPassword: '', confirmPassword: '' }
    })

    const onRequest = (values: RequestValues) => {
        requestReset(values, {
            onSuccess: (data) => {
                setEmail(values.email)
                setStep('confirm')
                toast.success(data?.message || t('codeSent'))
            }
        })
    }

    const onConfirm = (values: ConfirmValues) => {
        confirmReset(
            {
                email,
                code: values.code,
                newPassword: values.newPassword
            },
            {
                onSuccess: () => {
                    toast.success(t('success.passwordReset'))
                    router.replace(ROUTES.LOGIN)
                }
            }
        )
    }

    if (step === 'confirm') {
        return (
            <div className="flex flex-col gap-1">
                <h2 className="mb-1 text-lg font-semibold tracking-tight">{t('forgotConfirmTitle')}</h2>
                <p className="text-muted-foreground mb-4 text-sm">
                    {t('forgotConfirmHint', { email })}
                </p>
                <form className="flex flex-col gap-4" onSubmit={confirmForm.handleSubmit(onConfirm)}>
                    <div className="flex flex-col items-center gap-2">
                        <Controller
                            control={confirmForm.control}
                            name="code"
                            render={({ field }) => (
                                <PinInput
                                    value={field.value}
                                    onChange={field.onChange}
                                    length={6}
                                    autoFocus
                                />
                            )}
                        />
                        {confirmForm.formState.errors.code?.message && (
                            <p className="text-destructive text-xs">
                                {confirmForm.formState.errors.code.message}
                            </p>
                        )}
                    </div>
                    <Controller
                        control={confirmForm.control}
                        name="newPassword"
                        render={({ field }) => (
                            <PasswordInput
                                {...field}
                                label={t('newPassword')}
                                required
                                error={confirmForm.formState.errors.newPassword?.message}
                                placeholder={t('passwordPlaceholder')}
                                leftSection={<Lock size={16} />}
                            />
                        )}
                    />
                    <Controller
                        control={confirmForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <PasswordInput
                                {...field}
                                label={t('confirmPassword')}
                                required
                                error={
                                    confirmForm.formState.errors.confirmPassword?.message ===
                                    'passwords_mismatch'
                                        ? t('errors.passwordsMismatch')
                                        : confirmForm.formState.errors.confirmPassword?.message
                                }
                                placeholder={t('passwordPlaceholder')}
                                leftSection={<Lock size={16} />}
                            />
                        )}
                    />
                    <Button type="submit" fullWidth loading={isConfirmPending}>
                        {t('forgotConfirmSubmit')}
                    </Button>
                    <button
                        type="button"
                        className="text-muted-foreground text-center text-sm hover:underline"
                        onClick={() => {
                            setStep('request')
                            confirmForm.reset()
                        }}
                    >
                        {t('forgotChangeEmail')}
                    </button>
                </form>
                <Link
                    href={ROUTES.LOGIN}
                    className="text-primary mt-4 text-center text-sm hover:underline"
                >
                    {t('backToLogin')}
                </Link>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-1">
            <h2 className="mb-1 text-lg font-semibold tracking-tight">{t('forgotTitle')}</h2>
            <p className="text-muted-foreground mb-4 text-sm">{t('forgotHint')}</p>
            <form className="flex flex-col gap-4" onSubmit={requestForm.handleSubmit(onRequest)}>
                <Controller
                    control={requestForm.control}
                    name="email"
                    render={({ field }) => (
                        <TextInput
                            {...field}
                            label={t('email')}
                            required
                            type="email"
                            error={requestForm.formState.errors.email?.message}
                            placeholder={t('emailPlaceholder')}
                            leftSection={<Mail size={16} />}
                        />
                    )}
                />
                <Button type="submit" fullWidth loading={isRequestPending}>
                    {t('forgotSubmit')}
                </Button>
            </form>
            <Link href={ROUTES.LOGIN} className="text-primary mt-4 text-center text-sm hover:underline">
                {t('backToLogin')}
            </Link>
        </div>
    )
}
