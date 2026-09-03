export interface LogsUser {
    id: string
    nickname: string
    email?: string
    phoneNumber?: string
}

export interface LogEntry {
    id: string
    createdAt: string
    updatedAt: string
    path: string
    method?: string
    code: number
    duration: number
    userId?: string
    ip?: string
    user?: LogsUser
}
