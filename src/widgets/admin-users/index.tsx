'use client'

import { useEffect, useState } from 'react'
import { Modal, Switch } from '@mantine/core'
import { useTranslations } from 'next-intl'
import {
    useSearchUsers,
    type UserAdminSearchRequest
} from '@/entities/admin-user/api/use-search-users'
import {
    useUpdateUser,
    useSoftDeleteUser as useAdminSoftDeleteUser,
    useHardDeleteUser as useAdminHardDeleteUser,
    type AdminUpdateUserRequest
} from '@/entities/admin-user/api/use-update-user'
import { User } from '@/entities/user/model'
import { Button, TextInput, Surface } from '@/shared/ui'
import { DEFAULT_PAGE_SIZE } from '@/shared/types'
import { AdminPagination } from '@/widgets/admin-shared/pagination'
import { dayjsInstance } from '@/shared/utils'

export const AdminUsers = () => {
    const t = useTranslations('admin')
    const [nickname, setNickname] = useState('')
    const [email, setEmail] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [page, setPage] = useState(1)
    const [editing, setEditing] = useState<User | null>(null)
    const [draft, setDraft] = useState<AdminUpdateUserRequest>({})

    const { mutate: search, data, isPending, isError } = useSearchUsers()
    const { mutate: updateUser, isPending: isUpdating } = useUpdateUser()
    const { mutate: softDelete, isPending: isSoftDeleting } = useAdminSoftDeleteUser()
    const { mutate: hardDelete, isPending: isHardDeleting } = useAdminHardDeleteUser()

    const runSearch = (nextPage = page) => {
        const request: UserAdminSearchRequest = {
            pagination: { page: nextPage, count: DEFAULT_PAGE_SIZE },
            filters: {
                ...(nickname.trim() ? { nickname: nickname.trim() } : {}),
                ...(email.trim() ? { email: email.trim() } : {}),
                ...(phoneNumber.trim() ? { phoneNumber: phoneNumber.trim() } : {})
            },
            sorts: { createdAt: 'DESC' }
        }
        search(request)
    }

    useEffect(() => {
        runSearch(1)
        // eslint-disable-next-line react-hooks/exhaustive-deps -- initial load only
    }, [])

    const users = data?.data.data ?? []
    const total = data?.data.count ?? 0

    const openEdit = (user: User) => {
        setEditing(user)
        setDraft({
            nickname: user.nickname,
            email: user.email ?? null,
            phoneNumber: user.phoneNumber ?? null,
            isEmailVerified: user.isEmailVerified,
            isPhoneVerified: user.isPhoneVerified
        })
    }

    const onSaveEdit = () => {
        if (!editing) return
        updateUser(
            { id: editing.id, data: draft },
            {
                onSuccess: () => {
                    setEditing(null)
                    runSearch(page)
                }
            }
        )
    }

    const onSoftDelete = (id: string) => {
        if (!window.confirm(t('users.confirmSoft'))) return
        softDelete(id, { onSuccess: () => runSearch(page) })
    }

    const onHardDelete = (id: string) => {
        if (!window.confirm(t('users.confirmHard'))) return
        hardDelete(id, { onSuccess: () => runSearch(page) })
    }

    return (
        <div className="flex flex-col gap-4">
            <Surface className="flex flex-col gap-3 p-4 md:flex-row md:flex-wrap md:items-end">
                <TextInput
                    label={t('users.nickname')}
                    value={nickname}
                    onChange={(e) => setNickname(e.currentTarget.value)}
                    className="md:w-44"
                />
                <TextInput
                    label={t('users.email')}
                    value={email}
                    onChange={(e) => setEmail(e.currentTarget.value)}
                    className="md:w-52"
                />
                <TextInput
                    label={t('users.phone')}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.currentTarget.value)}
                    className="md:w-44"
                />
                <Button
                    type="button"
                    loading={isPending}
                    onClick={() => {
                        setPage(1)
                        runSearch(1)
                    }}
                >
                    {t('search')}
                </Button>
            </Surface>

            {isError && <p className="text-sm text-red-600">{t('error')}</p>}
            {!isPending && users.length === 0 && <p className="text-muted-foreground text-sm">{t('empty')}</p>}

            <div className="border-hairline overflow-x-auto rounded-xl border">
                <table className="w-full min-w-[640px] text-left text-sm">
                    <thead className="bg-muted/50 text-muted-foreground text-xs tracking-wide uppercase">
                        <tr>
                            <th className="px-3 py-2 font-medium">{t('users.nickname')}</th>
                            <th className="px-3 py-2 font-medium">{t('users.email')}</th>
                            <th className="px-3 py-2 font-medium">{t('users.phone')}</th>
                            <th className="px-3 py-2 font-medium">{t('users.role')}</th>
                            <th className="px-3 py-2 font-medium">{t('users.created')}</th>
                            <th className="px-3 py-2 font-medium">{t('actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="border-hairline border-t">
                                <td className="px-3 py-2.5 font-medium">{user.nickname}</td>
                                <td className="text-muted-foreground px-3 py-2.5">
                                    {user.email ?? '—'}
                                    {user.email ? (user.isEmailVerified ? ' ✓' : '') : ''}
                                </td>
                                <td className="text-muted-foreground px-3 py-2.5">
                                    {user.phoneNumber ?? '—'}
                                    {user.phoneNumber ? (user.isPhoneVerified ? ' ✓' : '') : ''}
                                </td>
                                <td className="text-muted-foreground px-3 py-2.5 font-mono text-xs">
                                    {user.roleId.slice(0, 8)}…
                                </td>
                                <td className="text-muted-foreground px-3 py-2.5 whitespace-nowrap">
                                    {dayjsInstance(user.createdAt).format('DD.MM.YYYY')}
                                </td>
                                <td className="px-3 py-2.5">
                                    <div className="flex flex-wrap gap-1">
                                        <Button type="button" variant="subtle" size="sm" onClick={() => openEdit(user)}>
                                            {t('edit')}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            loading={isSoftDeleting}
                                            onClick={() => onSoftDelete(user.id)}
                                        >
                                            {t('users.softDelete')}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="danger"
                                            size="sm"
                                            loading={isHardDeleting}
                                            onClick={() => onHardDelete(user.id)}
                                        >
                                            {t('users.hardDelete')}
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <AdminPagination
                page={page}
                pageSize={DEFAULT_PAGE_SIZE}
                total={total}
                disabled={isPending}
                onPageChange={(next) => {
                    setPage(next)
                    runSearch(next)
                }}
            />

            <Modal opened={Boolean(editing)} onClose={() => setEditing(null)} title={t('users.editTitle')} centered>
                <div className="flex flex-col gap-3">
                    <TextInput
                        label={t('users.nickname')}
                        value={draft.nickname ?? ''}
                        onChange={(e) => setDraft((d) => ({ ...d, nickname: e.currentTarget.value }))}
                    />
                    <TextInput
                        label={t('users.email')}
                        value={draft.email ?? ''}
                        onChange={(e) => setDraft((d) => ({ ...d, email: e.currentTarget.value || null }))}
                    />
                    <TextInput
                        label={t('users.phone')}
                        value={draft.phoneNumber ?? ''}
                        onChange={(e) => setDraft((d) => ({ ...d, phoneNumber: e.currentTarget.value || null }))}
                    />
                    <Switch
                        checked={Boolean(draft.isEmailVerified)}
                        onChange={(e) => setDraft((d) => ({ ...d, isEmailVerified: e.currentTarget.checked }))}
                        label={t('users.emailVerified')}
                    />
                    <Switch
                        checked={Boolean(draft.isPhoneVerified)}
                        onChange={(e) => setDraft((d) => ({ ...d, isPhoneVerified: e.currentTarget.checked }))}
                        label={t('users.phoneVerified')}
                    />
                    <div className="mt-2 flex justify-end gap-2">
                        <Button type="button" variant="subtle" onClick={() => setEditing(null)}>
                            {t('cancel')}
                        </Button>
                        <Button type="button" loading={isUpdating} onClick={onSaveEdit}>
                            {t('save')}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
