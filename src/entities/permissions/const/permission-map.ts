export const PermissionValue = {
    ADMIN_PANEL: 'admin.panel'
} as const

export type PermissionValueType = (typeof PermissionValue)[keyof typeof PermissionValue]
