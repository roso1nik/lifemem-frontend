import { AxiosPromise } from 'axios'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { RegisterRequest, registerSchema, AuthTokens } from '../model'
import { ApiQueryKeys } from '@/shared/config'
import { useRouter } from '@/i18n/navigation'
import { ROUTES } from '@/shared/router'

export { registerSchema }
export type { RegisterRequest }

/** Stub — replace with apiClient.post('/auth/register', data) */
export const register = async (data: RegisterRequest): AxiosPromise<AuthTokens> => {
    await new Promise((r) => setTimeout(r, 400))
    return {
        data: { accessToken: `mock-access-${data.email}` },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as never
    }
}

export const useRegister = () => {
    const router = useRouter()

    return useMutation({
        mutationKey: [ApiQueryKeys.REGISTER],
        mutationFn: (data: RegisterRequest) => register(data).then((res) => res.data),
        onSuccess: (_tokens, variables) => {
            toast.success('Аккаунт создан (мок)')
            router.push(`${ROUTES.CONFIRM_PAGE}?email=${encodeURIComponent(variables.email)}`)
        },
        onError: () => toast.error('Не удалось зарегистрироваться')
    })
}
