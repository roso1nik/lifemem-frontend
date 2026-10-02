export type FormattedTextFormat = 'plain' | 'markdown' | 'html'

export type EntryProcessingJobType =
    | 'Stt'
    | 'Vision'
    | 'LocationConnect'
    | 'LocationAndPeopleDetect'
    | 'EmbedText'
    | 'EmbedTitle'
    | 'EmbedMedia'
    | 'SlicePreview'

export type EntryProcessingJobStatus = 'Pending' | 'Running' | 'Done' | 'Failed' | 'Cancelled'

export interface EntryMedia {
    id: string
    createdAt: string
    updatedAt: string
    fileId: string
    description: unknown
    url: string
    /** Signed preview of the first frame for VIDEO; null for images / while SlicePreview runs */
    firstFrameUrl: string | null
}

/** @deprecated use EntryMedia */
export type EntryImage = EntryMedia

export interface EntryVoice {
    id: string
    createdAt: string
    updatedAt: string
    fileId: string
    url: string
}

export interface EntryRelation {
    id: string
    name: string
}

export interface EntryProcessingStatus {
    done: number
    total: number
    error: number
}

export interface EntryProcessingJob {
    id: string
    createdAt: string
    updatedAt: string
    type: EntryProcessingJobType
    status: EntryProcessingJobStatus
    errorMessages: string[]
}

export interface EntryDetailPerson {
    id: string
    name: string
    createdAt: string
}

export interface EntryDetailPlace {
    id: string
    name: string
    createdAt: string
}

/** List/search item (EntrySearchItemDto) */
export interface EntrySearchItem {
    id: string
    title: string
    text: string | null
    formattedText: string | null
    formattedTextFormat: FormattedTextFormat | null
    createdAt: string
    isHasVoice: boolean
    mediaCount: number
    isReady: boolean
    processingStatus: EntryProcessingStatus
    peopleCount: number
    placesCount: number
}

/** Full note (EntryDetailResponseDto) */
export interface EntryDetail {
    id: string
    createdAt: string
    updatedAt: string
    userId: string
    title: string
    text: string | null
    formattedText: string | null
    formattedTextFormat: FormattedTextFormat | null
    isReady: boolean
    voice: EntryVoice | null
    media: EntryMedia[]
    jobs: EntryProcessingJob[]
    people: EntryDetailPerson[]
    places: EntryDetailPlace[]
}

/** Base entry after PATCH /entry/:id/base (BaseEntryDto) */
export interface Entry {
    id: string
    createdAt: string
    updatedAt: string
    title: string
    text: string | null
    formattedText: string | null
    formattedTextFormat: FormattedTextFormat | null
    isHasVoice: boolean
    media: EntryMedia[]
    isReady: boolean
    peoples: EntryRelation[]
    places: EntryRelation[]
}

type EntryPreviewSource = {
    title: string
    text: string | null
    formattedText?: string | null
}

const stripHtml = (html: string): string =>
    html
        .replace(/<br\s*\/?>/gi, ' ')
        .replace(/&nbsp;/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()

export const getEntryPreviewText = (entry: EntryPreviewSource): string => {
    const formatted = entry.formattedText?.trim() ? stripHtml(entry.formattedText) : ''
    if (formatted) return formatted
    const fromText = entry.text?.trim() ? stripHtml(entry.text) : ''
    return fromText || entry.title?.trim() || ''
}

export const getEntryAttachmentCount = (entry: EntrySearchItem): number =>
    entry.mediaCount + (entry.isHasVoice ? 1 : 0) + entry.placesCount

const VIDEO_URL_RE = /\.(mp4|webm|mov|m4v|avi|3gp|quicktime)(\?|#|$)/i

export const isEntryMediaVideo = (media: Pick<EntryMedia, 'url' | 'firstFrameUrl'>): boolean => {
    if (typeof media.firstFrameUrl === 'string' && media.firstFrameUrl.length > 0) return true
    return VIDEO_URL_RE.test(media.url)
}

export const entryNeedsProcessingPoll = (entry: EntryDetail): boolean => {
    if (!entry.isReady) return true
    return entry.media.some(
        (item) => isEntryMediaVideo(item) && !(typeof item.firstFrameUrl === 'string' && item.firstFrameUrl)
    )
}
