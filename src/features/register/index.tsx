'use client'

import { RegisterRequest, useRegister, registerSchema } from '@/entities/user/api/use-register'
import { ROUTES } from '@/shared/router'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, PasswordInput, LoadingOverlay, Select } from '@mantine/core'
import { Mail, Lock, User, UserPen, Calendar } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { Controller, useForm } from 'react-hook-form'
import { PROFILE_MODE_OPTIONS } from '@/shared/config/constants'
import { DatePickerInput } from '@mantine/dates'
import { ProfileMode } from '@/entities/user/model/auth'
const RegisterForm = () => {

    const {
        handleSubmit,
        formState: { errors },
        control
    } = useForm<RegisterRequest>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            username: '',
            email: '',
            profileMode: ProfileMode.Public,
            birthday: '',
            password: ''
        }
    })

    const { mutate: register, isPending: isLoadingRegister } = useRegister()

    const onSubmit = async (data: RegisterRequest) => {
        register(data)
    }

    return (
        <div className="flex flex-col gap-3">
            <div className="mb-4 flex w-full flex-row gap-1">
                <Link href={ROUTES.LOGIN} className="w-full!">
                    <Button className="w-full!" size="md" color="gray">
                        Вход
                    </Button>
                </Link>
                <Link href={ROUTES.REGISTER} className="w-full!">
                    <Button className="dark:color-black! color-white! w-full! bg-white! dark:bg-white!" size="md">
                        Регистрация
                    </Button>
                </Link>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>

                <div className="mb-4 flex flex-col gap-3">
                    <Controller
                        name='username'
                        control={control}
                        render={({ field }) => (
                            <Input.Wrapper label='Имя пользователя' error={errors.username?.message}>
                                <Input
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    value={field.value}
                                    size="lg"
                                    placeholder="Имя пользователя..."
                                    leftSection={<User size={18} />}
                                />
                            </Input.Wrapper>

                        )}
                    />

                    <Controller
                        name='email'
                        control={control}
                        render={({ field }) => (
                            <Input.Wrapper label='Почта' error={errors.email?.message}>
                                <Input
                                    onBlur={field.onBlur}
                                    value={field.value}
                                    onChange={field.onChange}
                                    size="lg"
                                    placeholder="Почта..."
                                    leftSection={<Mail size={18} />}
                                />
                            </Input.Wrapper>
                        )}
                    />

                    <Controller
                        name='profileMode'
                        control={control}
                        render={({ field }) => (
                            <Input.Wrapper label='Тип профиля' error={errors.profileMode?.message}>
                                <Select
                                    onBlur={field.onBlur}
                                    value={field.value}
                                    onChange={field.onChange}
                                    size="lg"
                                    placeholder="Выбери тип профиля"
                                    leftSection={<UserPen size={18} />}
                                    data={PROFILE_MODE_OPTIONS}
                                />
                            </Input.Wrapper>
                        )}
                    />

                    <Controller
                        name='birthday'
                        control={control}
                        render={({ field }) => (
                            <Input.Wrapper label='Дата рождения' error={errors.birthday?.message}>
                                <DatePickerInput
                                    onBlur={field.onBlur}
                                    value={field.value ? new Date(field.value) : null}
                                    onChange={(date) => {
                                        field.onChange(date)
                                    }}
                                    size="lg"
                                    placeholder="Выберите дату рождения"
                                    valueFormat="DD.MM.YYYY"
                                    clearable
                                    maxDate={new Date()}
                                    leftSection={<Calendar size={18} />}

                                />
                            </Input.Wrapper>
                        )}
                    />

                    <Controller
                        control={control}
                        name='password'
                        render={({ field }) => (
                            <Input.Wrapper label='Пароль' error={errors.password?.message}>
                                <PasswordInput
                                    size="lg"
                                    placeholder="Пароль"
                                    leftSection={<Lock size={18} />}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    value={field.value}
                                />

                            </Input.Wrapper>

                        )}
                    />
                </div>
                <Button size="lg" radius="xl" type='submit'>
                    Создать аккаунт
                </Button>

            </form>

            <LoadingOverlay
                visible={isLoadingRegister}
                zIndex={1000}
                overlayProps={{ radius: 'sm', blur: 2 }}
            />
        </div>
    )
}

export default RegisterForm
