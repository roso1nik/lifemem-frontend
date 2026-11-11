'use client'

import { useTranslations } from 'next-intl'
import { Surface } from '@/shared/ui'
import type { ForceGraphNode } from './map-graph'

type GraphHoverTooltipProps = {
    node: ForceGraphNode | null
    position: { x: number; y: number } | null
}

export const GraphHoverTooltip = ({ node, position }: GraphHoverTooltipProps) => {
    const t = useTranslations('home.graphPage')

    if (!node || !position) return null

    const hint =
        node.type === 'entry' ? t('hintClickNote') : t('hintClickLocal')

    return (
        <div
            className="pointer-events-none absolute z-20 -translate-x-1/2"
            style={{ left: position.x, top: position.y + 18 }}
        >
            <Surface frost capsule className="max-w-[220px] px-3 py-2 shadow-[0_8px_24px_color-mix(in_srgb,var(--foreground)_8%,transparent)]">
                <p className="text-foreground text-xs font-medium">{node.name}</p>
                <p className="text-muted-foreground mt-0.5 text-[11px] leading-snug">{hint}</p>
            </Surface>
        </div>
    )
}
