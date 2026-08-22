'use client'

import { useEffect } from 'react'
import { usePathname } from '@/i18n/navigation'
import { useNotesStore } from '@/entities/note/store/notes-store'
import { removeLocalePrefix } from '@/i18n/routing'
import { matchWorkspacePath, useWorkspaceTabs } from './store'

/** Keep browser-like tabs in sync with the current App Router path. Call once in MainShell. */
export const useSyncWorkspaceRoute = () => {
    const pathname = usePathname()
    const syncFromPath = useWorkspaceTabs((s) => s.syncFromPath)
    const notes = useNotesStore((s) => s.notes)
    const path = removeLocalePrefix(pathname)

    useEffect(() => {
        const matched = matchWorkspacePath(path)
        if (!matched) return

        if (matched.kind === 'note') {
            const note = notes.find((n) => n.id === matched.noteId)
            const title = note?.content.trim().slice(0, 28) || matched.noteId
            syncFromPath(path, title)
            return
        }

        syncFromPath(path)
    }, [path, notes, syncFromPath])
}
