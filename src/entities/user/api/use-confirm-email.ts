import z from 'zod'
import { AxiosPromise } from 'axios'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import apiClient from '@/shared/api'
import { ApiQueryKeys } from '@/shared/config'
import { useRouter } from '@/i18n/navigation'
import { ROUTES } from '@/shared/router'
import { AlertBaseDto, emailSchema } from '@/shared/types'

export const confirmEmailSchema = z.object({
    email: emailSchema,
    code: z.string().min(4).max(8).regex(/^\d+$/)
})

export type ConfirmEmailRequest = z.infer<typeof confirmEmailSchema>

export const confirmEmail = async (data: ConfirmEmailRequest): AxiosPromise<AlertBaseDto> => {
    const res = await apiClient.post('/user/confirm-email', data)
    return res
}

export const useConfirmEmail = () => {
    const router = useRouter()

    return useMutation({
        mutationKey: [ApiQueryKeys.CONFIRM_EMAIL],
        mutationFn: (data: ConfirmEmailRequest) => confirmEmail(data),
        onSuccess: (response) => {
            toast.success(response.data.message || 'Email подтверждён')
            router.push(ROUTES.HOME_PAGE)
        },
        onError: () => toast.error('Неверный код')
    })
}
