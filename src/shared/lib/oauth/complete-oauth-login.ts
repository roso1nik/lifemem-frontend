import { QueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { ApiQueryKeys } from '@/shared/config'
import { ROUTES } from '@/shared/router'

type RouterLike = {
    replace: (href: string) => void
}

export const completeOAuthLogin = (
    queryClient: QueryClient,
    router: RouterLike,
    successMessage: string
) => {
    queryClient.invalidateQueries({ queryKey: [ApiQueryKeys.GET_SELF] })
    toast.success(successMessage)
    router.replace(ROUTES.HOME_PAGE)
}

export const completeOAuthLink = (queryClient: QueryClient) => {
    queryClient.invalidateQueries({ queryKey: [ApiQueryKeys.USER_BINDINGS] })
    queryClient.invalidateQueries({ queryKey: [ApiQueryKeys.GET_SELF] })
}

export const completeOAuthUnlink = (queryClient: QueryClient) => {
    queryClient.invalidateQueries({ queryKey: [ApiQueryKeys.USER_BINDINGS] })
    queryClient.invalidateQueries({ queryKey: [ApiQueryKeys.GET_SELF] })
}

export const isNicknameConflictError = (error: unknown): boolean => {
    if (!error || typeof error !== 'object') return false
    const axiosError = error as { response?: { status?: number; data?: { errors?: { code?: string; message?: string }[] } } }
    if (axiosError.response?.status === 409) return true
    const message = axiosError.response?.data?.errors?.[0]?.message?.toLowerCase() ?? ''
    const code = axiosError.response?.data?.errors?.[0]?.code?.toLowerCase() ?? ''
    return message.includes('nickname') || code.includes('nickname')
}
