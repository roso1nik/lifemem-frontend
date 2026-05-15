'use client'
import { useLogin, LoginRequest, loginSchema } from '@/entities/user/api/use-login'
import { ROUTES } from '@/shared/router'
import { Button, Input, LoadingOverlay, PasswordInput } from '@mantine/core'
import { Lock, Mail } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'

const LoginForm = () => {
    const { mutate: login, isPending: isLoadingLogin } = useLogin()
    const {
        handleSubmit,
        formState: { errors },
        control
    } = useForm<LoginRequest>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    })

    const onSubmit = async (data: LoginRequest) => {
        login(data)
    }
    return (
        <div className="flex flex-col gap-3">
            <div className="mb-4 flex w-full flex-row gap-1">
                <Link href={ROUTES.LOGIN} className="w-full!">
                    <Button className="dark:color-black! color-white! w-full! bg-white! dark:bg-white!" size="md">
                        Вход
                    </Button>
                </Link>
                <Link href={ROUTES.REGISTER} className="w-full!">
                    <Button className="w-full!" color="gray" size="md">
                        Регистрация
                    </Button>
                </Link>
            </div>
            <form className='' onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4 flex flex-col gap-3">
                    <Controller
                        control={control}
                        name="email"
                        render={({ field }) => (
                            <Input.Wrapper label="Почта" required error={errors.email?.message} size='sm' >
                                <Input
                                    type='email'
                                    size="lg"
                                    {...field}
                                    placeholder="example@mail.com"
                                    leftSection={<Mail size={18} />}
                                />
                            </Input.Wrapper>
                        )}
                    />
                    <Controller
                        control={control}
                        name="password"
                        render={({ field }) => (
                            <Input.Wrapper label="Пароль" required error={errors.password?.message} size='sm' >
                                <PasswordInput
                                    {...field}
                                    type='password'
                                    size="lg"
                                    placeholder="Введите пароль"
                                    leftSection={<Lock size={18} />}
                                />

                            </Input.Wrapper>
                        )}
                    />
                </div>
                <Button size="lg" radius="xl" className='w-full!' type="submit">
                    Войти
                </Button>

            </form>
            <Link href={ROUTES.FORGOT_PASSWORD} className="w-full text-end">
                <Button variant="outline">Забыли пароль?</Button>
            </Link>

            <LoadingOverlay
                visible={isLoadingLogin}
                zIndex={1000}
                overlayProps={{ radius: 'sm', blur: 2 }}
            />

        </div>
    )
}

export default LoginForm
