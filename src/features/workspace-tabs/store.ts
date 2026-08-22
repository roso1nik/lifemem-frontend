'use client'

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { ROUTES, SECTION_ROUTES, type AppSection } from '@/shared/router'
import { STORE_KEYS } from '@/shared/config/store-keys'

export type WorkspaceSection = AppSection

export type WorkspaceTab =
    | { id: 'home'; kind: 'home'; titleKey: 'tab.home'; pinned: true; href: typeof ROUTES.HOME_PAGE }
    | { id: string; kind: 'note'; noteId: string; title: string; href: string }
    | {
          id: string
          kind: 'section'
          section: WorkspaceSection
          titleKey: `tab.${WorkspaceSection}`
          href: string
      }

type WorkspaceTabsState = {
    tabs: WorkspaceTab[]
    activeId: string
    openHome: () => string
    openNote: (note: { id: string; title: string }) => string
    openSection: (section: WorkspaceSection) => string
    activate: (id: string) => string | null
    close: (id: string) => string | null
    syncFromPath: (path: string, noteTitle?: string) => void
}

type WorkspaceTabsPersisted = Pick<WorkspaceTabsState, 'tabs' | 'activeId'>

const HOME_TAB: WorkspaceTab = {
    id: 'home',
    kind: 'home',
    titleKey: 'tab.home',
    pinned: true,
    href: ROUTES.HOME_PAGE
}

const sectionId = (section: WorkspaceSection) => `section:${section}`
const noteTabId = (noteId: string) => `note:${noteId}`

const normalizePath = (path: string) => {
    if (!path || path === '') return '/'
    const trimmed = path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path
    return trimmed || '/'
}

const ensureHomeTab = (tabs: WorkspaceTab[]): WorkspaceTab[] => {
    if (tabs.some((t) => t.id === 'home')) return tabs
    return [HOME_TAB, ...tabs]
}

export const matchWorkspacePath = (
    path: string
): { kind: 'home' } | { kind: 'note'; noteId: string } | { kind: 'section'; section: WorkspaceSection } | null => {
    const p = normalizePath(path)
    if (p === ROUTES.HOME_PAGE) return { kind: 'home' }

    const noteMatch = p.match(/^\/note\/([^/]+)$/)
    if (noteMatch?.[1]) return { kind: 'note', noteId: decodeURIComponent(noteMatch[1]) }

    const section = (Object.entries(SECTION_ROUTES) as [WorkspaceSection, string][]).find(([, href]) => href === p)
    if (section) return { kind: 'section', section: section[0] }

    return null
}

export const useWorkspaceTabs = create<WorkspaceTabsState>()(
    persist(
        (set, get) => ({
            tabs: [HOME_TAB],
            activeId: 'home',

            openHome: () => {
                set({ activeId: 'home' })
                return HOME_TAB.href
            },

            openNote: (note) => {
                const id = noteTabId(note.id)
                const href = ROUTES.NOTE(note.id)
                const { tabs } = get()
                const exists = tabs.find((t) => t.id === id)
                if (exists) {
                    set({
                        activeId: id,
                        tabs: tabs.map((t) =>
                            t.id === id && t.kind === 'note' ? { ...t, title: note.title || t.title } : t
                        )
                    })
                    return href
                }
                set({
                    tabs: [...tabs, { id, kind: 'note', noteId: note.id, title: note.title, href }],
                    activeId: id
                })
                return href
            },

            openSection: (section) => {
                const id = sectionId(section)
                const href = SECTION_ROUTES[section]
                const { tabs } = get()
                const exists = tabs.some((t) => t.id === id)
                if (exists) {
                    set({ activeId: id })
                    return href
                }
                set({
                    tabs: [
                        ...tabs,
                        {
                            id,
                            kind: 'section',
                            section,
                            titleKey: `tab.${section}`,
                            href
                        }
                    ],
                    activeId: id
                })
                return href
            },

            activate: (id) => {
                const tab = get().tabs.find((t) => t.id === id)
                if (!tab) return null
                set({ activeId: id })
                return tab.href
            },

            close: (id) => {
                const { tabs, activeId } = get()
                const tab = tabs.find((t) => t.id === id)
                if (!tab || (tab.kind === 'home' && tab.pinned)) return null

                const index = tabs.findIndex((t) => t.id === id)
                const nextTabs = tabs.filter((t) => t.id !== id)
                const safeTabs = nextTabs.length ? nextTabs : [HOME_TAB]
                let nextActive = activeId
                let shouldNavigate = false

                if (activeId === id) {
                    const neighbor = safeTabs[Math.max(0, index - 1)] ?? HOME_TAB
                    nextActive = neighbor.id
                    shouldNavigate = true
                }

                set({ tabs: safeTabs, activeId: nextActive })
                if (!shouldNavigate) return null
                return safeTabs.find((t) => t.id === nextActive)?.href ?? HOME_TAB.href
            },

            syncFromPath: (path, noteTitle) => {
                const matched = matchWorkspacePath(path)
                if (!matched) return

                if (matched.kind === 'home') {
                    set({ activeId: 'home' })
                    return
                }

                if (matched.kind === 'note') {
                    const id = noteTabId(matched.noteId)
                    const href = ROUTES.NOTE(matched.noteId)
                    const { tabs } = get()
                    const exists = tabs.find((t) => t.id === id)
                    if (exists) {
                        set({
                            activeId: id,
                            tabs: tabs.map((t) =>
                                t.id === id && t.kind === 'note' && noteTitle ? { ...t, title: noteTitle } : t
                            )
                        })
                        return
                    }
                    set({
                        tabs: [
                            ...tabs,
                            {
                                id,
                                kind: 'note',
                                noteId: matched.noteId,
                                title: noteTitle || matched.noteId,
                                href
                            }
                        ],
                        activeId: id
                    })
                    return
                }

                get().openSection(matched.section)
            }
        }),
        {
            name: STORE_KEYS.WORKSPACE_TABS,
            storage: createJSONStorage(() => localStorage),
            partialize: (state): WorkspaceTabsPersisted => ({
                tabs: state.tabs,
                activeId: state.activeId
            }),
            merge: (persisted, current) => {
                const saved = persisted as WorkspaceTabsPersisted | undefined
                if (!saved?.tabs?.length) return current

                const tabs = ensureHomeTab(saved.tabs)
                const activeId = saved.activeId && tabs.some((t) => t.id === saved.activeId) ? saved.activeId : 'home'

                return { ...current, tabs, activeId }
            }
        }
    )
)
