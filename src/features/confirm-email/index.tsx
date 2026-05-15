
'use client'
import { ConfirmEmailRequest, confirmEmailSchema, useConfirmEmail } from '@/entities/user/api/use-confirm-email'
import { useResendCode } from '@/entities/user/api/use-resend-code'
import { useSelf } from '@/entities/user/api/use-self'
import { Link, useRouter } from '@/i18n/navigation'
import { ROUTES } from '@/shared/router'
import { LoadingPageNext } from '@/shared/ui'
import { cn } from '@/shared/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input } from '@mantine/core'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

const ConfirmEmailForm = () => {
    const router = useRouter()
    const [timeLeft, setTimeLeft] = useState(5)

    useEffect(() => {
        if (timeLeft === 0) return
        const interval = setInterval(() => {
            setTimeLeft((prev) => prev - 1)
        }, 1000)

        return () => clearInterval(interval)

    }, [timeLeft])

    const isDisabled = timeLeft > 0

    const searchParams = useSearchParams()
    const email = searchParams.get('email')

    const {
        handleSubmit,
        control,
        formState: { errors }
    } = useForm<ConfirmEmailRequest>({
        resolver: zodResolver(confirmEmailSchema),
        defaultValues: {
            code: ''
        }
    })

    const { mutate: confirmEmail, isPending: isLoadingConfirm } = useConfirmEmail()

    const { isPending: isLoadingResendCode, mutate: resendCode } = useResendCode()
    const { data: user, isLoading } = useSelf()

    useEffect(() => {
        if (user?.isEmailVerified === true) {
            router.push(ROUTES.HOME_PAGE)
        }
    }, [router, user?.isEmailVerified])
    if (isLoading || user?.isEmailVerified) return <LoadingPageNext />


    const onSubmit = async (data: ConfirmEmailRequest) => {
        confirmEmail({
            code: Number(data.code)
        } as any)
    }


    const onResendCode = () => {
        if (isDisabled) return
        resendCode()
        setTimeLeft(5)
    }
    return (

        <div className="flex flex-col gap-3 items-center justify-center ">
            <h1 className="mb-2 text-center text-2xl font-bold">Подтверждение email</h1>
            <p className="text-center text-gray-600">
                Введите код, отправленный на ваш email: {email}
            </p>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    control={control}
                    name='code'
                    render={({ field }) => (
                        <Input.Wrapper label="Код" error={errors.code?.message}>
                            <Input
                                placeholder="------"
                                maxLength={6}
                                type="tel"
                                autoFocus
                                inputMode="numeric"
                                value={field.value}
                                onBlur={field.onBlur}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/[^0-9]/g, '');
                                    field.onChange(value);
                                }}
                                styles={{
                                    input: {
                                        textAlign: 'center',
                                        fontSize: '24px',
                                        letterSpacing: '8px',
                                        fontWeight: 600,
                                        height: '48px'
                                    }

                                }}
                            />
                        </Input.Wrapper>
                    )}
                />

                <Button
                    type="submit"
                    mt="md"
                    fullWidth
                    size="md"
                    loading={isLoadingConfirm}

                >
                    Подтвердить email
                </Button>

                <p
                    className={cn("text-center mt-2", isDisabled ? 'cursor-not-allowed text-gray-400' : 'cursor-pointer text-gray-500')}
                    onClick={isDisabled ? undefined : onResendCode}
                >
                    {isDisabled ? `Повторная отправка через ${timeLeft} секунд` : 'Отправить код снова'}
                </p>
            </form>
            <div className="mt-4 text-center">
                <Link href={ROUTES.LOGIN} className="text-blue-500 hover:underline">
                    Вернуться к входу
                </Link>
            </div>
        </div>
    )
}


export default ConfirmEmailForm