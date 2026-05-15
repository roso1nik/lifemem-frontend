import { Button, ButtonProps } from '@mantine/core'
import { Link } from '@/i18n/navigation'
import { FC, ReactNode } from 'react'
import { cn } from '../utils'

export interface LinkButtonExternalProps {
    href: string
    children: ReactNode
}

export type LinkButtonProps = LinkButtonExternalProps & ButtonProps

export const LinkButton: FC<LinkButtonProps> = ({ href, children, ...props }) => {
    return (
        <Link href={href} className="w-full">
            <Button variant="light" size="sm" {...props} className={cn('!w-full', props.className)} justify="start">
                {children}
            </Button>
        </Link>
    )
}
