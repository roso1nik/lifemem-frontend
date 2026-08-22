import { create } from 'zustand'
import { CreateNoteRequest, Note, NoteAttachmentType } from '../model'
import { dayjsInstance } from '@/shared/utils'

const seedNotes = (): Note[] => {
    const now = dayjsInstance()
    return [
        {
            id: 'n1',
            userId: 'mock-user-1',
            content: 'Утренний кофе и мысль про то, как устроены воспоминания.',
            createdAt: now.hour(9).minute(12).toISOString(),
            updatedAt: now.hour(9).minute(12).toISOString(),
            attachments: []
        },
        {
            id: 'n2',
            userId: 'mock-user-1',
            content: 'Прогулка у реки. Хочу сохранить это место.',
            createdAt: now.hour(14).minute(40).toISOString(),
            updatedAt: now.hour(14).minute(40).toISOString(),
            attachments: [
                {
                    id: 'a1',
                    type: NoteAttachmentType.GEO,
                    name: 'Набережная',
                    meta: { lat: 55.75, lng: 37.62, label: 'Москва' }
                }
            ]
        },
        {
            id: 'n3',
            userId: 'mock-user-1',
            content: 'Плейлист вечера — спокойный jazz.',
            createdAt: now.subtract(1, 'day').hour(21).minute(5).toISOString(),
            updatedAt: now.subtract(1, 'day').hour(21).minute(5).toISOString(),
            attachments: [{ id: 'a2', type: NoteAttachmentType.MUSIC, name: 'Evening Jazz' }]
        },
        {
            id: 'n4',
            userId: 'mock-user-1',
            content: 'Скан старой открытки от бабушки.',
            createdAt: now.subtract(2, 'day').hour(11).minute(20).toISOString(),
            updatedAt: now.subtract(2, 'day').hour(11).minute(20).toISOString(),
            attachments: [{ id: 'a3', type: NoteAttachmentType.FILE, name: 'postcard.jpg' }]
        },
        {
            id: 'n5',
            userId: 'mock-user-1',
            content: 'Первый день в новом городе. Всё кажется чуть медленнее.',
            createdAt: now.subtract(5, 'day').hour(18).minute(0).toISOString(),
            updatedAt: now.subtract(5, 'day').hour(18).minute(0).toISOString(),
            attachments: []
        }
    ]
}

interface NotesState {
    notes: Note[]
    addNote: (payload: CreateNoteRequest) => Note
}

export const useNotesStore = create<NotesState>((set, get) => ({
    notes: seedNotes(),
    addNote: (payload) => {
        const now = new Date().toISOString()
        const note: Note = {
            id: `n-${crypto.randomUUID()}`,
            userId: 'mock-user-1',
            content: payload.content.trim() || (payload.attachments?.length ? 'Вложение' : ''),
            attachments: payload.attachments ?? [],
            createdAt: now,
            updatedAt: now
        }
        set({ notes: [note, ...get().notes] })
        return note
    }
}))
