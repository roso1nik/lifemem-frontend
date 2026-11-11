import { AxiosPromise } from 'axios'
import { useQuery } from '@tanstack/react-query'
import apiClient from '@/shared/api'
import { ApiQueryKeys } from '@/shared/config'
import type { FileType } from '@/entities/upload/model'

export type CodeConstants = {
    mobileLifetimeMs: number
    emailLifetimeMs: number
}

export type EntryConstants = {
    maxMediaPerEntry: number
    maxPeoplePerEntry: number
    mediaUrlLifeTime: number
    allowedMediaFileTypes: FileType[]
    allowedAudioFileTypes: FileType[]
}

export type FilesConstants = {
    maxSizeBytes: number
    maxSingleUploadSizeBytes: number
    batchSizeBytes: number
    maxSizeByType: Partial<Record<FileType, number>>
    allowedMimeTypesByType: Partial<Record<FileType, string[]>>
    uploadPresignExpiresInSec: number
    uploadMultipartPresignExpiresInSec: number
}

export type GraphConstants = {
    formulaVersion: number
}

export type LanguageConstants = {
    defaultErrors: 'ru' | 'en'
    defaultMessages: 'ru' | 'en'
    default: 'ru' | 'en'
}

export type ServerConstants = {
    code: CodeConstants
    entry: EntryConstants
    files: FilesConstants
    graph: GraphConstants
    language: LanguageConstants
}

export const getConstants = async (): AxiosPromise<ServerConstants> => {
    const res = await apiClient.get('/constants')
    return res
}

export const useGetConstants = () =>
    useQuery({
        queryKey: [ApiQueryKeys.SERVER_CONSTANTS],
        queryFn: () => getConstants().then((res) => res.data),
        staleTime: 5 * 60_000
    })
