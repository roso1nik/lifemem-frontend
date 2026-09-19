import { Entry } from '@/entities/entry/model'

export const LANDING_PHOTOS = {
    park: '/landing/park-walk.png',
    evening: '/landing/evening-table.png',
    cafe: '/landing/nodes/cafe.jpg',
    place: '/landing/capture/place.jpg',
    privacy: '/landing/privacy-shield.jpg',
    askVisual: '/landing/ask-visual.jpg'
} as const

export const CAPTURE_CAROUSEL_PHOTOS = [
    '/landing/capture/slide-1.jpg',
    '/landing/capture/slide-2.jpg',
    '/landing/capture/slide-3.jpg',
    '/landing/capture/slide-4.jpg',
    '/landing/capture/slide-5.jpg'
] as const

export type LandingNoteId = 'park' | 'evening' | 'cafe'

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
        id: 'cafe',
        createdAt: '2026-08-18T11:12:00.000Z',
        updatedAt: '2026-08-18T11:12:00.000Z',
        title: '',
        text: content.cafe,
        isHasVoice: false,
        isReady: true,
        images: [
            {
                id: 'cafe-photo',
                createdAt: '2026-08-18T11:12:00.000Z',
                updatedAt: '2026-08-18T11:12:00.000Z',
                fileId: 'cafe-photo',
                description: null,
                url: LANDING_PHOTOS.cafe
            }
        ],
        peoples: [],
        places: [{ id: 'cafe-geo', name: 'Cafe' }]
    }
]

export const notePhoto = (entry: Entry): string | undefined => entry.images[0]?.url
