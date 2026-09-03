'use client'

import { useSoftDeleteUser } from '@/entities/user/api/use-soft-delete'
import { Button, Surface } from '@/shared/ui'
import { Modal } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useTranslations } from 'next-intl'

export const ProfileDangerZone = () => {
    const t = useTranslations('profile')
    const [opened, { open, close }] = useDisclosure(false)
    const { mutate: deleteAccount, isPending } = useSoftDeleteUser()

    return (
        <Surface className="border-destructive/20 p-4">
            <h3 className="text-destructive mb-2 text-sm font-medium">{t('dangerTitle')}</h3>
            <p className="text-muted-foreground mb-4 text-sm">{t('dangerHint')}</p>
            <Button variant="danger" onClick={open}>
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
