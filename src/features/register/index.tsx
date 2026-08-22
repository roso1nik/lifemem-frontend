'use client'

import { RegisterRequest, useRegister, registerSchema } from '@/entities/user/api/use-register'
import { AuthTabs } from '@/shared/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, PasswordInput, LoadingOverlay } from '@mantine/core'
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
                        <Input.Wrapper label={t('nickname')} error={errors.nickname?.message}>
                            <Input
                                {...field}
                                size="md"
                                placeholder={t('nicknamePlaceholder')}
                                leftSection={<User size={16} />}
                            />
                        </Input.Wrapper>
                    )}
                />
                <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                        <Input.Wrapper label={t('email')} error={errors.email?.message}>
                            <Input
                                {...field}
                                type="email"
                                size="md"
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
                        <Input.Wrapper label={t('password')} error={errors.password?.message}>
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
                    {t('submitRegister')}
                </Button>
            </form>
            <LoadingOverlay visible={isPending} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} />
        </div>
    )
}

export default RegisterForm
