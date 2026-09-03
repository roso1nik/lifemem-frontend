import { redirect } from '@/i18n/navigation'
import { ROUTES } from '@/shared/router'
import { getLocale } from 'next-intl/server'

export default async function AdminIndexPage() {
    const locale = await getLocale()
    redirect({ href: ROUTES.ADMIN_USERS, locale })
}
