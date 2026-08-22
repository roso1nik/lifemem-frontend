import { NotFoundPage } from '@/shared/ui'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: '404',
    robots: { index: false, follow: false }
}

export default function GlobalNotFound() {
    return (
        <html>
            <body>
                <NotFoundPage />
            </body>
        </html>
    )
}
