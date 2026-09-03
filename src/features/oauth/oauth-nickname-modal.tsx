'use client'

import { useEffect, useState } from 'react'
import { Modal } from '@mantine/core'
import { useTranslations } from 'next-intl'
import { Button, TextInput } from '@/shared/ui'
import { sanitizeNickname } from '@/shared/lib/oauth'

type OAuthNicknameModalProps = {
    opened: boolean
    defaultNickname: string
    loading?: boolean
    onClose: () => void
    onSubmit: (nickname: string) => void
}

export const OAuthNicknameModal = ({
    opened,
    defaultNickname,
    loading,
    onClose,
    onSubmit
}: OAuthNicknameModalProps) => {
    const t = useTranslations('auth')
    const [nickname, setNickname] = useState(defaultNickname)

    useEffect(() => {
        if (opened) setNickname(defaultNickname)
    }, [opened, defaultNickname])

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={t('oauthNicknameTitle')}
            centered
        >
            <p className="text-muted-foreground mb-4 text-sm">{t('oauthNicknameHint')}</p>
            <TextInput
                label={t('nickname')}
                value={nickname}
                onChange={(e) => setNickname(sanitizeNickname(e.currentTarget.value))}
                maxLength={32}
            />
            <div className="mt-4 flex justify-end gap-2">
                <Button variant="subtle" onClick={onClose}>
                    {t('cancel')}
                </Button>
                <Button
                    loading={loading}
                    disabled={nickname.length < 2}
                    onClick={() => onSubmit(nickname)}
                >
                    {t('submitLogin')}
                </Button>
            </div>
        </Modal>
    )
}
