'use client'

import { useSoftDeleteUser } from '@/entities/user/api/use-soft-delete'
import { Button, Surface } from '@/shared/ui'
import { Modal } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { AlertTriangle } from 'lucide-react'
import { useTranslations } from 'next-intl'

export const ProfileDangerZone = () => {
    const t = useTranslations('profile')
    const [opened, { open, close }] = useDisclosure(false)
    const { mutate: deleteAccount, isPending } = useSoftDeleteUser()

    return (
        <Surface
            capsule
            className="border-red-500/20 bg-[color-mix(in_srgb,var(--card)_88%,#ef4444)] p-5"
        >
            <div className="mb-3 flex items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-600">
                    <AlertTriangle size={16} strokeWidth={1.75} />
                </span>
                <div>
                    <h3 className="text-sm font-semibold tracking-tight text-red-600">{t('dangerTitle')}</h3>
                    <p className="text-muted-foreground mt-1 text-sm leading-relaxed">{t('dangerHint')}</p>
                </div>
            </div>
            <Button variant="danger" onClick={open} className="rounded-full">
                {t('deleteAccount')}
            </Button>

            <Modal opened={opened} onClose={close} title={t('deleteAccount')} centered>
                <p className="text-muted-foreground mb-4 text-sm">{t('deleteConfirm')}</p>
                <div className="flex justify-end gap-2">
                    <Button variant="subtle" onClick={close}>
                        {t('cancel')}
                    </Button>
                    <Button variant="danger" loading={isPending} onClick={() => deleteAccount()}>
                        {t('deleteAccount')}
                    </Button>
                </div>
            </Modal>
        </Surface>
    )
}
