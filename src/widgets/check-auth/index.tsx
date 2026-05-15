'use client'

import { useSelf } from '@/entities/user/api/use-self'
import { ROUTES } from '@/shared/router'
import { LoadingPageNext } from '@/shared/ui'
import { useRouter } from 'next/navigation'
import { FC, ReactNode, useEffect } from 'react'
import Cookies from 'js-cookie'
import { GLOBAL_DICTIONARY } from '@/shared/config'
import { usePermissions } from '@/entities/permission/hooks/usePermission'
import { PermissionValue } from '@/entities/permission/const/permission-map'

interface CheckAuthProviderProps {
    children: ReactNode
}

export const CheckAuthProvider: FC<CheckAuthProviderProps> = ({ children }) => {
    const router = useRouter()

    const { isError, isLoading, isSuccess, data } = useSelf()
    const { hasPermission } = usePermissions()

    const refreshToken = Cookies.get(GLOBAL_DICTIONARY.REFRESH_TOKEN)

    if (!refreshToken) {
        router.push(ROUTES.LOGIN)
    }

    useEffect(() => {
        if (isLoading) return

        if ((isError || !refreshToken) && !isLoading) {
            router.push(ROUTES.LOGIN)
            return
        }

        if (isSuccess && data && !hasPermission(PermissionValue.ADMIN_PANEL)) {
            router.push(ROUTES.NOT_ADMIN)
            return
        }
    }, [refreshToken, isError, isLoading, router, isSuccess, data, hasPermission])

    if (isLoading) {
        return <LoadingPageNext />
    }

    if (isSuccess && hasPermission(PermissionValue.ADMIN_PANEL)) {
        return <>{children}</>
    }

    return null
}
