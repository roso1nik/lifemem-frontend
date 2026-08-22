import { AxiosPromise } from 'axios'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import Cookies from 'js-cookie'
import { LoginRequest, loginSchema, AuthTokens } from '../model'
import { ApiQueryKeys, GLOBAL_DICTIONARY } from '@/shared/config'
import { useRouter } from '@/i18n/navigation'
import { ROUTES } from '@/shared/router'

export { loginSchema }
export type { LoginRequest }

/** Stub — replace with apiClient.post('/auth/login', data) */
export const login = async (data: LoginRequest): AxiosPromise<AuthTokens> => {
    await new Promise((r) => setTimeout(r, 400))
    return {
        data: { accessToken: `mock-access-${data.email}` },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as never
    }
}

export const useLogin = () => {
    const router = useRouter()

    return useMutation({
        mutationKey: [ApiQueryKeys.LOGIN],
        mutationFn: (data: LoginRequest) => login(data).then((res) => res.data),
        onSuccess: (tokens) => {
            Cookies.set(GLOBAL_DICTIONARY.ACCESS_TOKEN, tokens.accessToken)
            toast.success('Вход выполнен (мок)')
            router.push(ROUTES.HOME_PAGE)
        },
        onError: () => toast.error('Не удалось войти')
    })
}
