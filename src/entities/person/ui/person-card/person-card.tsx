'use client'

import { Person } from '../../model'
import { cn } from '@/shared/utils'
import { useTranslations } from 'next-intl'
import { Avatar } from '@/shared/ui'

export type PersonCardProps = {
    person: Person
    className?: string
}

const initialsFromName = (name: string) => {
    const parts = name.trim().split(/\s+/).filter(Boolean)
    if (parts.length === 0) return '?'
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
    return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase()
}

export const PersonCard = ({ person, className }: PersonCardProps) => {
    const t = useTranslations('home.archive')

    return (
        <div
            className={cn(
                'active:scale-[0.97] rounded-2xl px-2.5 py-2.5 transition-transform duration-100',
                'hover:bg-[color-mix(in_srgb,var(--primary)_6%,transparent)]',
                className
            )}
        >
            <div className="flex items-center gap-3">
                <Avatar size={40} radius="xl" name={person.name} color="brandColors" className="shrink-0">
                    {initialsFromName(person.name)}
                </Avatar>
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <p className="text-foreground min-w-0 flex-1 truncate text-[15px] leading-snug font-medium tracking-tight">
                            {person.name}
                        </p>
                        {person.autodetected && (
                            <span className="bg-sage/15 text-sage shrink-0 rounded-md px-1.5 py-0.5 text-[11px] font-medium">
                                {t('autodetected')}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
