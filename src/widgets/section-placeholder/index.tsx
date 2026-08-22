'use client'

import { Surface } from '@/shared/ui'
import { Archive, GitBranch, MapPinned, User } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { WorkspaceSection } from '@/features/workspace-tabs'

const ICONS = {
    graph: GitBranch,
    map: MapPinned,
    profile: User,
    archive: Archive
} as const

const BODY_KEYS = {
    graph: 'sectionGraphBody',
    map: 'sectionMapBody',
    profile: 'sectionProfileBody',
    archive: 'sectionArchiveBody'
} as const

type SectionPlaceholderProps = {
    section: WorkspaceSection
}

export const SectionPlaceholder = ({ section }: SectionPlaceholderProps) => {
    const t = useTranslations('home')
    const Icon = ICONS[section]

    return (
        <div className="mx-auto flex w-full flex-1 flex-col items-start px-4 py-10 md:w-4/5 md:px-6">
            <span className="bg-accent text-primary flex size-11 items-center justify-center rounded-2xl">
                <Icon size={22} />
            </span>
            <h1 className="mt-4 text-2xl font-semibold tracking-tight">{t(`tab.${section}`)}</h1>
            <p className="text-muted-foreground mt-2 max-w-md text-sm leading-relaxed">{t(BODY_KEYS[section])}</p>
            <Surface frost className="mt-8 w-full p-5">
                <p className="text-muted-foreground text-sm">{t('sectionSoon')}</p>
            </Surface>
        </div>
    )
}
