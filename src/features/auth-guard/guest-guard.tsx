'use client'

import { useSelf } from '@/entities/user/api/use-self'
import { ROUTES } from '@/shared/router'
import { LoadingPageNext } from '@/shared/ui'
import { useRouter } from '@/i18n/navigation'
import { FC, ReactNode, useEffect } from 'react'

interface GuestGuardProps {
    children: ReactNode
}

export const GuestGuard: FC<GuestGuardProps> = ({ children }) => {
    const router = useRouter()
    const { isLoading, isSuccess, data } = useSelf()

    useEffect(() => {
        if (isLoading) return
        if (isSuccess && data?.info && !data.info.deletedAt) {
            router.replace(ROUTES.HOME_PAGE)
        }
    }, [isLoading, isSuccess, data, router])

    if (isLoading) return <LoadingPageNext />

    if (isSuccess && data?.info && !data.info.deletedAt) return <LoadingPageNext />

    return <>{children}</>
}
