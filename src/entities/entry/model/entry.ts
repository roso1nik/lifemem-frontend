export type FormattedTextFormat = 'plain' | 'markdown' | 'html'

export type EntryProcessingJobType =
    | 'Stt'
    | 'Vision'
    | 'LocationConnect'
    | 'LocationAndPeopleDetect'
    | 'EmbedText'
    | 'EmbedTitle'
    | 'EmbedImage'

export type EntryProcessingJobStatus = 'Pending' | 'Running' | 'Done' | 'Failed' | 'Cancelled'

export interface EntryImage {
    id: string
    createdAt: string
    updatedAt: string
    fileId: string
    description: unknown
    url: string
}

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
    photoCount: number
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
    photos: EntryImage[]
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
    images: EntryImage[]
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
    entry.photoCount + (entry.isHasVoice ? 1 : 0) + entry.placesCount
