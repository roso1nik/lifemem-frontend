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
    m4a: 'audio/mp4',
    aac: 'audio/aac',
    flac: 'audio/flac'
}

/** Strip `;codecs=…` etc. — backend `@IsMimeType()` rejects parameters. */
export const normalizeMimeType = (mime: string): string => {
    const base = mime.trim().toLowerCase().split(';', 1)[0]?.trim() ?? ''
    // Prefer IANA audio/mp4 over legacy audio/x-m4a for validators
    if (base === 'audio/x-m4a' || base === 'audio/m4a') return 'audio/mp4'
    return base
}

export const extensionFromFilename = (filename: string): string | null => {
    const parts = filename.split('.')
    if (parts.length < 2) return null
    const ext = parts.pop()?.toLowerCase()
    return ext && ext.length > 0 ? ext : null
}

/** MIME for API init — must match backend whitelist (not application/octet-stream). */
export const resolveUploadMimeType = (file: File): string => {
    const raw = normalizeMimeType(file.type ?? '')
    if (raw && raw !== 'application/octet-stream') {
        // Recorded voice notes are often `*.webm` with empty/missing type, or wrongly
        // inferred as video/webm from the extension map — keep audio when filename says voice.
        if (raw === 'video/webm' && /^voice[-_.]/i.test(file.name)) return 'audio/webm'
        return raw
    }

    const ext = extensionFromFilename(file.name)
    if (!ext) return ''

    // Voice recordings from MediaRecorder are audio/webm, not video/webm
    if (ext === 'webm' && /^voice[-_.]/i.test(file.name)) return 'audio/webm'

    return EXT_TO_MIME[ext] ?? ''
}
