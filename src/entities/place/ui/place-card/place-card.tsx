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
                'active:scale-[0.97] rounded-2xl px-2.5 py-2.5 transition-transform duration-100',
                'hover:bg-[color-mix(in_srgb,var(--sage)_7%,transparent)]',
                className
            )}
        >
            <div className="flex items-center gap-3">
                <span
                    className={cn(
                        'flex size-10 shrink-0 items-center justify-center rounded-2xl',
                        hasCoords
                            ? 'bg-sage/18 text-sage ring-1 ring-[color-mix(in_srgb,var(--sage)_22%,transparent)]'
                            : 'bg-muted/60 text-muted-foreground'
                    )}
                >
                    <MapPin size={18} strokeWidth={1.7} />
                </span>
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <p className="text-foreground min-w-0 flex-1 truncate text-[15px] leading-snug font-medium tracking-tight">
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
