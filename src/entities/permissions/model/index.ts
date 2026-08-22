export interface Permission {
    id: string
    createdAt: string
    updatedAt: string
    key: string
    permissionCategoryId: string | null
}

/** @deprecated use Permission */
export type Permissions = Permission
