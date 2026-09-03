export interface EntryImage {
    id: string
    createdAt: string
    updatedAt: string
    fileId: string
    description: unknown
    url: string
}

export interface EntryRelation {
    id: string
    name: string
}

export interface Entry {
    id: string
    createdAt: string
    updatedAt: string
    title: string
    text: string | null
    isHasVoice: boolean
    images: EntryImage[]
    isReady: boolean
    peoples: EntryRelation[]
    places: EntryRelation[]
}

const stripHtml = (html: string): string =>
    html
        .replace(/<br\s*\/?>/gi, ' ')
        .replace(/&nbsp;/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()

export const getEntryPreviewText = (entry: Entry): string => {
    const fromText = entry.text?.trim() ? stripHtml(entry.text) : ''
    return fromText || entry.title?.trim() || ''
}

export const getEntryAttachmentCount = (entry: Entry): number =>
    entry.images.length + (entry.isHasVoice ? 1 : 0) + entry.places.length
