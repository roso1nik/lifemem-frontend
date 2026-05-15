import { ROUTES } from '@/shared/router'
import { Button, Input, PasswordInput } from '@mantine/core'
import { Mail, User, Lock } from 'lucide-react'
import { Link } from '@/i18n/navigation'

const ForgotPasswordPage = () => {
    return (
        <div className="flex flex-col gap-3">
            <div className="mb-4 flex w-full flex-row gap-1">
                <Link href={ROUTES.LOGIN} className="w-full!">
                    <Button className="w-full!" size="md" color="gray">
                        Вход
                    </Button>
                </Link>
                <Link href={ROUTES.REGISTER} className="w-full!">
                    <Button size="md" color="gray" className="w-full!">
                        Регистрация
                    </Button>
                </Link>
            </div>
            <div className="mb-4 flex flex-col gap-3">
                <Input size="lg" placeholder="Почта или имя пользователя" leftSection={<User size={18} />} />
                <p>Введите почту или имя пользователя от Вашего аккаунта для восстановления доступа</p>
            </div>
            <Button size="lg" radius="xl">
                Войти
            </Button>
        </div>
    )
}

export default ForgotPasswordPage
