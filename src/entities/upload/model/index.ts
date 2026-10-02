import { normalizeMimeType } from './mime'

export type FileType = 'IMAGE' | 'VIDEO' | 'AUDIO' | 'DOCUMENT' | 'OTHER'

export type UploadFileStatus = 'READY' | string

const MB = 1024 * 1024

export const UPLOAD_MAX_BYTES: Record<Exclude<FileType, 'OTHER'>, number> = {
    IMAGE: 20 * MB,
    VIDEO: 1024 * MB,
    AUDIO: 200 * MB,
    DOCUMENT: 50 * MB
}

export const PRODUCT_MEDIA_TYPES: FileType[] = ['IMAGE', 'VIDEO']
export const PRODUCT_VOICE_TYPES: FileType[] = ['AUDIO']

const IMAGE_MIME = new Set([
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/heic',
    'image/heif'
])

const VIDEO_MIME = new Set([
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'video/3gpp',
    'video/x-msvideo'
])

const AUDIO_MIME = new Set([
    'audio/webm',
    'audio/mpeg',
    'audio/mp4',
    'audio/wav',
    'audio/ogg',
    'audio/aac',
    'audio/x-m4a',
    'audio/flac'
])

const DOCUMENT_MIME = new Set([
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.oasis.opendocument.text'
])

export const resolveFileType = (mimeType: string): FileType | null => {
    const mime = normalizeMimeType(mimeType)
    if (!mime) return null
    if (IMAGE_MIME.has(mime) || mime.startsWith('image/')) return 'IMAGE'
    if (VIDEO_MIME.has(mime) || mime.startsWith('video/')) return 'VIDEO'
    if (AUDIO_MIME.has(mime) || mime.startsWith('audio/')) return 'AUDIO'
    if (DOCUMENT_MIME.has(mime)) return 'DOCUMENT'
    return null
}

export {
    resolveUploadMimeType,
    extensionFromFilename,
    normalizeMimeType
} from './mime'

export const sanitizeUploadFilename = (name: string): string => {
    const cleaned = name.replace(/[\\/]/g, '_').replace(/\.\./g, '_').trim()
    if (cleaned.length < 3) return `file-${Date.now()}.bin`
    return cleaned.slice(0, 255)
}

export class UploadValidationError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'UploadValidationError'
    }
}

export const assertUploadableFile = (file: File, allowed: FileType[], mimeType?: string): FileType => {
    const mime = mimeType ?? file.type
    const type = resolveFileType(mime)
    if (!type || type === 'OTHER' || !allowed.includes(type)) {
        throw new UploadValidationError('Unsupported file type')
    }
    const max = UPLOAD_MAX_BYTES[type as Exclude<FileType, 'OTHER'>]
    if (file.size > max) {
        throw new UploadValidationError('File exceeds size limit')
    }
    const filename = sanitizeUploadFilename(file.name)
    if (filename.length < 3 || filename.length > 255) {
        throw new UploadValidationError('Invalid file name')
    }
    return type
}
