'use client'

import { UpdateNicknameForm } from '@/features/profile/update-nickname'
import { ProfileUserSettings } from '@/features/profile/user-settings'
import { ProfileContacts } from '@/features/profile/contacts'
import { ProfileBindings } from '@/features/profile/bindings'
import { ProfileDangerZone } from '@/features/profile/danger-zone'
import { Surface } from '@/shared/ui'
import { Bell, Link2, Mail, User, UserRound } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/shared/utils'

const SectionHead = ({
    Icon,
    title,
    hint,
    tone = 'aqua'
}: {
    Icon: LucideIcon
    title: string
    hint?: string
    tone?: 'aqua' | 'sage' | 'danger'
}) => (
    <div className="mb-3 flex items-center gap-3">
        <span
            className={cn(
                'flex size-9 shrink-0 items-center justify-center rounded-xl',
                tone === 'aqua' && 'bg-primary/12 text-primary',
                tone === 'sage' && 'bg-sage/15 text-sage',
                tone === 'danger' && 'bg-red-500/10 text-red-600'
            )}
        >
            <Icon size={16} strokeWidth={1.75} />
        </span>
        <div className="min-w-0">
            <h2 className="text-sm font-semibold tracking-tight">{title}</h2>
            {hint && <p className="text-muted-foreground mt-0.5 text-xs leading-relaxed">{hint}</p>}
        </div>
    </div>
)

export const ProfilePage = () => {
    const t = useTranslations('profile')

    return (
        <div className="mx-auto flex w-full flex-1 flex-col px-4 py-6 md:w-4/5 md:px-6 md:py-8">
            <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
                className="relative mb-8 overflow-hidden rounded-[24px]"
            >
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0"
                    style={{
                        background: `
                            radial-gradient(ellipse 80% 90% at 12% 10%, color-mix(in srgb, var(--primary) 22%, transparent), transparent 58%),
                            radial-gradient(ellipse 70% 80% at 88% 20%, color-mix(in srgb, var(--sage) 16%, transparent), transparent 52%),
                            linear-gradient(180deg, color-mix(in srgb, var(--card) 55%, transparent), color-mix(in srgb, var(--background) 40%, transparent))
                        `
                    }}
                />
                <div className="border-hairline bg-surface-frost/40 relative border px-5 py-6 backdrop-blur-xl sm:px-7 sm:py-8">
                    <span className="bg-primary/12 text-primary shadow-[0_8px_24px_color-mix(in_srgb,var(--primary)_12%,transparent)] flex size-14 items-center justify-center rounded-[18px]">
                        <User size={26} strokeWidth={1.6} />
                    </span>
                    <h1 className="mt-5 text-3xl font-semibold tracking-tight md:text-4xl">{t('title')}</h1>
                    <p className="text-muted-foreground mt-2 max-w-md text-[15px] leading-relaxed">{t('subtitle')}</p>
                </div>
            </motion.div>

            <div className="flex flex-col gap-7">
                <motion.section
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', bounce: 0, duration: 0.4, delay: 0.04 }}
                >
                    <SectionHead Icon={UserRound} title={t('nickname')} hint={t('nicknameHint')} />
                    <Surface frost capsule className="p-5">
                        <UpdateNicknameForm />
                    </Surface>
                </motion.section>

                <motion.section
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', bounce: 0, duration: 0.4, delay: 0.08 }}
                >
                    <SectionHead Icon={Bell} title={t('settings')} hint={t('settingsHint')} tone="sage" />
                    <ProfileUserSettings />
                </motion.section>

                <motion.section
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', bounce: 0, duration: 0.4, delay: 0.12 }}
                >
                    <SectionHead Icon={Mail} title={t('contacts')} hint={t('contactsHint')} />
                    <ProfileContacts />
                </motion.section>

                <motion.section
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', bounce: 0, duration: 0.4, delay: 0.16 }}
                >
                    <SectionHead Icon={Link2} title={t('bindings')} tone="sage" />
                    <ProfileBindings />
                </motion.section>

                <motion.section
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', bounce: 0, duration: 0.4, delay: 0.2 }}
                >
                    <ProfileDangerZone />
                </motion.section>
            </div>
        </div>
    )
}
