'use client'

import { useSelf } from '@/entities/user/api/use-self'
import { PermissionValueType } from '@/entities/permissions/const/permission-map'
import { usePermissions } from '@/entities/permissions/hooks/usePermission'
import { ROUTES } from '@/shared/router'
import { LoadingPageNext } from '@/shared/ui'
import { useRouter } from '@/i18n/navigation'
import { FC, ReactNode, useEffect } from 'react'

interface PermissionGuardProps {
    permission: PermissionValueType
    children: ReactNode
}

export const PermissionGuard: FC<PermissionGuardProps> = ({ permission, children }) => {
    const router = useRouter()
    const { isLoading, isSuccess, data } = useSelf()
    const { hasPermission } = usePermissions()

    const allowed = isSuccess && data?.info && hasPermission(permission)

    useEffect(() => {
        if (isLoading) return
        if (!isSuccess || !data?.info) {
            router.replace(ROUTES.WELCOME)
            return
        }
        if (data.info.deletedAt) {
            router.replace(ROUTES.WELCOME)
            return
        }
        if (!hasPermission(permission)) {
            router.replace(ROUTES.NOT_ADMIN)
        }
    }, [isLoading, isSuccess, data, hasPermission, permission, router])

    if (isLoading) return <LoadingPageNext />

    if (!allowed || data?.info.deletedAt) return <LoadingPageNext />

    return <>{children}</>
}
