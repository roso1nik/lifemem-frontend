'use client'

import { useRouter } from '@/i18n/navigation'
import { ROUTES } from '@/shared/router'
import { useWorkspaceTabs, type WorkspaceSection } from './store'

export const useWorkspaceNavigation = () => {
    const router = useRouter()
    const openHome = useWorkspaceTabs((s) => s.openHome)
    const openNote = useWorkspaceTabs((s) => s.openNote)
    const openSection = useWorkspaceTabs((s) => s.openSection)
    const activate = useWorkspaceTabs((s) => s.activate)
    const close = useWorkspaceTabs((s) => s.close)

    return {
        goHome: () => {
            openHome()
            router.push(ROUTES.HOME_PAGE)
        },
        goNote: (note: { id: string; title: string }) => {
            const href = openNote(note)
            router.push(href)
        },
        goSection: (section: WorkspaceSection) => {
            const href = openSection(section)
            router.push(href)
        },
        goTab: (id: string) => {
            const href = activate(id)
            if (href) router.push(href)
        },
        closeTab: (id: string) => {
            const href = close(id)
            if (href) router.push(href)
        }
    }
}
