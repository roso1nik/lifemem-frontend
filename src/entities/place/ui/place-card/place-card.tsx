'use client'

import { Place } from '../../model'
import { cn } from '@/shared/utils'
import { MapPin } from 'lucide-react'
import { useTranslations } from 'next-intl'

export type PlaceCardProps = {
    place: Place
    className?: string
}

export const PlaceCard = ({ place, className }: PlaceCardProps) => {
    const t = useTranslations('home.archive')
    const hasCoords = place.latitude != null && place.longitude != null

    return (
        <div
            className={cn(
                'active:scale-[0.97] rounded-xl px-3 py-2.5 transition-transform duration-100',
                'hover:bg-sidebar-accent',
                className
            )}
        >
            <div className="flex items-start gap-2">
                {hasCoords && (
                    <span className="text-sage mt-0.5 shrink-0">
                        <MapPin size={14} />
                    </span>
                )}
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <p className="text-foreground min-w-0 flex-1 truncate text-sm leading-snug font-medium">
                            {place.name}
                        </p>
                        {place.autodetected && (
                            <span className="bg-sage/15 text-sage shrink-0 rounded-md px-1.5 py-0.5 text-[11px] font-medium">
                                {t('autodetected')}
                            </span>
                        )}
                    </div>
                    {place.fullName && (
                        <p className="text-muted-foreground mt-0.5 truncate text-xs leading-snug">{place.fullName}</p>
                    )}
                </div>
            </div>
        </div>
    )
}
