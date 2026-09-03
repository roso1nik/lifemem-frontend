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

export const getEntryPreviewText = (entry: Entry): string =>
    entry.text?.trim() || entry.title?.trim() || ''

export const getEntryAttachmentCount = (entry: Entry): number =>
    entry.images.length + (entry.isHasVoice ? 1 : 0) + entry.places.length
