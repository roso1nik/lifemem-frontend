'use client'

import { usePathname } from 'next/navigation'
import { LinkButton, LinkButtonProps } from './link-button'
import { FC } from 'react'

export const LinkButtonPathCheck: FC<LinkButtonProps> = ({ href, children, ...props }) => {
    const path = usePathname()

    const pathWithoutLocale = path?.replace(/^\/[a-z]{2}(\/|$)/, '/') || '/'

    const hrefWithoutLocale = typeof href === 'string' ? href.replace(/^\/[a-z]{2}(\/|$)/, '/') : href

    const isActive = pathWithoutLocale === hrefWithoutLocale

    return (
        <LinkButton {...props} href={href} variant={isActive ? 'light' : 'subtle'} color={'light'} size="md">
            {children}
        </LinkButton>
    )
}
