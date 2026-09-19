import type { EntrySearchItem } from '@/entities/entry/model'

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

export type LandingNote = {
    id: LandingNoteId
    text: string
    createdAt: string
    photo?: string
    place?: string
    hasVoice?: boolean
}

type NoteCopy = Record<LandingNoteId, string>

const LANDING_PROCESSING: EntrySearchItem['processingStatus'] = { done: 1, total: 1, error: 0 }

export const landingNoteToSearchItem = (note: LandingNote): EntrySearchItem => ({
    id: note.id,
    title: '',
    text: note.text,
    formattedText: null,
    formattedTextFormat: null,
    createdAt: note.createdAt,
    isHasVoice: note.hasVoice ?? false,
    photoCount: note.photo ? 1 : 0,
    isReady: true,
    processingStatus: LANDING_PROCESSING,
    peopleCount: 0,
    placesCount: note.place ? 1 : 0
})

export const notePhoto = (note: LandingNote) => note.photo

export const getLandingDemoNotes = (content: NoteCopy): LandingNote[] => [
    {
        id: 'park',
        text: content.park,
        createdAt: '2026-08-22T15:20:00.000Z',
        photo: LANDING_PHOTOS.park,
        place: 'Park',
        hasVoice: true
    },
    {
        id: 'evening',
        text: content.evening,
        createdAt: '2026-08-21T21:04:00.000Z',
        photo: LANDING_PHOTOS.evening
    },
    {
        id: 'cafe',
        text: content.cafe,
        createdAt: '2026-08-18T11:12:00.000Z',
        photo: LANDING_PHOTOS.cafe,
        place: 'Cafe'
    }
]
