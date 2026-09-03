import { Permission } from '@/entities/permissions/model'
import { Role } from '@/entities/role/model'

export interface User {
    id: string
    createdAt: string
    updatedAt: string
    nickname: string
    passwordId?: string
    email?: string
    phoneNumber?: string
    isEmailVerified: boolean
    isPhoneVerified: boolean
    roleId: string
    deletedAt: unknown
}

export interface Self {
    info: User
    permission: Permission[]
    role: Role
}

export type OAuthProvider = 'Google' | 'Apple' | 'Telegram'

export interface OAuthBinding {
    createdAt: string
    updatedAt: string
    provider: OAuthProvider
    providerUserId: string
    providerEmail?: string
    providerUsername?: string
    providerAvatarUrl?: string
}
