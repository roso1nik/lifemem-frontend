'use client'

import { APP_NAME } from '@/shared/config'
import { cn } from '@/shared/utils'
import { Burger } from '@mantine/core'
import { Archive, GitBranch, MapPinned, Notebook, Search, User, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useWorkspaceNavigation, useWorkspaceTabs, type WorkspaceTab } from '@/features/workspace-tabs'
import { openSearchSpotlight, SearchSpotlight } from '@/widgets/search-spotlight'

type AppHeaderProps = {
    menuOpened: boolean
    onToggleMenu: () => void
}

const tabIcon = (tab: WorkspaceTab) => {
    if (tab.kind === 'home' || tab.kind === 'note') return Notebook
    if (tab.section === 'graph') return GitBranch
    if (tab.section === 'map') return MapPinned
    if (tab.section === 'profile') return User
    if (tab.section === 'archive') return Archive
    return Notebook
}

export const AppHeader = ({ menuOpened, onToggleMenu }: AppHeaderProps) => {
    const t = useTranslations('home')
    const tabs = useWorkspaceTabs((s) => s.tabs)
    const activeId = useWorkspaceTabs((s) => s.activeId)
    const { goTab, closeTab } = useWorkspaceNavigation()

    const titleOf = (tab: WorkspaceTab) => {
        if (tab.kind === 'note') return tab.title
        return t(tab.titleKey)
    }

    return (
        <>
            <div className="flex gap-1 bg-[color-mix(in_srgb,var(--muted)_55%,transparent)] px-2 pt-1 sm:px-3">
                <Burger
                    opened={menuOpened}
                    onClick={onToggleMenu}
                    hiddenFrom="sm"
                    size="sm"
                    className="mb-1.5 shrink-0"
                    aria-label={t('openNotes')}
                />

                <div
                    className="flex min-w-0 flex-1 items-end gap-0.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                    role="tablist"
                    aria-label={t('navTabs')}
                >
                    {tabs.map((tab) => {
                        const active = tab.id === activeId
                        const Icon = tabIcon(tab)
                        const pinned = tab.kind === 'home' && tab.pinned

                        return (
                            <div
                                key={tab.id}
                                role="tab"
                                aria-selected={active}
                                className={cn(
                                    'group relative flex max-w-[200px] min-w-[120px] flex-1 items-center gap-1.5 rounded-t-lg px-2.5 py-1.5 text-left transition-colors sm:flex-none',
                                    active
                                        ? 'bg-background text-foreground'
                                        : 'text-muted-foreground hover:bg-background/50 hover:text-foreground'
                                )}
                            >
                                <button
                                    type="button"
                                    onClick={() => goTab(tab.id)}
                                    className="flex min-w-0 flex-1 items-center gap-1.5"
                                    title={titleOf(tab)}
                                >
                                    <Icon size={13} className={cn('shrink-0', active ? 'text-primary' : undefined)} />
                                    <span className="truncate text-[12.5px] font-medium tracking-tight">
                                        {titleOf(tab)}
                                    </span>
                                </button>
                                {!pinned && (
                                    <button
                                        type="button"
                                        aria-label={t('closeTab')}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            closeTab(tab.id)
                                        }}
                                        className={cn(
                                            'text-muted-foreground hover:bg-muted hover:text-foreground flex size-5 shrink-0 items-center justify-center rounded-md transition-colors',
                                            active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                                        )}
                                    >
                                        <X size={12} />
                                    </button>
                                )}
                                {active && (
                                    <span className="bg-background absolute inset-x-0 -bottom-px h-px" aria-hidden />
                                )}
                            </div>
                        )
                    })}
                </div>

                <div className="flex shrink-0 items-center gap-1">
                    <span className="text-primary mr-1 hidden text-sm font-semibold tracking-tight lowercase sm:inline">
                        {APP_NAME}
                    </span>
                    <button
                        type="button"
                        onClick={openSearchSpotlight}
                        aria-label={t('searchLabel')}
                        className={cn(
                            'text-muted-foreground hover:bg-background/70 hover:text-foreground',
                            'inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 transition-colors active:scale-[0.97]'
                        )}
                    >
                        <Search size={15} />
                    </button>
                </div>
            </div>

            <SearchSpotlight />
        </>
    )
}

export const Header = AppHeader
