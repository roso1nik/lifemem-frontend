import { AxiosPromise } from 'axios'
import { useQuery } from '@tanstack/react-query'
import apiClient from '@/shared/api'
import { ApiQueryKeys } from '@/shared/config'
import { Self, User } from '../model'
import { Permission } from '@/entities/permissions/model'
import { Role } from '@/entities/role/model'

type SelfApiPayload = {
    info?: User
    user?: User
    permission?: Permission[]
    role?: Role
}

const normalizeSelf = (data: SelfApiPayload): Self => {
    const info = data.info ?? data.user
    if (!info) {
        throw new Error('Self response missing user/info')
    }
    return {
        info,
        permission: data.permission ?? [],
        role: data.role ?? { id: '', createdAt: '', updatedAt: '', name: '', isDefault: false }
    }
}

export const getSelf = async (): AxiosPromise<Self> => {
    const res = await apiClient.get<SelfApiPayload>('/user/me')
    return {
        ...res,
        data: normalizeSelf(res.data)
    }
}

export const useSelf = () =>
    useQuery({
        queryKey: [ApiQueryKeys.GET_SELF],
        queryFn: () => getSelf().then((res) => res.data),
        staleTime: 60_000,
        retry: false
    })
