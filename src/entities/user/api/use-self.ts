import { useQuery } from '@tanstack/react-query'
import Cookies from 'js-cookie'
import { User } from '../model'
import { ApiQueryKeys, GLOBAL_DICTIONARY } from '@/shared/config'
import { RoleName } from '@/entities/role/model'

const MOCK_USER: User = {
    id: 'mock-user-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    nickname: 'you',
    passwordId: 'mock-password',
    email: 'you@lifemem.app',
    phoneNumber: null,
    isEmailVerified: true,
    isPhoneVerified: false,
    roleId: RoleName.ADMIN,
    deletedAt: null
}

/** Stub — replace with apiClient.get('/users/me') */
export const getSelf = async (): Promise<User> => {
    await new Promise((r) => setTimeout(r, 150))
    const token = typeof window !== 'undefined' ? Cookies.get(GLOBAL_DICTIONARY.ACCESS_TOKEN) : undefined
    if (!token) {
        // Design mode: still return mock user so main UI is viewable without login
        return MOCK_USER
    }
    if (token.includes('admin')) {
        return { ...MOCK_USER, nickname: 'admin', roleId: RoleName.ADMIN }
    }
    return MOCK_USER
}

export const useSelf = () => {
    return useQuery({
        queryKey: [ApiQueryKeys.GET_SELF],
        queryFn: getSelf,
        staleTime: 60_000
    })
}
