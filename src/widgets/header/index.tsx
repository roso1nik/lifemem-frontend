'use client'

import { Button, Drawer } from '@mantine/core'
import { ThemeSwitcher } from '../theme'
import { Menu } from 'lucide-react'
import { FC, useState } from 'react'
import { Sidebar } from '../sidebar'

interface HeaderProps {
    isAdminView?: boolean
}

export const Header: FC<HeaderProps> = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    return (
        <header className="border-border bg-sidebar/80 lg:py-auto sticky top-0 z-100 flex h-auto w-full flex-col items-center justify-between gap-3 border-b px-4 py-4 backdrop-blur-sm lg:h-20 lg:flex-row">
            <div className="flex w-full flex-row justify-between gap-2 lg:w-1/4">
                <Button
                    variant="outline"
                    className="flex lg:hidden!"
                    onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                >
                    <Menu />
                </Button>
            </div>
            <div className="flex w-full flex-row items-center justify-between gap-3 lg:w-3/4 lg:justify-end">
                <div className="flex flex-row gap-1 lg:gap-3">
                    {/* <Link href={ROUTES.NOTIFICATIONS}>
                        <ActionIcon variant="transparent" size="xl" color="light">
                            <Bell size={20} />
                        </ActionIcon>
                    </Link> */}
                    <ThemeSwitcher />
                </div>
            </div>

            <Drawer opened={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} position="right">
                <Sidebar />
            </Drawer>
        </header>
    )
}
