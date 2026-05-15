import { FC, ReactNode } from 'react'

interface DefaultLayoutProps {
    children?: ReactNode
}

export const DefaultLayout: FC<DefaultLayoutProps> = ({ children }) => {
    return (
        <div className="w-full">
            <div className="mx-auto flex w-full flex-col gap-5 lg:w-4/5">{children}</div>
        </div>
    )
}
