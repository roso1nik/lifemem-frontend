'use client'

import { AppShell, UnstyledButton } from '@mantine/core'
import { useDisclosure, useElementSize } from '@mantine/hooks'
import { ReactNode, useEffect } from 'react'
import { NotesList } from '@/widgets/notes-list'
import { AccountMenu } from '@/widgets/account-menu'
import { AppHeader } from '@/widgets/header'
import { EntrySearchItem, getEntryPreviewText } from '@/entities/entry/model'
import { useSelf } from '@/entities/user/api/use-self'
import { IconButton } from '@/shared/ui'
import { Archive, GitBranch, MapPinned, SunMedium } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { cn } from '@/shared/utils'
import {
    useSyncWorkspaceRoute,
    useWorkspaceNavigation,
    useWorkspaceTabs,
    type WorkspaceSection
} from '@/features/workspace-tabs'
import { UserSettingsLocaleSync } from '@/features/locale-sync/user-settings-locale-sync'

interface MainShellProps {
    children: ReactNode
}

type NavId = 'home' | WorkspaceSection

const SECTION_ICONS: { id: WorkspaceSection; icon: typeof GitBranch }[] = [
    { id: 'graph', icon: GitBranch },
    { id: 'map', icon: MapPinned },
    { id: 'archive', icon: Archive }
]

export const MainShell = ({ children }: MainShellProps) => {
    const [opened, { toggle, close }] = useDisclosure()
    const t = useTranslations('home')
    const { data: self } = useSelf()
    useSyncWorkspaceRoute()
    const { goHome, goNote, goSection } = useWorkspaceNavigation()
    const activeId = useWorkspaceTabs((s) => s.activeId)
    const tabs = useWorkspaceTabs((s) => s.tabs)
    const bindUser = useWorkspaceTabs((s) => s.bindUser)
    const { ref: headerRef, height: headerHeight } = useElementSize<HTMLDivElement>()

    useEffect(() => {
        bindUser(self?.info.id ?? null)
    }, [self?.info.id, bindUser])

    const activeNoteId = (() => {
        const tab = tabs.find((t) => t.id === activeId)
        return tab?.kind === 'note' ? tab.noteId : null
    })()
    const homeActive = activeId === 'home'

    const onSelect = (entry: EntrySearchItem) => {
        goNote({
            id: entry.id,
            title: getEntryPreviewText(entry).slice(0, 28) || t('tab.notes')
        })
        close()
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
            <UserSettingsLocaleSync />
            <AppShell.Header className="border-hairline bg-surface-frost/80 overflow-visible backdrop-blur-xl">
                <div ref={headerRef}>
                    <AppHeader menuOpened={opened} onToggleMenu={toggle} />
                </div>
            </AppShell.Header>

            <AppShell.Navbar className="border-sidebar-border bg-sidebar/90 flex h-full min-h-0 flex-col backdrop-blur-xl">
                <div className="border-sidebar-border flex shrink-0 items-center gap-1.5 border-b px-2.5 py-2.5">
                    <UnstyledButton
                        onClick={() => goHome()}
                        aria-label={t('tab.home')}
                        aria-pressed={homeActive}
                        className={cn(
                            'flex min-w-0 flex-1 items-center gap-2 rounded-xl px-2.5 py-2 transition-[background-color,transform,box-shadow,color] duration-150',
                            'active:scale-[0.98]',
                            homeActive
                                ? 'bg-primary text-primary-foreground shadow-[0_8px_20px_color-mix(in_srgb,var(--primary)_28%,transparent)]'
                                : 'bg-primary/10 text-primary hover:bg-primary/16'
                        )}
                    >
                        <span
                            className={cn(
                                'flex size-7 shrink-0 items-center justify-center rounded-lg',
                                homeActive ? 'bg-primary-foreground/15' : 'bg-primary/15'
                            )}
                        >
                            <SunMedium size={15} strokeWidth={2} />
                        </span>
                        <span className="truncate text-[13px] font-semibold tracking-tight">
                            {t('tab.home')}
                        </span>
                    </UnstyledButton>

                    <div className="flex shrink-0 items-center gap-0.5">
                        {SECTION_ICONS.map(({ id, icon: Icon }) => {
                            const sectionActive = activeId === `section:${id}`
                            return (
                                <IconButton
                                    key={id}
                                    size="sm"
                                    aria-label={t(`tab.${id}`)}
                                    aria-pressed={sectionActive}
                                    onClick={() => goSection(id)}
                                    className={cn(sectionActive && 'bg-accent text-primary')}
                                >
                                    <Icon size={16} strokeWidth={1.75} />
                                </IconButton>
                            )
                        })}
                    </div>
                </div>
                <NotesList selectedId={activeNoteId} onSelect={onSelect} />
                <AccountMenu />
            </AppShell.Navbar>

            <AppShell.Main className="bg-background flex min-h-0 flex-1 flex-col">{children}</AppShell.Main>
        </AppShell>
    )
}
