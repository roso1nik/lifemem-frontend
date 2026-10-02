import z from 'zod'
import { AxiosPromise } from 'axios'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import apiClient from '@/shared/api'
import { getApiErrorMessage } from '@/shared/api/errors'
import { ApiQueryKeys } from '@/shared/config'
import { useTranslations } from 'next-intl'

export const askEntrySchema = z.object({
    question: z.string().trim().min(1)
})

export type AskEntryRequest = z.infer<typeof askEntrySchema>

export interface EntryRagSource {
    id: string
    title: string
    textSnippet: string | null
    mediaCount: number
    isHasVoice: boolean
    peopleCount: number
    placesCount: number
    createdAt: string
}

export interface AskEntryResponse {
    answer: string
    sources: EntryRagSource[]
}

const normalizeSnippet = (value: unknown): string | null => {
    if (typeof value === 'string') return value
    if (value == null) return null
    return null
}

export const askEntry = async (data: AskEntryRequest): AxiosPromise<AskEntryResponse> => {
    const parsed = askEntrySchema.parse(data)
    const res = await apiClient.post<AskEntryResponse>('/entry/ask', parsed)
    res.data = {
        answer: res.data.answer,
        sources: (res.data.sources ?? []).map((source) => ({
            ...source,
            textSnippet: normalizeSnippet(source.textSnippet)
        }))
    }
    return res
}

export const useAskEntry = () => {
    const t = useTranslations('home')

    return useMutation({
        mutationKey: [ApiQueryKeys.ASK_ENTRY],
        mutationFn: (data: AskEntryRequest) => askEntry(data).then((res) => res.data),
        onError: (error) => toast.error(getApiErrorMessage(error, t('ask.error')))
    })
}
