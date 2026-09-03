'use client'

import { useLogout } from '@/entities/auth/api/use-logout'
import { useRestoreUser } from '@/entities/user/api/use-restore'
import { useSelf } from '@/entities/user/api/use-self'
import { Button } from '@/shared/ui'
import { dayjsInstance } from '@/shared/utils'
import { useTranslations } from 'next-intl'

export const RestoreAccountScreen = () => {
    const t = useTranslations('profile')
    const { data: self } = useSelf()
    const { mutate: restore, isPending } = useRestoreUser()
    const { mutate: logout } = useLogout()

    const deletedAt = self?.info.deletedAt
    const deletedDaysAgo =
        deletedAt && typeof deletedAt === 'string' ? dayjsInstance().diff(dayjsInstance(deletedAt), 'day') : null

    return (
        <div className="bg-background flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
            <h1 className="text-xl font-semibold tracking-tight">{t('restoreTitle')}</h1>
            <p className="text-muted-foreground max-w-sm text-sm">
                {deletedDaysAgo !== null ? t('restoreBody', { days: deletedDaysAgo }) : t('restoreBodyGeneric')}
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
                <Button loading={isPending} onClick={() => restore()}>
                    {t('restore')}
                </Button>
                <Button variant="subtle" onClick={() => logout(undefined)}>
                    {t('logout')}
                </Button>
            </div>
        </div>
    )
}
