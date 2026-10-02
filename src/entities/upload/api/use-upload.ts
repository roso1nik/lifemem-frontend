import z from 'zod'
import axios, { AxiosPromise, isAxiosError } from 'axios'
import { useMutation } from '@tanstack/react-query'
import apiClient from '@/shared/api'
import { ApiQueryKeys } from '@/shared/config'
import {
    FileType,
    UploadFileStatus,
    assertUploadableFile,
    resolveUploadMimeType,
    sanitizeUploadFilename,
    UploadValidationError
} from '../model'

export const createUploadSchema = z.object({
    type: z.enum(['IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT', 'OTHER']),
    filename: z.string().min(3).max(255),
    size: z.number().positive(),
    mimeType: z.string().min(1)
})

export type CreateUploadRequest = z.infer<typeof createUploadSchema>

export interface CreateUploadResponse {
    id: string
    isMultipart: boolean
    partSizeBytes?: number
    totalParts?: number
    uploadUrl?: string
}

export interface UploadBatchRequest {
    parts: number[]
}

export interface UploadBatchPart {
    partNumber: number
    url: string
}

export interface UploadBatchResponse {
    parts: UploadBatchPart[]
}

export interface CompleteUploadResponse {
    fileId: string
    status: UploadFileStatus
}

export const createUpload = async (data: CreateUploadRequest): AxiosPromise<CreateUploadResponse> => {
    const res = await apiClient.post('/uploads', data)
    return res
}

export const requestUploadBatch = async (
    id: string,
    data: UploadBatchRequest
): AxiosPromise<UploadBatchResponse> => {
    const res = await apiClient.post(`/uploads/${id}/batch`, data)
    return res
}

export const completeUpload = async (id: string): AxiosPromise<CompleteUploadResponse> => {
    const res = await apiClient.post(`/uploads/${id}/complete`)
    return res
}

/** PUT bytes to presigned storage URL (no API cookies / auth). */
const putToStorage = async (url: string, blob: Blob, contentType?: string) => {
    try {
        await axios.put(url, blob, {
            withCredentials: false,
            maxBodyLength: Infinity,
            maxContentLength: Infinity,
            headers: contentType ? { 'Content-Type': contentType } : undefined,
            transformRequest: [(data) => data]
        })
    } catch (error) {
        if (isAxiosError(error) && !error.response) {
            throw new UploadValidationError(
                'Storage upload blocked (network or CORS). Check browser devtools Network tab.'
            )
        }
        throw error
    }
}

export type UploadFileOptions = {
    allowedTypes: FileType[]
    onProgress?: (ratio: number) => void
}

export const uploadFile = async (file: File, options: UploadFileOptions): Promise<string> => {
    const mimeType = resolveUploadMimeType(file)
    if (!mimeType) {
        throw new UploadValidationError('Unsupported file type')
    }

    const type = assertUploadableFile(file, options.allowedTypes, mimeType)
    const filename = sanitizeUploadFilename(file.name)

    const sessionRes = await createUpload({
        type,
        filename,
        size: file.size,
        mimeType
    })
    const session = sessionRes.data

    if (!session.isMultipart) {
        if (!session.uploadUrl) {
            throw new UploadValidationError('Upload URL missing')
        }
        await putToStorage(session.uploadUrl, file, mimeType)
        options.onProgress?.(0.9)
    } else {
        const partSize = session.partSizeBytes
        const totalParts = session.totalParts
        if (!partSize || !totalParts || totalParts < 1) {
            throw new UploadValidationError('Invalid multipart upload session')
        }

        const partNumbers = Array.from({ length: totalParts }, (_, i) => i + 1)
        const batchRes = await requestUploadBatch(session.id, { parts: partNumbers })
        const batch = batchRes.data

        const parts = [...batch.parts].sort((a, b) => a.partNumber - b.partNumber)
        let finished = 0
        for (const part of parts) {
            const start = (part.partNumber - 1) * partSize
            const end = Math.min(start + partSize, file.size)
            await putToStorage(part.url, file.slice(start, end))
            finished += 1
            options.onProgress?.(finished / totalParts)
        }
    }

    const doneRes = await completeUpload(session.id)
    const done = doneRes.data
    options.onProgress?.(1)

    if (!done.fileId) {
        throw new UploadValidationError('Upload complete did not return fileId')
    }

    return done.fileId
}

export const useUploadFile = () =>
    useMutation({
        mutationKey: [ApiQueryKeys.UPLOAD_FILE],
        mutationFn: ({ file, allowedTypes }: { file: File; allowedTypes: FileType[] }) =>
            uploadFile(file, { allowedTypes })
    })
