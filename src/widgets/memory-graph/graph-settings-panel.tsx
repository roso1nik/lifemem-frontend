'use client'

import { ColorInput, Slider, Switch } from '@mantine/core'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { RotateCcw, Settings2, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button, IconButton, Surface } from '@/shared/ui'
import { DEFAULT_GRAPH_COLORS, useGraphSettings } from './model/graph-settings'

type GraphSettingsPanelProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
}

const SWATCHES = ['#5B9FB0', '#7BB8C6', '#7FA892', '#8FB59E', '#94A3B8', '#F87171', '#FBBF24', '#A78BFA']

export const GraphSettingsPanel = ({ open, onOpenChange }: GraphSettingsPanelProps) => {
    const t = useTranslations('home.graphPage')
    const reduceMotion = Boolean(useReducedMotion())
    const rendererMode = useGraphSettings((s) => s.rendererMode)
    const forces = useGraphSettings((s) => s.forces)
    const display = useGraphSettings((s) => s.display)
    const colors = useGraphSettings((s) => s.colors)
    const hintDismissed = useGraphSettings((s) => s.hintDismissed)
    const setForces = useGraphSettings((s) => s.setForces)
    const setDisplay = useGraphSettings((s) => s.setDisplay)
    const setColor = useGraphSettings((s) => s.setColor)
    const setHintDismissed = useGraphSettings((s) => s.setHintDismissed)
    const reset = useGraphSettings((s) => s.reset)
    const isPhysics = rendererMode === 'physics'

    return (
        <>
            <IconButton
                aria-label={t('settings.open')}
                aria-expanded={open}
                className="pointer-events-auto absolute top-3 right-3 z-20 rounded-full"
                onClick={() => onOpenChange(!open)}
            >
                {open ? <X size={16} /> : <Settings2 size={16} />}
            </IconButton>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={reduceMotion ? false : { opacity: 0, y: -8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={reduceMotion ? undefined : { opacity: 0, y: -6, scale: 0.98 }}
                        transition={{ type: 'spring', bounce: 0, duration: 0.35 }}
                        className="pointer-events-auto absolute top-12 right-3 z-20 w-[min(100%-1.5rem,300px)]"
                    >
                        <Surface
                            frost
                            capsule
                            className="border-hairline flex max-h-[min(70vh,520px)] flex-col gap-4 overflow-y-auto p-4 shadow-[0_12px_32px_color-mix(in_srgb,var(--foreground)_8%,transparent)]"
                        >
                            <div className="flex items-center justify-between gap-2">
                                <p className="text-sm font-semibold">{t('settings.title')}</p>
                                <Button
                                    type="button"
                                    variant="subtle"
                                    size="sm"
                                    className="rounded-full"
                                    leftSection={<RotateCcw size={13} />}
                                    onClick={() => reset()}
                                >
                                    {t('settings.reset')}
                                </Button>
                            </div>

                            {isPhysics ? (
                                <>
                                    <section className="flex flex-col gap-3">
                                        <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                                            {t('settings.forces')}
                                        </p>
                                        <ForceSlider
                                            label={t('settings.center')}
                                            value={forces.center}
                                            min={0}
                                            max={0.4}
                                            step={0.01}
                                            onChange={(center) => setForces({ center })}
                                        />
                                        <ForceSlider
                                            label={t('settings.repel')}
                                            value={forces.repel}
                                            min={40}
                                            max={800}
                                            step={10}
                                            onChange={(repel) => setForces({ repel })}
                                        />
                                        <ForceSlider
                                            label={t('settings.linkStrength')}
                                            value={forces.linkStrength}
                                            min={0.05}
                                            max={1}
                                            step={0.05}
                                            onChange={(linkStrength) => setForces({ linkStrength })}
                                        />
                                        <ForceSlider
                                            label={t('settings.linkDistance')}
                                            value={forces.linkDistance}
                                            min={40}
                                            max={320}
                                            step={5}
                                            onChange={(linkDistance) => setForces({ linkDistance })}
                                        />
                                    </section>

                                    <section className="flex flex-col gap-3">
                                        <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                                            {t('settings.display')}
                                        </p>
                                        <ForceSlider
                                            label={t('settings.nodeSize')}
                                            value={display.nodeSize}
                                            min={2}
                                            max={14}
                                            step={0.5}
                                            onChange={(nodeSize) => setDisplay({ nodeSize })}
                                        />
                                        <ForceSlider
                                            label={t('settings.linkWidth')}
                                            value={display.linkWidth}
                                            min={0.5}
                                            max={4}
                                            step={0.05}
                                            onChange={(linkWidth) => setDisplay({ linkWidth })}
                                        />
                                        <ForceSlider
                                            label={t('settings.labelFadeZoom')}
                                            value={display.labelFadeZoom}
                                            min={0.2}
                                            max={1.5}
                                            step={0.05}
                                            onChange={(labelFadeZoom) => setDisplay({ labelFadeZoom })}
                                        />
                                        <Switch
                                            checked={display.showLabels}
                                            onChange={(e) =>
                                                setDisplay({ showLabels: e.currentTarget.checked })
                                            }
                                            label={t('settings.showLabels')}
                                        />
                                        <Switch
                                            checked={display.drift}
                                            onChange={(e) => setDisplay({ drift: e.currentTarget.checked })}
                                            label={t('settings.drift')}
                                        />
                                        <LocalDepthControl
                                            value={display.localDepth}
                                            onChange={(localDepth) => setDisplay({ localDepth })}
                                            label={t('settings.localDepth')}
                                            valueLabel={(depth) => t('settings.localDepthValue', { depth })}
                                        />
                                    </section>

                                    <section className="flex flex-col gap-3">
                                        <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                                            {t('settings.colors')}
                                        </p>
                                        <ColorField
                                            label={t('typeEntry')}
                                            value={colors.entry}
                                            onChange={(value) => setColor('entry', value)}
                                            onTheme={() => setColor('entry', DEFAULT_GRAPH_COLORS.entry)}
                                            themeLabel={t('settings.useTheme')}
                                        />
                                        <ColorField
                                            label={t('typePerson')}
                                            value={colors.person}
                                            onChange={(value) => setColor('person', value)}
                                            onTheme={() => setColor('person', DEFAULT_GRAPH_COLORS.person)}
                                            themeLabel={t('settings.useTheme')}
                                        />
                                        <ColorField
                                            label={t('typePlace')}
                                            value={colors.place}
                                            onChange={(value) => setColor('place', value)}
                                            onTheme={() => setColor('place', DEFAULT_GRAPH_COLORS.place)}
                                            themeLabel={t('settings.useTheme')}
                                        />
                                    </section>
                                </>
                            ) : (
                                <>
                                    <p className="text-muted-foreground text-xs leading-relaxed">
                                        {t('settings.physicsOnlyHint')}
                                    </p>
                                    <section className="flex flex-col gap-3">
                                        <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                                            {t('settings.display')}
                                        </p>
                                        <LocalDepthControl
                                            value={display.localDepth}
                                            onChange={(localDepth) => setDisplay({ localDepth })}
                                            label={t('settings.localDepth')}
                                            valueLabel={(depth) => t('settings.localDepthValue', { depth })}
                                        />
                                    </section>
                                </>
                            )}

                            {hintDismissed && (
                                <Button
                                    type="button"
                                    variant="subtle"
                                    className="self-start rounded-full"
                                    onClick={() => setHintDismissed(false)}
                                >
                                    {t('settings.showHints')}
                                </Button>
                            )}
                        </Surface>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

const LocalDepthControl = ({
    value,
    onChange,
    label,
    valueLabel
}: {
    value: 1 | 2
    onChange: (depth: 1 | 2) => void
    label: string
    valueLabel: (depth: 1 | 2) => string
}) => (
    <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium">{label}</span>
        <div className="flex gap-2">
            {([1, 2] as const).map((depth) => (
                <button
                    key={depth}
                    type="button"
                    onClick={() => onChange(depth)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-transform active:scale-[0.97] ${
                        value === depth
                            ? 'bg-primary/15 text-primary'
                            : 'bg-muted text-muted-foreground'
                    }`}
                >
                    {valueLabel(depth)}
                </button>
            ))}
        </div>
    </div>
)

const ForceSlider = ({
    label,
    value,
    min,
    max,
    step,
    onChange
}: {
    label: string
    value: number
    min: number
    max: number
    step: number
    onChange: (value: number) => void
}) => (
    <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium">{label}</span>
            <span className="text-muted-foreground text-[11px] tabular-nums">{formatValue(value)}</span>
        </div>
        <Slider
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={onChange}
            size="sm"
            color="brandColors"
        />
    </div>
)

const ColorField = ({
    label,
    value,
    onChange,
    onTheme,
    themeLabel
}: {
    label: string
    value: string | null
    onChange: (value: string | null) => void
    onTheme: () => void
    themeLabel: string
}) => (
    <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium">{label}</span>
            <button
                type="button"
                onClick={onTheme}
                className="text-primary text-[11px] font-medium transition-transform active:scale-[0.97]"
            >
                {themeLabel}
            </button>
        </div>
        <ColorInput
            value={value ?? ''}
            placeholder={themeLabel}
            onChange={(next) => onChange(next || null)}
            format="hex"
            swatches={SWATCHES}
            size="xs"
            radius="xl"
        />
    </div>
)

const formatValue = (value: number) => {
    if (Number.isInteger(value)) return String(value)
    return value < 1 ? value.toFixed(2) : value.toFixed(1)
}
