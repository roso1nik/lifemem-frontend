'use client'

import { useSelf } from '@/entities/user/api/use-self'
import { PermissionValue, PermissionValueType } from '../const/permission-map'
import { RoleName } from '@/entities/role/model'

/**
 * Stub until permissions API is wired.
 * Treats mock admin user / role name "admin" as having admin panel access.
 */
export const usePermissions = () => {
    const { data: user } = useSelf()

    const hasPermission = (permission: PermissionValueType) => {
        if (!user) return false
        if (permission === PermissionValue.ADMIN_PANEL) {
            return user.roleId === RoleName.ADMIN || user.nickname === 'admin'
        }
        return false
    }

    return { hasPermission }
}
