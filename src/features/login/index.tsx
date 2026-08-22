'use client'

import { useLogin, LoginRequest, loginSchema } from '@/entities/user/api/use-login'
import { ROUTES } from '@/shared/router'
import { AuthTabs } from '@/shared/ui'
import { Button, Input, LoadingOverlay, PasswordInput } from '@mantine/core'
import { Lock, Mail } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { useTranslations } from 'next-intl'

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
                        <Input.Wrapper label={t('email')} required error={errors.email?.message} size="sm">
                            <Input
                                type="email"
                                size="md"
                                {...field}
                                placeholder={t('emailPlaceholder')}
                                leftSection={<Mail size={16} />}
                            />
                        </Input.Wrapper>
                    )}
                />
                <Controller
                    control={control}
                    name="password"
                    render={({ field }) => (
                        <Input.Wrapper label={t('password')} required error={errors.password?.message} size="sm">
                            <PasswordInput
                                {...field}
                                size="md"
                                placeholder={t('passwordPlaceholder')}
                                leftSection={<Lock size={16} />}
                            />
                        </Input.Wrapper>
                    )}
                />
                <Button size="md" type="submit" fullWidth loading={isPending}>
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
