'use client'

import { Person } from '../../model'
import { cn } from '@/shared/utils'
import { useTranslations } from 'next-intl'

export type PersonCardProps = {
    person: Person
    className?: string
}

export const PersonCard = ({ person, className }: PersonCardProps) => {
    const t = useTranslations('home.archive')

    return (
        <div
            className={cn(
                'active:scale-[0.97] rounded-xl px-3 py-2.5 transition-transform duration-100',
                'hover:bg-sidebar-accent',
                className
            )}
        >
            <div className="flex items-center gap-2">
                <p className="text-foreground min-w-0 flex-1 truncate text-sm leading-snug font-medium">
                    {person.name}
                </p>
                {person.autodetected && (
                    <span className="bg-sage/15 text-sage shrink-0 rounded-md px-1.5 py-0.5 text-[11px] font-medium">
                        {t('autodetected')}
                    </span>
                )}
            </div>
        </div>
    )
}
