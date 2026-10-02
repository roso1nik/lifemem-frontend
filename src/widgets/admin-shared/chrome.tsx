'use client'

import { cn } from '@/shared/utils'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Surface } from '@/shared/ui'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import type { SortDirection } from '@/shared/types'

export const AdminAtmosphere = ({ children, className }: { children: ReactNode; className?: string }) => (
    <div className={cn('relative isolate min-h-screen overflow-hidden', className)}>
        <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
                background: `
                    radial-gradient(ellipse 80% 50% at 10% -10%, color-mix(in srgb, var(--primary) 18%, transparent), transparent 55%),
                    radial-gradient(ellipse 60% 40% at 95% 5%, color-mix(in srgb, var(--sage) 16%, transparent), transparent 50%),
                    radial-gradient(ellipse 50% 35% at 50% 100%, color-mix(in srgb, var(--primary) 8%, transparent), transparent 55%),
                    var(--background)
                `
            }}
        />
        {children}
    </div>
)

export const AdminSectionIcon = ({
    Icon,
    tone = 'aqua'
}: {
    Icon: LucideIcon
    tone?: 'aqua' | 'sage'
}) => (
    <span
        className={cn(
            'flex size-10 shrink-0 items-center justify-center rounded-2xl',
            tone === 'aqua' ? 'bg-primary/12 text-primary' : 'bg-sage/15 text-sage'
        )}
    >
        <Icon size={18} strokeWidth={1.75} />
    </span>
)

export const AdminFilterCard = ({ children, className }: { children: ReactNode; className?: string }) => (
    <Surface frost capsule className={cn('p-4 md:p-5', className)}>
        {children}
    </Surface>
)

export const AdminTableCard = ({ children, className }: { children: ReactNode; className?: string }) => (
    <Surface frost capsule className={cn('overflow-hidden p-0', className)}>
        {children}
    </Surface>
)

export const AdminEmptyState = ({
    title,
    hint,
    Icon
}: {
    title: string
    hint?: string
    Icon?: LucideIcon
}) => (
    <Surface frost capsule className="flex flex-col items-center gap-3 px-6 py-12 text-center">
        {Icon && (
            <span className="bg-muted text-muted-foreground flex size-12 items-center justify-center rounded-full">
                <Icon size={20} strokeWidth={1.6} />
            </span>
        )}
        <div>
            <p className="text-foreground text-sm font-semibold tracking-tight">{title}</p>
            {hint && <p className="text-muted-foreground mt-1 text-xs leading-relaxed">{hint}</p>}
        </div>
    </Surface>
)

export const AdminStatusDot = ({ ok }: { ok: boolean }) => (
    <span
        className={cn(
            'inline-flex size-2 shrink-0 rounded-full',
            ok ? 'bg-sage shadow-[0_0_0_3px_color-mix(in_srgb,var(--sage)_22%,transparent)]' : 'bg-red-500'
        )}
    />
)

export const VerifiedChip = ({ verified, label }: { verified: boolean; label: string }) => (
    <span
        className={cn(
            'inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold tracking-tight',
            verified ? 'bg-sage/15 text-sage' : 'bg-muted text-muted-foreground'
        )}
    >
        {label}
    </span>
)

export const AdminSortButton = ({
    label,
    active,
    direction,
    onToggle
}: {
    label: string
    active: boolean
    direction?: SortDirection
    onToggle: () => void
}) => (
    <button
        type="button"
        onClick={onToggle}
        className={cn(
            'inline-flex items-center gap-1 rounded-md px-1 py-0.5 text-left text-[11px] font-semibold tracking-[0.08em] uppercase transition-colors active:scale-[0.97]',
            active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
        )}
    >
        {label}
        {active && direction === 'ASC' ? (
            <ArrowUp size={12} strokeWidth={2.2} />
        ) : active && direction === 'DESC' ? (
            <ArrowDown size={12} strokeWidth={2.2} />
        ) : (
            <ArrowUpDown size={12} strokeWidth={1.8} className="opacity-50" />
        )}
    </button>
)

export const cycleSort = (current: SortDirection | undefined): SortDirection =>
    current === 'DESC' ? 'ASC' : 'DESC'
