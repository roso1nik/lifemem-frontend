'use client'

import { useSelf } from '@/entities/user/api/use-self'
import { usePermissions } from '@/entities/permissions/hooks/usePermission'
import { PermissionValue } from '@/entities/permissions/const/permission-map'
import { ROUTES } from '@/shared/router'
import { Avatar, Menu, UnstyledButton } from '@mantine/core'
import { ChevronUp, LogOut, Shield, User } from 'lucide-react'
import { useTranslations } from 'next-intl'
import toast from 'react-hot-toast'
import Cookies from 'js-cookie'
import { GLOBAL_DICTIONARY } from '@/shared/config'
import { ThemeSwitcher } from '@/widgets/theme'
import { LanguageSwitcher } from '@/widgets/language-switcher'
import { useRouter } from '@/i18n/navigation'

export const AccountMenu = () => {
    const t = useTranslations('account')
    const { data: user } = useSelf()
    const { hasPermission } = usePermissions()
    const router = useRouter()
    const canAdmin = hasPermission(PermissionValue.ADMIN_PANEL)

    const initials = (user?.nickname ?? 'u').slice(0, 2).toUpperCase()

    const logout = () => {
        Cookies.remove(GLOBAL_DICTIONARY.ACCESS_TOKEN)
        toast.success('Вы вышли (мок)')
        router.push(ROUTES.LOGIN)
    }

    return (
        <div className="border-sidebar-border flex flex-col gap-2 border-t p-3">
            <div className="flex items-center justify-between gap-2 px-1">
                <ThemeSwitcher />
                <LanguageSwitcher />
            </div>
            <Menu shadow="md" width={220} position="top-start">
                <Menu.Target>
                    <UnstyledButton className="hover:bg-sidebar-accent flex w-full items-center gap-3 rounded-xl px-2 py-2 transition-colors">
                        <Avatar radius="xl" size={36} color="brandColors">
                            {initials}
                        </Avatar>
                        <div className="min-w-0 flex-1 text-left">
                            <p className="truncate text-sm font-medium">{user?.nickname ?? '…'}</p>
                            <p className="text-muted-foreground truncate text-xs">{user?.email}</p>
                        </div>
                        <ChevronUp size={16} className="text-muted-foreground shrink-0" />
                    </UnstyledButton>
                </Menu.Target>
                <Menu.Dropdown>
                    <Menu.Label>{t('menu')}</Menu.Label>
                    <Menu.Item
                        leftSection={<User size={14} />}
                        onClick={() => toast(t('profileSoon'))}
                    >
                        {t('profile')}
                    </Menu.Item>
                    {canAdmin && (
                        <Menu.Item leftSection={<Shield size={14} />} onClick={() => router.push(ROUTES.ADMIN)}>
                            {t('admin')}
                        </Menu.Item>
                    )}
                    <Menu.Divider />
                    <Menu.Item color="red" leftSection={<LogOut size={14} />} onClick={logout}>
                        {t('logout')}
                    </Menu.Item>
                </Menu.Dropdown>
            </Menu>
        </div>
    )
}
