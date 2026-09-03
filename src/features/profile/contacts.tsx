'use client'

import { useState } from 'react'
import { useSelf } from '@/entities/user/api/use-self'
import { useAddEmail, addEmailSchema } from '@/entities/user/api/use-add-email'
import { useAddPhone, addPhoneSchema } from '@/entities/user/api/use-add-phone'
import { useConfirmEmail } from '@/entities/user/api/use-confirm-email'
import { useConfirmPhone } from '@/entities/user/api/use-confirm-phone'
import { Button, PasswordInput, PinInput, Surface, TextInput } from '@/shared/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, Phone, Lock } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslations } from 'next-intl'
import { formatPhoneNumber } from '@/shared/utils'
import { ApiQueryKeys } from '@/shared/config'
import { useQueryClient } from '@tanstack/react-query'
import z from 'zod'

const VerifiedBadge = ({ verified }: { verified: boolean }) => {
    const t = useTranslations('profile')
    return (
        <span
            className={
                verified
                    ? 'bg-sage/15 text-sage rounded-full px-2 py-0.5 text-xs font-medium'
                    : 'bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs font-medium'
            }
        >
            {verified ? t('verified') : t('notVerified')}
        </span>
    )
}

export const ProfileContacts = () => {
    const t = useTranslations('profile')
    const queryClient = useQueryClient()
    const { data: self } = useSelf()
    const user = self?.info

    const [emailCodeStep, setEmailCodeStep] = useState(false)
    const [phoneCodeStep, setPhoneCodeStep] = useState(false)
    const [emailCode, setEmailCode] = useState('')
    const [phoneCode, setPhoneCode] = useState('')
    const [pendingEmail, setPendingEmail] = useState('')
    const [pendingPhone, setPendingPhone] = useState('')

    const { mutate: addEmail, isPending: isAddEmailPending } = useAddEmail()
    const { mutate: addPhone, isPending: isAddPhonePending } = useAddPhone()
    const { mutate: confirmEmail, isPending: isConfirmEmailPending } = useConfirmEmail()
    const { mutate: confirmPhone, isPending: isConfirmPhonePending } = useConfirmPhone()

    const emailForm = useForm<z.infer<typeof addEmailSchema>>({
        resolver: zodResolver(addEmailSchema),
        defaultValues: { email: '', password: '' }
    })

    const phoneForm = useForm<z.infer<typeof addPhoneSchema>>({
        resolver: zodResolver(addPhoneSchema),
        defaultValues: { phoneNumber: '' }
    })

    const invalidateSelf = () => queryClient.invalidateQueries({ queryKey: [ApiQueryKeys.GET_SELF] })

    if (!user) return null

    return (
        <div className="flex flex-col gap-4">
            <Surface className="p-4">
                <div className="mb-3 flex items-center justify-between gap-2">
                    <h3 className="text-sm font-medium">{t('email')}</h3>
                    <VerifiedBadge verified={user.isEmailVerified} />
                </div>
                {user.email ? (
                    <p className="text-muted-foreground text-sm">{user.email}</p>
                ) : emailCodeStep ? (
                    <div className="flex flex-col gap-3">
                        <PinInput value={emailCode} onChange={setEmailCode} />
                        <Button
                            loading={isConfirmEmailPending}
                            onClick={() =>
                                confirmEmail(
                                    { email: pendingEmail, code: emailCode },
                                    {
                                        onSuccess: () => {
                                            invalidateSelf()
                                            setEmailCodeStep(false)
                                            setEmailCode('')
                                        }
                                    }
                                )
                            }
                        >
                            {t('confirmCode')}
                        </Button>
                    </div>
                ) : (
                    <form
                        className="flex flex-col gap-3"
                        onSubmit={emailForm.handleSubmit((data) =>
                            addEmail(data, {
                                onSuccess: () => {
                                    setPendingEmail(data.email)
                                    setEmailCodeStep(true)
                                }
                            })
                        )}
                    >
                        <Controller
                            control={emailForm.control}
                            name="email"
                            render={({ field }) => (
                                <TextInput
                                    {...field}
                                    label={t('addEmail')}
                                    type="email"
                                    leftSection={<Mail size={16} />}
                                    error={emailForm.formState.errors.email?.message}
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
                                    leftSection={<Lock size={16} />}
                                    error={emailForm.formState.errors.password?.message}
                                />
                            )}
                        />
                        <Button type="submit" loading={isAddEmailPending} className="self-start">
                            {t('addEmail')}
                        </Button>
                    </form>
                )}
            </Surface>

            <Surface className="p-4">
                <div className="mb-3 flex items-center justify-between gap-2">
                    <h3 className="text-sm font-medium">{t('phone')}</h3>
                    <VerifiedBadge verified={user.isPhoneVerified} />
                </div>
                {user.phoneNumber ? (
                    <p className="text-muted-foreground text-sm">{user.phoneNumber}</p>
                ) : phoneCodeStep ? (
                    <div className="flex flex-col gap-3">
                        <PinInput value={phoneCode} onChange={setPhoneCode} />
                        <Button
                            loading={isConfirmPhonePending}
                            onClick={() =>
                                confirmPhone(
                                    { phone: pendingPhone, code: phoneCode },
                                    {
                                        onSuccess: () => {
                                            invalidateSelf()
                                            setPhoneCodeStep(false)
                                            setPhoneCode('')
                                        }
                                    }
                                )
                            }
                        >
                            {t('confirmCode')}
                        </Button>
                    </div>
                ) : (
                    <form
                        className="flex flex-col gap-3"
                        onSubmit={phoneForm.handleSubmit((data) => {
                            const digits = data.phoneNumber.replace(/\D/g, '')
                            addPhone(
                                { phoneNumber: digits },
                                {
                                    onSuccess: () => {
                                        setPendingPhone(digits)
                                        setPhoneCodeStep(true)
                                    }
                                }
                            )
                        })}
                    >
                        <Controller
                            control={phoneForm.control}
                            name="phoneNumber"
                            render={({ field }) => (
                                <TextInput
                                    label={t('addPhone')}
                                    type="tel"
                                    leftSection={<Phone size={16} />}
                                    value={field.value}
                                    onBlur={field.onBlur}
                                    onChange={(e) => field.onChange(formatPhoneNumber(e.currentTarget.value))}
                                    error={phoneForm.formState.errors.phoneNumber?.message}
                                />
                            )}
                        />
                        <Button type="submit" loading={isAddPhonePending} className="self-start">
                            {t('addPhone')}
                        </Button>
                    </form>
                )}
            </Surface>
        </div>
    )
}
