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

type UserTabsSnapshot = {
    tabs: WorkspaceTab[]
    activeId: string
}

type WorkspaceTabsState = {
    userId: string | null
    tabs: WorkspaceTab[]
    activeId: string
    byUser: Record<string, UserTabsSnapshot>
    bindUser: (userId: string | null) => void
    openHome: () => string
    openNote: (note: { id: string; title: string }) => string
    openSection: (section: WorkspaceSection) => string
    activate: (id: string) => string | null
    close: (id: string) => string | null
    syncFromPath: (path: string, noteTitle?: string) => void
}

type WorkspaceTabsPersisted = {
    userId: string | null
    byUser: Record<string, UserTabsSnapshot>
    /** @deprecated legacy flat shape — migrated on load */
    tabs?: WorkspaceTab[]
    activeId?: string
}

const HOME_TAB: WorkspaceTab = {
    id: 'home',
    kind: 'home',
    titleKey: 'tab.home',
    pinned: true,
    href: ROUTES.HOME_PAGE
}

const DEFAULT_SNAPSHOT: UserTabsSnapshot = {
    tabs: [HOME_TAB],
    activeId: 'home'
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

const normalizeSnapshot = (snapshot?: Partial<UserTabsSnapshot> | null): UserTabsSnapshot => {
    const tabs = ensureHomeTab(snapshot?.tabs?.length ? snapshot.tabs : DEFAULT_SNAPSHOT.tabs)
    const activeId =
        snapshot?.activeId && tabs.some((t) => t.id === snapshot.activeId) ? snapshot.activeId : 'home'
    return { tabs, activeId }
}

const saveCurrentToBucket = (
    userId: string | null,
    byUser: Record<string, UserTabsSnapshot>,
    tabs: WorkspaceTab[],
    activeId: string
): Record<string, UserTabsSnapshot> => {
    if (!userId) return byUser
    return {
        ...byUser,
        [userId]: normalizeSnapshot({ tabs, activeId })
    }
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
            userId: null,
            tabs: [HOME_TAB],
            activeId: 'home',
            byUser: {},

            bindUser: (nextUserId) => {
                const { userId, byUser, tabs, activeId } = get()
                if (userId === nextUserId) return

                let nextByUser = saveCurrentToBucket(userId, byUser, tabs, activeId)

                if (!nextUserId) {
                    set({
                        userId: null,
                        byUser: nextByUser,
                        tabs: [HOME_TAB],
                        activeId: 'home'
                    })
                    return
                }

                const snapshot = normalizeSnapshot(nextByUser[nextUserId])
                nextByUser = {
                    ...nextByUser,
                    [nextUserId]: snapshot
                }

                set({
                    userId: nextUserId,
                    byUser: nextByUser,
                    tabs: snapshot.tabs,
                    activeId: snapshot.activeId
                })
            },

            openHome: () => {
                const state = get()
                const byUser = saveCurrentToBucket(state.userId, state.byUser, state.tabs, 'home')
                set({ activeId: 'home', byUser })
                return HOME_TAB.href
            },

            openNote: (note) => {
                const id = noteTabId(note.id)
                const href = ROUTES.NOTE(note.id)
                const { tabs, userId, byUser } = get()
                const exists = tabs.find((t) => t.id === id)
                if (exists) {
                    const nextTabs = tabs.map((t) =>
                        t.id === id && t.kind === 'note' ? { ...t, title: note.title || t.title } : t
                    )
                    set({
                        activeId: id,
                        tabs: nextTabs,
                        byUser: saveCurrentToBucket(userId, byUser, nextTabs, id)
                    })
                    return href
                }
                const nextTabs = [...tabs, { id, kind: 'note' as const, noteId: note.id, title: note.title, href }]
                set({
                    tabs: nextTabs,
                    activeId: id,
                    byUser: saveCurrentToBucket(userId, byUser, nextTabs, id)
                })
                return href
            },

            openSection: (section) => {
                const id = sectionId(section)
                const href = SECTION_ROUTES[section]
                const { tabs, userId, byUser } = get()
                const exists = tabs.some((t) => t.id === id)
                if (exists) {
                    set({
                        activeId: id,
                        byUser: saveCurrentToBucket(userId, byUser, tabs, id)
                    })
                    return href
                }
                const nextTabs: WorkspaceTab[] = [
                    ...tabs,
                    {
                        id,
                        kind: 'section',
                        section,
                        titleKey: `tab.${section}`,
                        href
                    }
                ]
                set({
                    tabs: nextTabs,
                    activeId: id,
                    byUser: saveCurrentToBucket(userId, byUser, nextTabs, id)
                })
                return href
            },

            activate: (id) => {
                const { tabs, userId, byUser } = get()
                const tab = tabs.find((t) => t.id === id)
                if (!tab) return null
                set({
                    activeId: id,
                    byUser: saveCurrentToBucket(userId, byUser, tabs, id)
                })
                return tab.href
            },

            close: (id) => {
                const { tabs, activeId, userId, byUser } = get()
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

                set({
                    tabs: safeTabs,
                    activeId: nextActive,
                    byUser: saveCurrentToBucket(userId, byUser, safeTabs, nextActive)
                })
                if (!shouldNavigate) return null
                return safeTabs.find((t) => t.id === nextActive)?.href ?? HOME_TAB.href
            },

            syncFromPath: (path, noteTitle) => {
                const matched = matchWorkspacePath(path)
                if (!matched) return

                const { tabs, activeId, userId, byUser } = get()

                if (matched.kind === 'home') {
                    if (activeId !== 'home') {
                        set({
                            activeId: 'home',
                            byUser: saveCurrentToBucket(userId, byUser, tabs, 'home')
                        })
                    }
                    return
                }

                if (matched.kind === 'note') {
                    const id = noteTabId(matched.noteId)
                    const href = ROUTES.NOTE(matched.noteId)
                    const exists = tabs.find((t) => t.id === id)

                    if (exists && exists.kind === 'note') {
                        const nextTitle = noteTitle && noteTitle.length > 0 ? noteTitle : exists.title
                        const titleChanged = nextTitle !== exists.title
                        if (activeId === id && !titleChanged) return
                        const nextTabs = titleChanged
                            ? tabs.map((t) => (t.id === id && t.kind === 'note' ? { ...t, title: nextTitle } : t))
                            : tabs
                        set({
                            activeId: id,
                            tabs: nextTabs,
                            byUser: saveCurrentToBucket(userId, byUser, nextTabs, id)
                        })
                        return
                    }

                    const nextTabs: WorkspaceTab[] = [
                        ...tabs,
                        {
                            id,
                            kind: 'note',
                            noteId: matched.noteId,
                            title: noteTitle || matched.noteId,
                            href
                        }
                    ]
                    set({
                        tabs: nextTabs,
                        activeId: id,
                        byUser: saveCurrentToBucket(userId, byUser, nextTabs, id)
                    })
                    return
                }

                const sectionTabId = sectionId(matched.section)
                if (tabs.some((t) => t.id === sectionTabId) && activeId === sectionTabId) return
                get().openSection(matched.section)
            }
        }),
        {
            name: STORE_KEYS.WORKSPACE_TABS,
            storage: createJSONStorage(() => localStorage),
            partialize: (state): WorkspaceTabsPersisted => ({
                userId: state.userId,
                byUser: saveCurrentToBucket(state.userId, state.byUser, state.tabs, state.activeId)
            }),
            merge: (persisted, current) => {
                const saved = persisted as WorkspaceTabsPersisted | undefined
                if (!saved) return current

                let byUser = { ...(saved.byUser ?? {}) }

                // Migrate legacy flat { tabs, activeId } into anonymous/guest bucket once.
                if ((!saved.byUser || Object.keys(saved.byUser).length === 0) && saved.tabs?.length) {
                    const legacyKey = saved.userId ?? '__legacy__'
                    byUser = {
                        ...byUser,
                        [legacyKey]: normalizeSnapshot({ tabs: saved.tabs, activeId: saved.activeId })
                    }
                }

                const userId = saved.userId ?? null
                const snapshot = userId
                    ? normalizeSnapshot(byUser[userId])
                    : { tabs: [HOME_TAB], activeId: 'home' as const }

                return {
                    ...current,
                    userId,
                    byUser,
                    tabs: snapshot.tabs,
                    activeId: snapshot.activeId
                }
            }
        }
    )
)
