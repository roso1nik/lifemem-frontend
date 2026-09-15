export const LANDING_PHOTOS = {
    park: '/landing/park-walk.png',
    evening: '/landing/evening-table.png'
} as const

export type LandingNoteId = 'park' | 'evening' | 'kyoto'

export type LandingNote = {
    id: LandingNoteId
    text: string
    createdAt: string
    photo?: string
    place?: string
    hasVoice?: boolean
}

type NoteCopy = Record<LandingNoteId, string>

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
        id: 'kyoto',
        text: content.kyoto,
        createdAt: '2026-08-18T11:12:00.000Z',
        place: 'Kyoto'
    }
]
