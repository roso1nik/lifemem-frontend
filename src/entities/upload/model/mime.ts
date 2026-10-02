const EXT_TO_MIME: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    gif: 'image/gif',
    heic: 'image/heic',
    heif: 'image/heif',
    mp4: 'video/mp4',
    webm: 'video/webm',
    mov: 'video/quicktime',
    m4v: 'video/mp4',
    '3gp': 'video/3gpp',
    avi: 'video/x-msvideo',
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    ogg: 'audio/ogg',
    m4a: 'audio/x-m4a',
    aac: 'audio/aac',
    flac: 'audio/flac'
}

export const extensionFromFilename = (filename: string): string | null => {
    const parts = filename.split('.')
    if (parts.length < 2) return null
    const ext = parts.pop()?.toLowerCase()
    return ext && ext.length > 0 ? ext : null
}

/** MIME for API init — must match backend whitelist (not application/octet-stream). */
export const resolveUploadMimeType = (file: File): string => {
    const raw = file.type?.trim().toLowerCase()
    if (raw && raw !== 'application/octet-stream') return raw

    const ext = extensionFromFilename(file.name)
    if (ext && EXT_TO_MIME[ext]) return EXT_TO_MIME[ext]

    return ''
}
