'use client'

import { useSelf } from '@/entities/user/api/use-self'
import { ROUTES } from '@/shared/router'
import { LoadingPageNext } from '@/shared/ui'
import { useRouter } from '@/i18n/navigation'
import { FC, ReactNode, useEffect } from 'react'
import { usePermissions } from '@/entities/permissions/hooks/usePermission'
import { PermissionValue } from '@/entities/permissions/const/permission-map'

interface CheckAuthProviderProps {
    children: ReactNode
}

export const CheckAuthProvider: FC<CheckAuthProviderProps> = ({ children }) => {
    const router = useRouter()
    const { isLoading, isSuccess, data } = useSelf()
    const { hasPermission } = usePermissions()

    useEffect(() => {
        if (isLoading) return
        if (!isSuccess || !data?.user) {
            router.replace(ROUTES.LOGIN)
            return
        }
        if (!hasPermission(PermissionValue.ADMIN_PANEL)) {
            router.replace(ROUTES.HOME_PAGE)
        }
    }, [isLoading, isSuccess, data, hasPermission, router])

    if (isLoading) return <LoadingPageNext />

    if (isSuccess && data?.user && hasPermission(PermissionValue.ADMIN_PANEL)) {
        return <>{children}</>
    }

    return <LoadingPageNext />
}
