import { AxiosPromise } from 'axios'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { ConfirmEmailRequest, confirmEmailSchema } from '../model'
import { ApiQueryKeys } from '@/shared/config'
import { useRouter } from '@/i18n/navigation'
import { ROUTES } from '@/shared/router'

export { confirmEmailSchema }
export type { ConfirmEmailRequest }

/** Stub — replace with apiClient.post('/auth/confirm-email', data) */
export const confirmEmail = async (_data: ConfirmEmailRequest): AxiosPromise<{ ok: boolean }> => {
    await new Promise((r) => setTimeout(r, 400))
    return {
        data: { ok: true },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as never
    }
}

export const useConfirmEmail = () => {
    const router = useRouter()

    return useMutation({
        mutationKey: [ApiQueryKeys.CONFIRM_EMAIL],
        mutationFn: (data: ConfirmEmailRequest) => confirmEmail(data).then((res) => res.data),
        onSuccess: () => {
            toast.success('Email подтверждён (мок)')
            router.push(ROUTES.HOME_PAGE)
        },
        onError: () => toast.error('Неверный код')
    })
}
