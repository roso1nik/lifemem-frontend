'use client'

import { useTranslations } from 'next-intl'
import { X } from 'lucide-react'
import { IconButton, Surface } from '@/shared/ui'
import { useGraphSettings } from './model/graph-settings'

export const GraphHint = () => {
    const t = useTranslations('home.graphPage')
    const hintDismissed = useGraphSettings((s) => s.hintDismissed)
    const setHintDismissed = useGraphSettings((s) => s.setHintDismissed)

    if (hintDismissed) return null

    return (
        <Surface
            frost
            capsule
            className="pointer-events-auto absolute bottom-3 left-3 z-10 flex max-w-[min(100%-1.5rem,320px)] items-start gap-2 px-3 py-2 shadow-[0_8px_24px_color-mix(in_srgb,var(--foreground)_6%,transparent)]"
        >
            <p className="text-muted-foreground text-[11px] leading-snug">{t('hintBar')}</p>
            <IconButton
                size="sm"
                aria-label={t('hintDismiss')}
                className="shrink-0 rounded-full"
                onClick={() => setHintDismissed(true)}
            >
                <X size={12} />
            </IconButton>
        </Surface>
    )
}
