'use client'

import { useEffect } from 'react'
import { usePathname } from '@/i18n/navigation'
import { useEntries, EMPTY_ENTRIES } from '@/entities/entry/api/use-entries'
import { getEntryPreviewText } from '@/entities/entry/model'
import { removeLocalePrefix } from '@/i18n/routing'
import { matchWorkspacePath, useWorkspaceTabs } from './store'

/** Keep browser-like tabs in sync with the current App Router path. Call once in MainShell. */
export const useSyncWorkspaceRoute = () => {
    const pathname = usePathname()
    const syncFromPath = useWorkspaceTabs((s) => s.syncFromPath)
    const { data: entries = EMPTY_ENTRIES } = useEntries()
    const path = removeLocalePrefix(pathname)

    useEffect(() => {
        const matched = matchWorkspacePath(path)
        if (!matched) return

        if (matched.kind === 'note') {
            const entry = entries.find((item) => item.id === matched.noteId)
            const title = entry ? getEntryPreviewText(entry).slice(0, 28) : matched.noteId
            syncFromPath(path, title)
            return
        }

        syncFromPath(path)
    }, [path, entries, syncFromPath])
}
