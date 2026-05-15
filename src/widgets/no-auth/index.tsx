import { ROUTES } from '@/shared/router'
import { Button, Text } from '@mantine/core'
import { Link } from '@/i18n/navigation'

export const NoAuthPage = () => {
    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
            <h1 className="text-xl font-bold">Доступ ограничен</h1>

            <Text c="dimmed" size="sm">
                Войдите в аккаунт, чтобы открыть настройки
            </Text>

            <Link href={ROUTES.LOGIN}>
                <Button size="md">Войти</Button>
            </Link>
        </div>
    )
}
