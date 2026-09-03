'use client'

import { useSelf } from '@/entities/user/api/use-self'
import { ROUTES } from '@/shared/router'
import { LoadingPageNext } from '@/shared/ui'
import { useRouter } from '@/i18n/navigation'
import { FC, ReactNode, useEffect } from 'react'
import { RestoreAccountScreen } from '@/features/profile/restore-account'

interface AuthGuardProps {
    children: ReactNode
}

export const AuthGuard: FC<AuthGuardProps> = ({ children }) => {
    const router = useRouter()
    const { isLoading, isSuccess, data, isError } = useSelf()

    useEffect(() => {
        if (isLoading) return
        if (!isSuccess || !data?.info) {
            router.replace(ROUTES.WELCOME)
        }
    }, [isLoading, isSuccess, data, router])

    if (isLoading) return <LoadingPageNext />

    if (isError || !data?.info) return <LoadingPageNext />

    if (data.info.deletedAt) {
        return <RestoreAccountScreen />
    }

    return <>{children}</>
}
