'use client'

import { Avatar as MantineAvatar, AvatarProps as MantineAvatarProps } from '@mantine/core'
import { forwardRef } from 'react'
import { cn } from '@/shared/utils'
import classes from './avatar.module.css'

export type AvatarProps = MantineAvatarProps

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(({ className, color = 'brandColors', ...props }, ref) => {
    return <MantineAvatar ref={ref} color={color} className={cn(classes.root, className)} {...props} />
})

Avatar.displayName = 'Avatar'
