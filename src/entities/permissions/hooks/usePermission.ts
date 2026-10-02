'use client'

import { useSelf } from '@/entities/user/api/use-self'
import { RoleName } from '@/entities/role/model'
import { PermissionValue, PermissionValueType } from '../const/permission-map'

export const usePermissions = () => {
    const { data: self } = useSelf()

    const hasPermission = (permission: PermissionValueType) => {
        if (!self) return false
        if (self.permission?.some((item) => item.key === permission)) return true
        // Fallback when backend grants admin via role name without admin.panel key
        if (permission === PermissionValue.ADMIN_PANEL && self.role?.name === RoleName.ADMIN) {
            return true
        }
        return false
    }

    return { hasPermission }
}

/** @deprecated use usePermissions */
export { usePermissions as usePermission }
