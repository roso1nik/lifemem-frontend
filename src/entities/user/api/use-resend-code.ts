import { AxiosPromise } from 'axios'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { ApiQueryKeys } from '@/shared/config'

/** Stub — replace with apiClient.post('/auth/confirm-email/resend') */
export const resendCode = async (): AxiosPromise<{ ok: boolean }> => {
    await new Promise((r) => setTimeout(r, 300))
    return {
        data: { ok: true },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as never
    }
}

export const useResendCode = () => {
    return useMutation({
        mutationKey: [ApiQueryKeys.CONFIRM_EMAIL_RESEND],
        mutationFn: () => resendCode().then((res) => res.data),
        onSuccess: () => toast.success('Код отправлен (мок)'),
        onError: () => toast.error('Не удалось отправить код')
    })
}
