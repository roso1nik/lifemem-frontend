import z from 'zod'

export const NoteAttachmentType = {
    FILE: 'file',
    MUSIC: 'music',
    GEO: 'geo',
    VOICE: 'voice'
} as const

export type NoteAttachmentTypeValue = (typeof NoteAttachmentType)[keyof typeof NoteAttachmentType]

export interface NoteGeoMeta {
    lat: number
    lng: number
    label?: string
}

export interface NoteAttachment {
    id: string
    type: NoteAttachmentTypeValue
    name?: string
    url?: string
    meta?: NoteGeoMeta
}

export interface Note {
    id: string
    createdAt: string
    updatedAt: string
    userId: string
    content: string
    attachments: NoteAttachment[]
}

export const createNoteSchema = z.object({
    content: z.string().trim().min(1, 'Напишите что-нибудь'),
    attachments: z
        .array(
            z.object({
                id: z.string(),
                type: z.enum(['file', 'music', 'geo', 'voice']),
                name: z.string().optional(),
                url: z.string().optional(),
                meta: z
                    .object({
                        lat: z.number(),
                        lng: z.number(),
                        label: z.string().optional()
                    })
                    .optional()
            })
        )
        .default([])
})

export type CreateNoteRequest = z.infer<typeof createNoteSchema>
