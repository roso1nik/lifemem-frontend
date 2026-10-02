import { getTranslations } from 'next-intl/server'
import { Loader } from '@/shared/ui'

export default async function Loading() {
    const t = await getTranslations('common')
    return <Loader variant="page" label={t('loading')} />
}
