'use client'

import { AppShell, Burger, Group } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { ReactNode, useState } from 'react'
import { NotesList } from '@/widgets/notes-list'
import { AccountMenu } from '@/widgets/account-menu'
import { APP_NAME } from '@/shared/config'
import { useTranslations } from 'next-intl'
import { Note } from '@/entities/note/model'

interface MainShellProps {
    children: ReactNode
}

export const MainShell = ({ children }: MainShellProps) => {
    const [opened, { toggle, close }] = useDisclosure()
    const t = useTranslations('home')
    const [selectedId, setSelectedId] = useState<string | null>(null)

    const onSelect = (note: Note) => {
        setSelectedId(note.id)
        close()
    }

    return (
        <AppShell
            header={{ height: 56 }}
            navbar={{
                width: 300,
                breakpoint: 'sm',
                collapsed: { mobile: !opened }
            }}
            padding={0}
            className="min-h-screen"
        >
            <AppShell.Header className="border-border bg-background/80 backdrop-blur-md">
                <Group h="100%" px="md" justify="space-between">
                    <Group gap="sm">
                        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" aria-label={t('openNotes')} />
                        <span className="text-primary text-lg font-semibold tracking-tight lowercase">{APP_NAME}</span>
                    </Group>
                    <span className="text-muted-foreground hidden text-sm sm:inline">{t('notes')}</span>
                </Group>
            </AppShell.Header>

            <AppShell.Navbar className="border-sidebar-border bg-sidebar flex flex-col">
                <div className="border-sidebar-border flex items-center border-b px-4 py-3">
                    <p className="text-sm font-medium">{t('notes')}</p>
                </div>
                <NotesList selectedId={selectedId} onSelect={onSelect} />
                <AccountMenu />
            </AppShell.Navbar>

            <AppShell.Main className="bg-background flex min-h-[calc(100vh-56px)] flex-col">
                {children}
            </AppShell.Main>
        </AppShell>
    )
}
