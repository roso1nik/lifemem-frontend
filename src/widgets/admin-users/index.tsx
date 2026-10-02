'use client'

import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'
import { Modal, Switch } from '@mantine/core'
import { useTranslations } from 'next-intl'
import { useSearchUsers } from '@/entities/admin-user/api/use-search-users'
import {
    adminUpdateUserSchema,
    useUpdateUser,
    useSoftDeleteUser as useAdminSoftDeleteUser,
    useHardDeleteUser as useAdminHardDeleteUser,
    type AdminUpdateUserRequest
} from '@/entities/admin-user/api/use-update-user'
import { User } from '@/entities/user/model'
import { Button, Loader, TextInput } from '@/shared/ui'
import { DEFAULT_PAGE_SIZE, emailSchema, type SortDirection } from '@/shared/types'
import { AdminPagination } from '@/widgets/admin-shared/pagination'
import {
    AdminEmptyState,
    AdminFilterCard,
    AdminSortButton,
    AdminTableCard,
    VerifiedChip,
    cycleSort
} from '@/widgets/admin-shared/chrome'
import { dayjsInstance } from '@/shared/utils'
import { ChevronDown, Search, Users } from 'lucide-react'
import { cn } from '@/shared/utils'

const searchSchema = z.object({
    query: z.string(),
    nickname: z.string(),
    email: z.string(),
    phoneNumber: z.string()
})

type SearchValues = z.infer<typeof searchSchema>

const editSchema = adminUpdateUserSchema.extend({
    nickname: z.string().min(1),
    email: z
        .string()
        .nullable()
        .optional()
        .refine((value) => !value || emailSchema.safeParse(value).success, {
            message: 'Invalid email'
        }),
    phoneNumber: z.string().nullable().optional(),
    isEmailVerified: z.boolean(),
    isPhoneVerified: z.boolean()
})

type EditValues = z.infer<typeof editSchema>

type DeleteTarget = { id: string; kind: 'soft' | 'hard'; nickname: string }

