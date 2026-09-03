'use client'

import { useSelf } from '@/entities/user/api/use-self'
import { PermissionValueType } from '../const/permission-map'

export const usePermissions = () => {
    const { data: self } = useSelf()

    const hasPermission = (permission: PermissionValueType) => {
        if (!self) return false
        return self.permission?.some((item) => item.key === permission) ?? false
    }

    return { hasPermission }
}

/** @deprecated use usePermissions */
export { usePermissions as usePermission }
