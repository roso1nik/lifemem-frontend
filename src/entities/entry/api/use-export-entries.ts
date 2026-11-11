import { AxiosPromise } from 'axios'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useTranslations } from 'next-intl'
import apiClient, { getApiErrorMessage } from '@/shared/api'
import { ApiQueryKeys } from '@/shared/config'

const filenameFromDisposition = (header?: string): string | null => {
    if (!header) return null
    const utfMatch = /filename\*=UTF-8''([^;]+)/i.exec(header)
    if (utfMatch?.[1]) {
        try {
            return decodeURIComponent(utfMatch[1].trim())
        } catch {
            return utfMatch[1].trim()
        }
    }
    const plainMatch = /filename="?([^";]+)"?/i.exec(header)
    return plainMatch?.[1]?.trim() ?? null
}

export const exportEntries = async (): AxiosPromise<Blob> => {
    const res = await apiClient.get('/entry/export', { responseType: 'blob' })
    return res
}

const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = filename
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    URL.revokeObjectURL(url)
}

export const useExportEntries = () => {
    const t = useTranslations('home.archive')

    return useMutation({
        mutationKey: [ApiQueryKeys.ENTRY_EXPORT],
        mutationFn: async () => {
            const res = await exportEntries()
            const filename =
                filenameFromDisposition(res.headers['content-disposition'] as string | undefined) ??
                'notes.zip'
            downloadBlob(res.data, filename)
            return filename
        },
        onSuccess: () => toast.success(t('exportSuccess')),
        onError: (error) => toast.error(getApiErrorMessage(error, t('exportFailed')))
    })
}
