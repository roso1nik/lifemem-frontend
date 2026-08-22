export interface Role {
    id: string
    createdAt: string
    updatedAt: string
    name: string
    isDefault: boolean
}

export const RoleName = {
    USER: 'user',
    ADMIN: 'admin'
} as const

export type RoleNameValue = (typeof RoleName)[keyof typeof RoleName]
