'use client'

import { UpdateNicknameForm } from '@/features/profile/update-nickname'
import { ProfileUserSettings } from '@/features/profile/user-settings'
import { ProfileContacts } from '@/features/profile/contacts'
import { ProfileBindings } from '@/features/profile/bindings'
import { ProfileDangerZone } from '@/features/profile/danger-zone'
import { User } from 'lucide-react'
import { useTranslations } from 'next-intl'

export const ProfilePage = () => {
    const t = useTranslations('profile')

    return (
        <div className="mx-auto flex w-full flex-1 flex-col px-4 py-10 md:w-4/5 md:px-6">
            <span className="bg-accent text-primary flex size-11 items-center justify-center rounded-2xl">
                <User size={22} />
            </span>
            <h1 className="mt-4 text-2xl font-semibold tracking-tight">{t('title')}</h1>
            <p className="text-muted-foreground mt-2 max-w-md text-sm leading-relaxed">{t('subtitle')}</p>

            <div className="mt-8 flex flex-col gap-6">
                <section>
                    <h2 className="mb-3 text-sm font-medium">{t('nickname')}</h2>
                    <UpdateNicknameForm />
                </section>

                <section>
                    <h2 className="mb-3 text-sm font-medium">{t('settings')}</h2>
                    <ProfileUserSettings />
                </section>

                <section>
                    <h2 className="mb-3 text-sm font-medium">{t('contacts')}</h2>
                    <ProfileContacts />
                </section>

                <section>
                    <ProfileBindings />
                </section>

                <section>
                    <ProfileDangerZone />
                </section>
            </div>
        </div>
    )
}
