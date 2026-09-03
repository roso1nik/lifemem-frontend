export type AuthLogType = 'Oauth' | 'Phone' | 'Email'

export interface AuthLogUser {
    id: string
    nickname: string
    email?: string
    phoneNumber?: string
}

export interface AuthLog {
    id: string
    createdAt: string
    updatedAt: string
    type: AuthLogType
    ip: string
    userId: string
    user?: AuthLogUser
}
