'use client'

import { ConfirmEmailRequest, confirmEmailSchema, useConfirmEmail } from '@/entities/user/api/use-confirm-email'
import { Link } from '@/i18n/navigation'
import { ROUTES } from '@/shared/router'
import { Button, TextInput } from '@/shared/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslations } from 'next-intl'

const ConfirmEmailForm = () => {
    const t = useTranslations('auth')
    const searchParams = useSearchParams()
    const email = searchParams.get('email') ?? ''

    const {
        handleSubmit,
        control,
        setValue,
        formState: { errors }
    } = useForm<ConfirmEmailRequest>({
        resolver: zodResolver(confirmEmailSchema),
        defaultValues: { email, code: '' }
    })

    useEffect(() => {
        if (email) setValue('email', email)
    }, [email, setValue])

    const { mutate: confirmEmail, isPending } = useConfirmEmail()

    return (
        <div className="flex flex-col items-center gap-3">
            <h1 className="mb-1 text-center text-xl font-semibold tracking-tight">{t('confirmTitle')}</h1>
            <p className="text-muted-foreground mb-2 text-center text-sm">{t('confirmHint', { email: email || '—' })}</p>
            <form className="w-full" onSubmit={handleSubmit((data) => confirmEmail(data))}>
                <Controller
                    control={control}
                    name="code"
                    render={({ field }) => (
                        <TextInput
                            label={t('code')}
                            error={errors.code?.message}
                            placeholder="------"
                            maxLength={6}
                            type="tel"
                            autoFocus
                            inputMode="numeric"
                            value={field.value}
                            onBlur={field.onBlur}
                            onChange={(e) => field.onChange(e.currentTarget.value.replace(/[^0-9]/g, ''))}
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
                    )}
                />
                <Button type="submit" className="mt-4" fullWidth loading={isPending}>
                    {t('confirmSubmit')}
                </Button>
            </form>
            <Link href={ROUTES.LOGIN} className="text-primary mt-2 text-sm hover:underline">
                {t('backToLogin')}
            </Link>
        </div>
    )
}

export default ConfirmEmailForm
