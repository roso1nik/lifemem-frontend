'use client'

import { useMemo } from 'react'
import { Spotlight, type SpotlightActionData, spotlight } from '@mantine/spotlight'
import {
    Archive,
    GitBranch,
    MapPinned,
    Notebook,
    Search,
    Sparkles,
    User
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import toast from 'react-hot-toast'
import { useEntries } from '@/entities/entry/api/use-entries'
import { getEntryPreviewText } from '@/entities/entry/model'
import { useWorkspaceNavigation } from '@/features/workspace-tabs'

export const openSearchSpotlight = () => spotlight.open()

export const SearchSpotlight = () => {
    const t = useTranslations('home')
    const { data: entries = [] } = useEntries()
    const { goHome, goNote, goSection } = useWorkspaceNavigation()

    const actions = useMemo<(SpotlightActionData | { group: string; actions: SpotlightActionData[] })[]>(
        () => [
            {
                group: t('spotlight.groupNavigate'),
                actions: [
                    {
                        id: 'nav-home',
                        label: t('tab.home'),
                        description: t('spotlight.homeDesc'),
                        leftSection: <Notebook size={18} />,
                        onClick: () => goHome()
                    },
                    {
                        id: 'nav-graph',
                        label: t('tab.graph'),
                        description: t('sectionGraphBody'),
                        leftSection: <GitBranch size={18} />,
                        onClick: () => goSection('graph')
                    },
                    {
                        id: 'nav-map',
                        label: t('tab.map'),
                        description: t('sectionMapBody'),
                        leftSection: <MapPinned size={18} />,
                        onClick: () => goSection('map')
                    },
                    {
                        id: 'nav-archive',
                        label: t('tab.archive'),
                        description: t('sectionArchiveBody'),
                        leftSection: <Archive size={18} />,
                        onClick: () => goSection('archive')
                    },
                    {
                        id: 'nav-profile',
                        label: t('tab.profile'),
                        description: t('sectionProfileBody'),
                        leftSection: <User size={18} />,
                        onClick: () => goSection('profile')
                    }
                ]
            },
            {
                group: t('spotlight.groupNotes'),
                actions: entries.map((entry) => {
                    const preview = getEntryPreviewText(entry)
                    return {
                        id: `note-${entry.id}`,
                        label: preview.slice(0, 64) || t('tab.notes'),
                        description: preview.slice(64, 120) || undefined,
                        leftSection: <Notebook size={18} className="text-sage" />,
                        onClick: () =>
                            goNote({
                                id: entry.id,
                                title: preview.slice(0, 28) || t('tab.notes')
                            })
                    }
                })
            },
            {
                group: t('spotlight.groupAi'),
                actions: [
                    {
                        id: 'ask-ai',
                        label: t('spotlight.askAi'),
                        description: t('spotlight.askAiDesc'),
                        leftSection: <Sparkles size={18} className="text-primary" />,
                        onClick: () => toast(t('searchSoon'))
                    }
                ]
            }
        ],
        [entries, goHome, goNote, goSection, t]
    )

    return (
        <Spotlight
            actions={actions}
            shortcut={['mod + K', 'mod + P']}
            nothingFound={t('spotlight.empty')}
            highlightQuery
            limit={8}
            scrollable
            maxHeight={360}
            radius="lg"
            overlayProps={{
                backgroundOpacity: 0.35,
                blur: 8
            }}
            searchProps={{
                leftSection: <Search size={18} strokeWidth={2} />,
                rightSection: (
                    <span className="bg-accent text-primary flex size-7 items-center justify-center rounded-full">
                        <Sparkles size={13} />
                    </span>
                ),
                placeholder: t('searchPlaceholder')
            }}
            classNames={{
                content: 'border-hairline bg-surface-frost/95 backdrop-blur-xl shadow-lg',
                search: 'text-[15px]',
                action: 'rounded-xl',
                actionsGroup: 'text-muted-foreground text-[11px] font-medium tracking-wide uppercase'
            }}
        />
    )
}
