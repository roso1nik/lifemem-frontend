'use client'

import { RegisterRequest, useRegister, registerSchema } from '@/entities/user/api/use-register'
import { AuthTabs, Button, PasswordInput, TextInput } from '@/shared/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoadingOverlay } from '@mantine/core'
import { Mail, Lock, User } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslations } from 'next-intl'

const RegisterForm = () => {
    const t = useTranslations('auth')
    const { mutate: register, isPending } = useRegister()
    const {
        handleSubmit,
        formState: { errors },
        control
    } = useForm<RegisterRequest>({
        resolver: zodResolver(registerSchema),
        defaultValues: { nickname: '', email: '', password: '' }
    })

    return (
        <div className="relative flex flex-col gap-1">
            <AuthTabs active="register" />
            <form className="flex flex-col gap-4" onSubmit={handleSubmit((data) => register(data))}>
                <Controller
                    name="nickname"
                    control={control}
                    render={({ field }) => (
                        <TextInput
                            {...field}
                            label={t('nickname')}
                            error={errors.nickname?.message}
                            placeholder={t('nicknamePlaceholder')}
                            leftSection={<User size={16} />}
                        />
                    )}
                />
                <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                        <TextInput
                            {...field}
                            type="email"
                            label={t('email')}
                            error={errors.email?.message}
                            placeholder={t('emailPlaceholder')}
                            leftSection={<Mail size={16} />}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="password"
                    render={({ field }) => (
                        <PasswordInput
                            {...field}
                            label={t('password')}
                            error={errors.password?.message}
                            placeholder={t('passwordPlaceholder')}
                            leftSection={<Lock size={16} />}
                        />
                    )}
                />
                <Button type="submit" fullWidth loading={isPending}>
                    {t('submitRegister')}
                </Button>
            </form>
            <LoadingOverlay visible={isPending} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} />
        </div>
    )
}

export default RegisterForm
