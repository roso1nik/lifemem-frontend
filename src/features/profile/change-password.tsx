'use client'

import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { KeyRound } from 'lucide-react'
import {
    changePasswordSchema,
    useChangePassword,
    type ChangePasswordRequest
} from '@/entities/auth/api/use-change-password'
import { Button, PasswordInput } from '@/shared/ui'
import z from 'zod'

const formSchema = changePasswordSchema
    .extend({
        confirmPassword: z.string().min(1)
    })
    .refine((values) => values.newPassword === values.confirmPassword, {
        path: ['confirmPassword'],
        message: 'mismatch'
    })

type FormValues = z.infer<typeof formSchema>

export const ChangePasswordForm = () => {
    const t = useTranslations('profile')
    const { mutate: changePassword, isPending } = useChangePassword()

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            oldPassword: '',
            newPassword: '',
            confirmPassword: ''
        }
    })

    const onSubmit = (values: FormValues) => {
        const payload: ChangePasswordRequest = {
            oldPassword: values.oldPassword,
            newPassword: values.newPassword
        }
        changePassword(payload, {
            onSuccess: () => form.reset()
        })
    }

    const confirmError =
        form.formState.errors.confirmPassword?.message === 'mismatch'
            ? t('passwordMismatch')
            : form.formState.errors.confirmPassword?.message

    return (
        <form className="flex flex-col gap-3" onSubmit={form.handleSubmit(onSubmit)}>
            <Controller
                control={form.control}
                name="oldPassword"
                render={({ field }) => (
                    <PasswordInput
                        {...field}
                        label={t('oldPassword')}
                        required
                        error={form.formState.errors.oldPassword?.message}
                        leftSection={<KeyRound size={16} />}
                    />
                )}
            />
            <Controller
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                    <PasswordInput
                        {...field}
                        label={t('newPassword')}
                        required
                        error={form.formState.errors.newPassword?.message}
                        leftSection={<KeyRound size={16} />}
                    />
                )}
            />
            <Controller
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                    <PasswordInput
                        {...field}
                        label={t('confirmPassword')}
                        required
                        error={confirmError}
                        leftSection={<KeyRound size={16} />}
                    />
                )}
            />
            <p className="text-muted-foreground text-xs leading-relaxed">{t('passwordHint')}</p>
            <div className="flex justify-end">
                <Button
                    type="submit"
                    loading={isPending}
                    disabled={!form.formState.isDirty}
                    className="rounded-full"
                >
                    {t('changePassword')}
                </Button>
            </div>
        </form>
    )
}
