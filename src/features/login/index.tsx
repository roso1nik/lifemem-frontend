'use client'

import { useLogin, LoginRequest, loginSchema } from '@/entities/user/api/use-login'
import { ROUTES } from '@/shared/router'
import { AuthTabs, Button, PasswordInput, TextInput } from '@/shared/ui'
import { Lock, Mail } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { useTranslations } from 'next-intl'
import { LoadingOverlay } from '@mantine/core'

const LoginForm = () => {
    const t = useTranslations('auth')
    const { mutate: login, isPending } = useLogin()
    const {
        handleSubmit,
        formState: { errors },
        control
    } = useForm<LoginRequest>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: '', password: '' }
    })

    return (
        <div className="relative flex flex-col gap-1">
            <AuthTabs active="login" />
            <form className="flex flex-col gap-4" onSubmit={handleSubmit((data) => login(data))}>
                <Controller
                    control={control}
                    name="email"
                    render={({ field }) => (
                        <TextInput
                            {...field}
                            label={t('email')}
                            required
                            error={errors.email?.message}
                            type="email"
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
                            required
                            error={errors.password?.message}
                            placeholder={t('passwordPlaceholder')}
                            leftSection={<Lock size={16} />}
                        />
                    )}
                />
                <Button type="submit" fullWidth loading={isPending}>
                    {t('submitLogin')}
                </Button>
            </form>
            <Link href={ROUTES.FORGOT_PASSWORD} className="text-primary mt-3 self-end text-sm hover:underline">
                {t('forgotPassword')}
            </Link>
            <LoadingOverlay visible={isPending} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} />
        </div>
    )
}

export default LoginForm
