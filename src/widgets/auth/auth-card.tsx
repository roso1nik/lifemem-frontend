'use client'
import Image from 'next/image'
import { FC, ReactNode, useEffect, useState } from 'react'
import { ThemeSwitcher } from '../theme'
import { APP_NAME } from '@/shared/config'
import { useMantineColorScheme } from '@mantine/core'

interface AuthCardProps {
    children: ReactNode
}

export const AuthCard: FC<AuthCardProps> = ({ children }) => {
    const { colorScheme } = useMantineColorScheme()
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const logoSrc = isMounted && colorScheme === 'dark'
        ? '/images/emojis/ss-logo-white.svg'
        : '/images/emojis/ss-logo-black.svg'

    return (
        <>
            <div className="absolute top-4 right-4">
                <ThemeSwitcher />
            </div>
            <div className="flex flex-col items-center gap-1">
                <Image
                    src={logoSrc}
                    alt={`${APP_NAME} logo`}
                    width={200}
                    height={200}
                    loading="eager"
                />
            </div>
            <div className="border-border bg-card flex w-full flex-col gap-3 rounded-3xl border p-6 lg:w-md">
                {children}
            </div>
            <p className="text-muted-foreground absolute bottom-4 text-sm">
                © {new Date().getFullYear()} {APP_NAME}. Все права защищены.
            </p>
        </>
    )
}