export const AdminUsers = () => {
    const t = useTranslations('admin')
    const [page, setPage] = useState(1)
    const [createdSort, setCreatedSort] = useState<SortDirection>('DESC')
    const [advancedOpen, setAdvancedOpen] = useState(false)
    const [editing, setEditing] = useState<User | null>(null)
    const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null)

    const searchForm = useForm<SearchValues>({
        resolver: zodResolver(searchSchema),
        defaultValues: { query: '', nickname: '', email: '', phoneNumber: '' }
    })

    const editForm = useForm<EditValues>({
        resolver: zodResolver(editSchema),
        defaultValues: {
            nickname: '',
            email: '',
            phoneNumber: '',
            isEmailVerified: false,
            isPhoneVerified: false
        }
    })

    const { mutate: search, data, isPending, isError } = useSearchUsers()
    const { mutate: updateUser, isPending: isUpdating } = useUpdateUser()
    const { mutate: softDelete, isPending: isSoftDeleting } = useAdminSoftDeleteUser()
    const { mutate: hardDelete, isPending: isHardDeleting } = useAdminHardDeleteUser()

    const runSearch = (values: SearchValues, nextPage = 1, sort: SortDirection = createdSort) => {
        setPage(nextPage)
        search({
            pagination: { page: nextPage, count: DEFAULT_PAGE_SIZE },
            query: values.query.trim() || undefined,
            filters: {
                ...(values.nickname.trim() ? { nickname: values.nickname.trim() } : {}),
                ...(values.email.trim() ? { email: values.email.trim() } : {}),
                ...(values.phoneNumber.trim() ? { phoneNumber: values.phoneNumber.trim() } : {})
            },
            sorts: { createdAt: sort }
        })
    }

    useEffect(() => {
        runSearch(searchForm.getValues(), 1, createdSort)
        // eslint-disable-next-line react-hooks/exhaustive-deps -- initial load
    }, [])

    const users = data?.data.data ?? []
    const total = data?.data.count ?? 0

    const openEdit = (user: User) => {
        setEditing(user)
        editForm.reset({
            nickname: user.nickname,
            email: user.email ?? '',
            phoneNumber: user.phoneNumber ?? '',
            isEmailVerified: user.isEmailVerified,
            isPhoneVerified: user.isPhoneVerified
        })
    }

    const onSaveEdit = (values: EditValues) => {
        if (!editing) return
        const payload: AdminUpdateUserRequest = {
            nickname: values.nickname,
            email: values.email?.trim() ? values.email : null,
            phoneNumber: values.phoneNumber?.trim() ? values.phoneNumber : null,
            isEmailVerified: values.isEmailVerified,
            isPhoneVerified: values.isPhoneVerified
        }
        updateUser(
            { id: editing.id, data: payload },
            {
                onSuccess: () => {
                    setEditing(null)
                    runSearch(searchForm.getValues(), page, createdSort)
                }
            }
        )
    }

    const onConfirmDelete = () => {
        if (!deleteTarget) return
        const onSuccess = () => {
            setDeleteTarget(null)
            runSearch(searchForm.getValues(), page, createdSort)
        }
        if (deleteTarget.kind === 'soft') softDelete(deleteTarget.id, { onSuccess })
        else hardDelete(deleteTarget.id, { onSuccess })
    }

    const toggleCreatedSort = () => {
        const next = cycleSort(createdSort)
        setCreatedSort(next)
        runSearch(searchForm.getValues(), 1, next)
    }

    return (
        <div className="flex flex-col gap-4">
            <AdminFilterCard className="flex flex-col gap-3">
                <form
                    className="flex flex-col gap-3"
                    onSubmit={searchForm.handleSubmit((values) => runSearch(values, 1, createdSort))}
                >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <Controller
                            control={searchForm.control}
                            name="query"
                            render={({ field }) => (
                                <TextInput
                                    {...field}
                                    placeholder={t('queryPlaceholder')}
                                    leftSection={<Search size={16} />}
                                    className="min-w-0 flex-1"
                                />
                            )}
                        />
                        <div className="flex shrink-0 gap-2">
                            <Button type="submit" loading={isPending} className="gap-1.5 rounded-full">
                                <Search size={15} />
                                {t('search')}
                            </Button>
                            <Button
                                type="button"
                                variant="subtle"
                                className="gap-1 rounded-full"
                                onClick={() => setAdvancedOpen((v) => !v)}
                            >
                                {t('advancedFilters')}
                                <ChevronDown
                                    size={14}
                                    className={cn('transition-transform', advancedOpen && 'rotate-180')}
                                />
                            </Button>
                        </div>
                    </div>

                    {advancedOpen && (
                        <div className="border-hairline bg-muted/20 grid gap-3 rounded-[14px] border p-3 md:grid-cols-3">
                            <Controller
                                control={searchForm.control}
                                name="nickname"
                                render={({ field }) => (
                                    <TextInput {...field} label={t('users.nickname')} />
                                )}
                            />
                            <Controller
                                control={searchForm.control}
                                name="email"
                                render={({ field }) => <TextInput {...field} label={t('users.email')} />}
                            />
                            <Controller
                                control={searchForm.control}
                                name="phoneNumber"
                                render={({ field }) => <TextInput {...field} label={t('users.phone')} />}
                            />
                        </div>
                    )}
                </form>
            </AdminFilterCard>

            {isPending && !data && <Loader variant="section" size="sm" />}
            {isError && <p className="text-sm text-red-600">{t('error')}</p>}
            {!isPending && users.length === 0 && (
                <AdminEmptyState title={t('empty')} hint={t('section.users')} Icon={Users} />
            )}

            {users.length > 0 && (
                <AdminTableCard>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[640px] text-left text-sm">
                            <thead className="bg-muted/35 text-muted-foreground">
                                <tr>
                                    <th className="px-4 py-3 text-[11px] font-semibold tracking-[0.08em] uppercase">
                                        {t('users.nickname')}
                                    </th>
                                    <th className="px-4 py-3 text-[11px] font-semibold tracking-[0.08em] uppercase">
                                        {t('users.email')}
                                    </th>
                                    <th className="px-4 py-3 text-[11px] font-semibold tracking-[0.08em] uppercase">
                                        {t('users.phone')}
                                    </th>
                                    <th className="px-4 py-3 text-[11px] font-semibold tracking-[0.08em] uppercase">
                                        {t('users.role')}
                                    </th>
                                    <th className="px-4 py-3">
                                        <AdminSortButton
                                            label={t('users.created')}
                                            active
                                            direction={createdSort}
                                            onToggle={toggleCreatedSort}
                                        />
                                    </th>
                                    <th className="px-4 py-3 text-[11px] font-semibold tracking-[0.08em] uppercase">
                                        {t('actions')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="border-hairline hover:bg-muted/25 border-t transition-colors"
                                    >
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2.5">
                                                <span className="bg-primary/12 text-primary flex size-8 items-center justify-center rounded-full text-[11px] font-semibold">
                                                    {user.nickname.slice(0, 2).toUpperCase()}
                                                </span>
                                                <span className="font-medium tracking-tight">{user.nickname}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-muted-foreground">{user.email ?? '—'}</span>
                                                {user.email && (
                                                    <VerifiedChip
                                                        verified={user.isEmailVerified}
                                                        label={
                                                            user.isEmailVerified
                                                                ? t('users.verified')
                                                                : t('users.unverified')
                                                        }
                                                    />
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-muted-foreground">
                                                    {user.phoneNumber ?? '—'}
                                                </span>
                                                {user.phoneNumber && (
                                                    <VerifiedChip
                                                        verified={user.isPhoneVerified}
                                                        label={
                                                            user.isPhoneVerified
                                                                ? t('users.verified')
                                                                : t('users.unverified')
                                                        }
                                                    />
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="border-hairline bg-muted/50 text-muted-foreground rounded-full border px-2 py-0.5 font-mono text-[11px]">
                                                {user.roleId.slice(0, 8)}
                                            </span>
                                        </td>
                                        <td className="text-muted-foreground px-4 py-3 whitespace-nowrap tabular-nums">
                                            {dayjsInstance(user.createdAt).format('DD.MM.YYYY')}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-wrap gap-1">
                                                <Button
                                                    type="button"
                                                    variant="subtle"
                                                    size="sm"
                                                    onClick={() => openEdit(user)}
                                                >
                                                    {t('edit')}
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        setDeleteTarget({
                                                            id: user.id,
                                                            kind: 'soft',
                                                            nickname: user.nickname
                                                        })
                                                    }
                                                >
                                                    {t('users.softDelete')}
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() =>
                                                        setDeleteTarget({
                                                            id: user.id,
                                                            kind: 'hard',
                                                            nickname: user.nickname
                                                        })
                                                    }
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
                </AdminTableCard>
            )}

            <AdminPagination
                page={page}
                pageSize={DEFAULT_PAGE_SIZE}
                total={total}
                disabled={isPending}
                onPageChange={(next) => runSearch(searchForm.getValues(), next, createdSort)}
            />

            <Modal opened={Boolean(editing)} onClose={() => setEditing(null)} title={t('users.editTitle')} centered>
                <form className="flex flex-col gap-3" onSubmit={editForm.handleSubmit(onSaveEdit)}>
                    <Controller
                        control={editForm.control}
                        name="nickname"
                        render={({ field }) => (
                            <TextInput
                                {...field}
                                label={t('users.nickname')}
                                required
                                error={editForm.formState.errors.nickname?.message}
                            />
                        )}
                    />
                    <Controller
                        control={editForm.control}
                        name="email"
                        render={({ field }) => (
                            <TextInput
                                {...field}
                                value={field.value ?? ''}
                                label={t('users.email')}
                                error={editForm.formState.errors.email?.message}
                            />
                        )}
                    />
                    <Controller
                        control={editForm.control}
                        name="phoneNumber"
                        render={({ field }) => (
                            <TextInput {...field} value={field.value ?? ''} label={t('users.phone')} />
                        )}
                    />
                    <Controller
                        control={editForm.control}
                        name="isEmailVerified"
                        render={({ field }) => (
                            <div className="flex items-center justify-between gap-3">
                                <span className="text-sm">{t('users.emailVerified')}</span>
                                <Switch
                                    checked={field.value}
                                    onChange={(e) => field.onChange(e.currentTarget.checked)}
                                />
                            </div>
                        )}
                    />
                    <Controller
                        control={editForm.control}
                        name="isPhoneVerified"
                        render={({ field }) => (
                            <div className="flex items-center justify-between gap-3">
                                <span className="text-sm">{t('users.phoneVerified')}</span>
                                <Switch
                                    checked={field.value}
                                    onChange={(e) => field.onChange(e.currentTarget.checked)}
                                />
                            </div>
                        )}
                    />
                    <div className="mt-2 flex justify-end gap-2">
                        <Button type="button" variant="subtle" onClick={() => setEditing(null)}>
                            {t('cancel')}
                        </Button>
                        <Button type="submit" loading={isUpdating}>
                            {t('save')}
                        </Button>
                    </div>
                </form>
            </Modal>

            <Modal
                opened={Boolean(deleteTarget)}
                onClose={() => setDeleteTarget(null)}
                title={
                    deleteTarget?.kind === 'hard' ? t('users.hardDeleteTitle') : t('users.softDeleteTitle')
                }
                centered
            >
                <p className="text-muted-foreground mb-4 text-sm">
                    {deleteTarget?.kind === 'hard'
                        ? t('users.confirmHardNamed', { name: deleteTarget.nickname })
                        : t('users.confirmSoftNamed', { name: deleteTarget?.nickname ?? '' })}
                </p>
                <div className="flex justify-end gap-2">
                    <Button type="button" variant="subtle" onClick={() => setDeleteTarget(null)}>
                        {t('cancel')}
                    </Button>
                    <Button
                        type="button"
                        variant={deleteTarget?.kind === 'hard' ? 'danger' : 'filled'}
                        loading={isSoftDeleting || isHardDeleting}
                        onClick={onConfirmDelete}
                    >
                        {deleteTarget?.kind === 'hard' ? t('users.hardDelete') : t('users.softDelete')}
                    </Button>
                </div>
            </Modal>
        </div>
    )
}
