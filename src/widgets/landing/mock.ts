import { Note, NoteAttachmentType } from '@/entities/note/model'

export const LANDING_PHOTOS = {
    park: '/landing/park-walk.png',
    evening: '/landing/evening-table.png'
} as const

export type LandingNoteId = 'park' | 'evening' | 'kyoto'

type NoteCopy = Record<LandingNoteId, string>

export const getLandingNotes = (content: NoteCopy): Note[] => [
    {
        id: 'park',
        createdAt: '2026-08-22T15:20:00.000Z',
        updatedAt: '2026-08-22T15:20:00.000Z',
        userId: 'demo',
        content: content.park,
        attachments: [
            { id: 'park-photo', type: NoteAttachmentType.FILE, name: 'park.jpg', url: LANDING_PHOTOS.park },
            {
                id: 'park-geo',
                type: NoteAttachmentType.GEO,
                name: 'Park',
                meta: { lat: 55.751, lng: 37.617, label: 'Park' }
            },
            { id: 'park-voice', type: NoteAttachmentType.VOICE, name: 'walk.m4a' }
        ]
    },
    {
        id: 'evening',
        createdAt: '2026-08-21T21:04:00.000Z',
        updatedAt: '2026-08-21T21:04:00.000Z',
        userId: 'demo',
        content: content.evening,
        attachments: [
            {
                id: 'evening-photo',
                type: NoteAttachmentType.FILE,
                name: 'table.jpg',
                url: LANDING_PHOTOS.evening
            }
        ]
    },
    {
        id: 'kyoto',
        createdAt: '2026-08-18T11:12:00.000Z',
        updatedAt: '2026-08-18T11:12:00.000Z',
        userId: 'demo',
        content: content.kyoto,
        attachments: [
            {
                id: 'kyoto-geo',
                type: NoteAttachmentType.GEO,
                name: 'Kyoto',
                meta: { lat: 35.012, lng: 135.768, label: 'Kyoto' }
            }
        ]
    }
]

export const notePhoto = (note: Note): string | undefined =>
    note.attachments.find((item) => item.type === NoteAttachmentType.FILE)?.url
