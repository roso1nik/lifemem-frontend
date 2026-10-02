import z from 'zod'
import { AxiosPromise } from 'axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useTranslations } from 'next-intl'
import apiClient from '@/shared/api'
import { getApiErrorMessage } from '@/shared/api/errors'
import { ApiQueryKeys } from '@/shared/config'
import { ServiceSettings } from '../model'

export const authMethodUpdateSchema = z.object({
    isRegistrationEnabled: z.boolean().optional(),
    isLoginEnabled: z.boolean().optional(),
    allowAllCountry: z.boolean().optional(),
    countriesWhitelist: z.array(z.string()).optional()
})

export const authMethodsSettingsUpdateSchema = z.object({
    freshCall: authMethodUpdateSchema.optional(),
    google: authMethodUpdateSchema.optional(),
    apple: authMethodUpdateSchema.optional(),
    telegram: authMethodUpdateSchema.optional(),
    email: authMethodUpdateSchema.optional()
})

export const modelTierSettingsUpdateSchema = z.object({
    premium: z.string().uuid().nullable().optional(),
    lite: z.string().uuid().nullable().optional()
})

export const modelsSettingsUpdateSchema = z.object({
    analyze: modelTierSettingsUpdateSchema.optional(),
    embedding: modelTierSettingsUpdateSchema.optional(),
    provider: z.enum(['Polza', 'Openrouter']).optional()
})

export const serviceSettingsUpdateSchema = z.object({
    appVersion: z.number().optional(),
    authMethods: authMethodsSettingsUpdateSchema.optional(),
    models: modelsSettingsUpdateSchema.optional()
})

export type ServiceSettingsUpdateRequest = z.infer<typeof serviceSettingsUpdateSchema>

export const getServiceSettings = async (): AxiosPromise<ServiceSettings> => {
    const res = await apiClient.get('/settings')
    return res
}

export const useGetServiceSettings = () =>
    useQuery({
        queryKey: [ApiQueryKeys.SERVICE_SETTINGS],
        queryFn: () => getServiceSettings().then((res) => res.data),
        retry: false
    })

export const updateServiceSettings = async (data: ServiceSettingsUpdateRequest): AxiosPromise<ServiceSettings> => {
    const res = await apiClient.patch('/settings/set', data)
    return res
}

export const useUpdateServiceSettings = () => {
    const queryClient = useQueryClient()
    const t = useTranslations('admin')

    return useMutation({
        mutationKey: [ApiQueryKeys.UPDATE_SERVICE_SETTINGS],
        mutationFn: (data: ServiceSettingsUpdateRequest) => updateServiceSettings(data),
        onSuccess: (response) => {
            queryClient.setQueryData([ApiQueryKeys.SERVICE_SETTINGS], response.data)
            toast.success(t('toast.settingsSaved'))
        },
        onError: (error) => toast.error(getApiErrorMessage(error, t('toast.settingsFailed')))
    })
}
