'use client'

import { useConfirmEmail } from '@/entities/user/api/use-confirm-email'
import { useConfirmPhone } from '@/entities/user/api/use-confirm-phone'
import { Link, useRouter } from '@/i18n/navigation'
import { ROUTES } from '@/shared/router'
import { Button, PinInput } from '@/shared/ui'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { ApiQueryKeys } from '@/shared/config'
import { useQueryClient } from '@tanstack/react-query'
import { toE164Phone } from '@/shared/utils'

const ConfirmCodeForm = () => {
    const t = useTranslations('auth')
    const router = useRouter()
    const queryClient = useQueryClient()
    const searchParams = useSearchParams()
    const email = searchParams.get('email') ?? ''
    const phone = searchParams.get('phone') ?? ''
    const isPhone = Boolean(phone)
    const target = isPhone ? phone : email

    const [code, setCode] = useState('')

    const { mutate: confirmEmail, isPending: isEmailPending } = useConfirmEmail()
    const { mutate: confirmPhone, isPending: isPhonePending } = useConfirmPhone()

    const isPending = isEmailPending || isPhonePending

    const onSubmit = () => {
        if (code.length < 4 || !target) return

        const onDone = () => {
            queryClient.invalidateQueries({ queryKey: [ApiQueryKeys.GET_SELF] })
            router.replace(ROUTES.LOGIN)
        }

        if (isPhone) {
            const e164 = toE164Phone(phone) ?? (phone.startsWith('+') ? phone : `+${phone.replace(/\D/g, '')}`)
            confirmPhone({ phone: e164, code }, { onSuccess: onDone })
        } else {
            confirmEmail({ email, code }, { onSuccess: onDone })
        }
    }

    if (!target) {
        return (
            <div className="flex flex-col items-center gap-3">
                <p className="text-muted-foreground text-center text-sm">{t('confirmMissingTarget')}</p>
                <Link href={ROUTES.LOGIN} className="text-primary text-sm hover:underline">
                    {t('backToLogin')}
                </Link>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center gap-3">
            <h1 className="mb-1 text-center text-xl font-semibold tracking-tight">
                {isPhone ? t('confirmPhoneTitle') : t('confirmTitle')}
            </h1>
            <p className="text-muted-foreground mb-2 text-center text-sm">
                {isPhone ? t('confirmPhoneHint', { phone: target }) : t('confirmHint', { email: target })}
            </p>
            <div className="w-full">
                <PinInput value={code} onChange={setCode} autoFocus />
            </div>
            <Button type="button" className="mt-4" fullWidth loading={isPending} onClick={onSubmit}>
                {t('confirmSubmit')}
            </Button>
            <Link href={ROUTES.LOGIN} className="text-primary mt-2 text-sm hover:underline">
                {t('backToLogin')}
            </Link>
        </div>
    )
}

export default ConfirmCodeForm
