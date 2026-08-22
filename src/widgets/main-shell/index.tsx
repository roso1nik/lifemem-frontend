'use client'

import { AppShell } from '@mantine/core'
import { useDisclosure, useElementSize } from '@mantine/hooks'
import { ReactNode } from 'react'
import { NotesList } from '@/widgets/notes-list'
import { AccountMenu } from '@/widgets/account-menu'
import { AppHeader } from '@/widgets/header'
import { Note } from '@/entities/note/model'
import { IconButton } from '@/shared/ui'
import { Archive, GitBranch, MapPinned, Notebook } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { cn } from '@/shared/utils'
import {
    useSyncWorkspaceRoute,
    useWorkspaceNavigation,
    useWorkspaceTabs,
    type WorkspaceSection
} from '@/features/workspace-tabs'

interface MainShellProps {
    children: ReactNode
}

const NAV_ICONS: { id: 'notes' | WorkspaceSection; icon: typeof Notebook }[] = [
    { id: 'notes', icon: Notebook },
    { id: 'graph', icon: GitBranch },
    { id: 'map', icon: MapPinned },
    { id: 'archive', icon: Archive }
]

export const MainShell = ({ children }: MainShellProps) => {
    const [opened, { toggle, close }] = useDisclosure()
    const t = useTranslations('home')
    useSyncWorkspaceRoute()
    const { goHome, goNote, goSection } = useWorkspaceNavigation()
    const activeId = useWorkspaceTabs((s) => s.activeId)
    const tabs = useWorkspaceTabs((s) => s.tabs)
    const { ref: headerRef, height: headerHeight } = useElementSize<HTMLDivElement>()

    const activeNoteId = (() => {
        const tab = tabs.find((t) => t.id === activeId)
        return tab?.kind === 'note' ? tab.noteId : null
    })()

    const onSelect = (note: Note) => {
        goNote({
            id: note.id,
            title: note.content.trim().slice(0, 28) || t('tab.notes')
        })
        close()
    }

    const onNav = (id: 'notes' | WorkspaceSection) => {
        if (id === 'notes') {
            goHome()
            return
        }
        goSection(id)
    }

    // Match AppShell chrome to AppHeader content (avoids fixed 44px gap/clip)
    const shellHeaderHeight = headerHeight > 0 ? Math.round(headerHeight) : 40

    return (
        <AppShell
            header={{ height: shellHeaderHeight }}
            navbar={{
                width: 300,
                breakpoint: 'sm',
                collapsed: { mobile: !opened }
            }}
            padding={0}
            className="min-h-screen"
        >
            <AppShell.Header className="border-hairline bg-surface-frost/80 overflow-visible backdrop-blur-xl">
                <div ref={headerRef}>
                    <AppHeader menuOpened={opened} onToggleMenu={toggle} />
                </div>
            </AppShell.Header>

            <AppShell.Navbar className="border-sidebar-border bg-sidebar/90 flex flex-col backdrop-blur-xl">
                <div className="border-sidebar-border flex flex-row items-center gap-0.5 border-b px-3 py-2.5">
                    {NAV_ICONS.map(({ id, icon: Icon }) => {
                        const sectionActive = id === 'notes' ? activeId === 'home' : activeId === `section:${id}`
                        return (
                            <IconButton
                                key={id}
                                size="sm"
                                aria-label={t(`tab.${id}`)}
                                aria-pressed={sectionActive}
                                onClick={() => onNav(id)}
                                className={cn(sectionActive && 'bg-accent text-primary')}
                            >
                                <Icon size={16} />
                            </IconButton>
                        )
                    })}
                </div>
                <NotesList selectedId={activeNoteId} onSelect={onSelect} />
                <AccountMenu />
            </AppShell.Navbar>

            <AppShell.Main className="bg-background flex min-h-0 flex-1 flex-col">{children}</AppShell.Main>
        </AppShell>
    )
}
