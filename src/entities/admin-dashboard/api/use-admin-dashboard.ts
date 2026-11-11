import { AxiosPromise } from 'axios'
import { useQuery } from '@tanstack/react-query'
import apiClient from '@/shared/api'
import { ApiQueryKeys } from '@/shared/config'

export type DashboardModelUsage = {
    modelId: string | null
    modelName: string
    inputTokens: number
    outputTokens: number
    requests: number
    avgTimeMs: number | null
    price: number
}

export type AdminDashboard = {
    usersCount: number
    entriesCount: number
    readyEntriesCount: number
    activeUsersCount: number
    mediaCount: number
    uploadedBytes: number
    aiRequestsCount: number
    avgAiTimeMs: number | null
    aiCost: number
    failedJobsCount: number
    tokensByModel: DashboardModelUsage[]
}

export type AdminDashboardParams = {
    from?: string
    to?: string
}

export const getAdminDashboard = async (
    params: AdminDashboardParams = {}
): AxiosPromise<AdminDashboard> => {
    const res = await apiClient.get('/admin/dashboard', {
        params: {
            ...(params.from ? { from: params.from } : {}),
            ...(params.to ? { to: params.to } : {})
        }
    })
    return res
}

export const useAdminDashboard = (params: AdminDashboardParams = {}) =>
    useQuery({
        queryKey: [ApiQueryKeys.ADMIN_DASHBOARD, params.from ?? '', params.to ?? ''],
        queryFn: () => getAdminDashboard(params).then((res) => res.data),
        staleTime: 30_000
    })
