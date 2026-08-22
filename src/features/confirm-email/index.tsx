'use client'

import { ConfirmEmailRequest, confirmEmailSchema, useConfirmEmail } from '@/entities/user/api/use-confirm-email'
import { useResendCode } from '@/entities/user/api/use-resend-code'
import { Link } from '@/i18n/navigation'
import { ROUTES } from '@/shared/router'
import { cn } from '@/shared/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input } from '@mantine/core'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslations } from 'next-intl'

const ConfirmEmailForm = () => {
    const t = useTranslations('auth')
    const [timeLeft, setTimeLeft] = useState(30)
    const searchParams = useSearchParams()
    const email = searchParams.get('email') ?? '—'

    useEffect(() => {
        if (timeLeft === 0) return
        const interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000)
        return () => clearInterval(interval)
    }, [timeLeft])

    const isDisabled = timeLeft > 0

    const {
        handleSubmit,
        control,
        formState: { errors }
    } = useForm<ConfirmEmailRequest>({
        resolver: zodResolver(confirmEmailSchema),
        defaultValues: { code: '' }
    })

    const { mutate: confirmEmail, isPending } = useConfirmEmail()
    const { isPending: isLoadingResend, mutate: resendCode } = useResendCode()

    return (
        <div className="flex flex-col items-center gap-3">
            <h1 className="mb-1 text-center text-xl font-semibold">{t('confirmTitle')}</h1>
            <p className="text-muted-foreground mb-2 text-center text-sm">{t('confirmHint', { email })}</p>
            <form className="w-full" onSubmit={handleSubmit((data) => confirmEmail(data))}>
                <Controller
                    control={control}
                    name="code"
                    render={({ field }) => (
                        <Input.Wrapper label={t('code')} error={errors.code?.message}>
                            <Input
                                placeholder="------"
                                maxLength={6}
                                type="tel"
                                autoFocus
                                inputMode="numeric"
                                value={field.value}
                                onBlur={field.onBlur}
                                onChange={(e) => {
                                    field.onChange(e.target.value.replace(/[^0-9]/g, ''))
                                }}
                                styles={{
                                    input: {
                                        textAlign: 'center',
                                        fontSize: '22px',
                                        letterSpacing: '8px',
                                        fontWeight: 600,
                                        height: '48px'
                                    }
                                }}
                            />
                        </Input.Wrapper>
                    )}
                />
                <Button type="submit" mt="md" fullWidth size="md" loading={isPending}>
                    {t('confirmSubmit')}
                </Button>
                <p
                    className={cn(
                        'mt-3 text-center text-sm',
                        isDisabled || isLoadingResend
                            ? 'text-muted-foreground cursor-not-allowed'
                            : 'text-primary cursor-pointer hover:underline'
                    )}
                    onClick={() => {
                        if (isDisabled || isLoadingResend) return
                        resendCode()
                        setTimeLeft(30)
                    }}
                >
                    {isDisabled ? t('resendIn', { seconds: timeLeft }) : t('resend')}
                </p>
            </form>
            <Link href={ROUTES.LOGIN} className="text-primary mt-2 text-sm hover:underline">
                {t('backToLogin')}
            </Link>
        </div>
    )
}

export default ConfirmEmailForm
