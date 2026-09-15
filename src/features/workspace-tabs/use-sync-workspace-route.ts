'use client'

import { useEffect, useMemo } from 'react'
import { usePathname } from '@/i18n/navigation'
import { useGetEntry } from '@/entities/entry/api/use-get-entry'
import { getEntryPreviewText } from '@/entities/entry/model'
import { removeLocalePrefix } from '@/i18n/routing'
import { matchWorkspacePath, useWorkspaceTabs } from './store'

/** Keep browser-like tabs in sync with the current App Router path. Call once in MainShell. */
export const useSyncWorkspaceRoute = () => {
    const pathname = usePathname()
    const syncFromPath = useWorkspaceTabs((s) => s.syncFromPath)
    const path = removeLocalePrefix(pathname)
    const matched = useMemo(() => matchWorkspacePath(path), [path])
    const noteId = matched?.kind === 'note' ? matched.noteId : null
    const { data: entry } = useGetEntry(noteId)

    useEffect(() => {
        if (!matched) return

        if (matched.kind === 'note') {
            const title = entry ? getEntryPreviewText(entry).slice(0, 28) : matched.noteId
            syncFromPath(path, title)
            return
        }

        syncFromPath(path)
    }, [path, matched, entry, syncFromPath])
}
