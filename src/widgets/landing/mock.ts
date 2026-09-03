import { Entry } from '@/entities/entry/model'

export const LANDING_PHOTOS = {
    park: '/landing/park-walk.png',
    evening: '/landing/evening-table.png'
} as const

export type LandingNoteId = 'park' | 'evening' | 'kyoto'

type NoteCopy = Record<LandingNoteId, string>

export const getLandingNotes = (content: NoteCopy): Entry[] => [
    {
        id: 'park',
        createdAt: '2026-08-22T15:20:00.000Z',
        updatedAt: '2026-08-22T15:20:00.000Z',
        title: '',
        text: content.park,
        isHasVoice: true,
        isReady: true,
        images: [
            {
                id: 'park-photo',
                createdAt: '2026-08-22T15:20:00.000Z',
                updatedAt: '2026-08-22T15:20:00.000Z',
                fileId: 'park-photo',
                description: null,
                url: LANDING_PHOTOS.park
            }
        ],
        peoples: [],
        places: [{ id: 'park-geo', name: 'Park' }]
    },
    {
        id: 'evening',
        createdAt: '2026-08-21T21:04:00.000Z',
        updatedAt: '2026-08-21T21:04:00.000Z',
        title: '',
        text: content.evening,
        isHasVoice: false,
        isReady: true,
        images: [
            {
                id: 'evening-photo',
                createdAt: '2026-08-21T21:04:00.000Z',
                updatedAt: '2026-08-21T21:04:00.000Z',
                fileId: 'evening-photo',
                description: null,
                url: LANDING_PHOTOS.evening
            }
        ],
        peoples: [],
        places: []
    },
    {
        id: 'kyoto',
        createdAt: '2026-08-18T11:12:00.000Z',
        updatedAt: '2026-08-18T11:12:00.000Z',
        title: '',
        text: content.kyoto,
        isHasVoice: false,
        isReady: true,
        images: [],
        peoples: [],
        places: [{ id: 'kyoto-geo', name: 'Kyoto' }]
    }
]

export const notePhoto = (entry: Entry): string | undefined => entry.images[0]?.url
