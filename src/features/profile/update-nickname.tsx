'use client'

import { useSelf } from '@/entities/user/api/use-self'
import { useUpdateSelf, updateSelfSchema } from '@/entities/user/api/use-update-self'
import { Button, TextInput } from '@/shared/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { User } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'
import z from 'zod'

export const UpdateNicknameForm = () => {
    const t = useTranslations('profile')
    const { data: self } = useSelf()
    const { mutate: updateSelf, isPending } = useUpdateSelf()

    const form = useForm<z.infer<typeof updateSelfSchema>>({
        resolver: zodResolver(updateSelfSchema),
        defaultValues: { nickname: self?.info.nickname ?? '' }
    })

    useEffect(() => {
        if (self?.info.nickname) {
            form.reset({ nickname: self.info.nickname })
        }
    }, [self?.info.nickname, form])

    return (
        <form className="flex flex-col gap-3" onSubmit={form.handleSubmit((data) => updateSelf(data))}>
            <Controller
                control={form.control}
                name="nickname"
                render={({ field }) => (
                    <TextInput
                        {...field}
                        label={t('nickname')}
                        error={form.formState.errors.nickname?.message}
                        leftSection={<User size={16} />}
                    />
                )}
            />
            <Button type="submit" loading={isPending} className="self-start">
                {t('save')}
            </Button>
        </form>
    )
}
