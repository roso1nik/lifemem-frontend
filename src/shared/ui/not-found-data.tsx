import { FC } from 'react'
import { cn } from '../utils'

interface NotFoundDataProps {
    className?: string
}

export const NotFoundData: FC<NotFoundDataProps> = ({ className }) => {
    return <p className={cn('text-muted-foreground my-2 w-full text-center', className)}>Ничего не найдено.</p>
}
