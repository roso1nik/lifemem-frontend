'use client'

import { create } from 'zustand'

export type HomeComposerMode = 'write' | 'ask'

type AskNotesState = {
    mode: HomeComposerMode
    pendingQuestion: string | null
    setMode: (mode: HomeComposerMode) => void
    requestAsk: (question: string) => void
    consumePendingQuestion: () => string | null
}

export const useAskNotesStore = create<AskNotesState>((set, get) => ({
    mode: 'write',
    pendingQuestion: null,
    setMode: (mode) => set({ mode }),
    requestAsk: (question) => {
        const trimmed = question.trim()
        if (!trimmed) return
        set({ mode: 'ask', pendingQuestion: trimmed })
    },
    consumePendingQuestion: () => {
        const question = get().pendingQuestion
        if (!question) return null
        set({ pendingQuestion: null })
        return question
    }
}))
