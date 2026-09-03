'use client'

import { useEffect, useRef, useState } from 'react'
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google'
import { useTranslations } from 'next-intl'
import { cn } from '@/shared/utils'
import classes from './google-login-button.module.css'

type GoogleLoginButtonProps = {
    onSuccess: (response: CredentialResponse) => void
    onError?: () => void
    label?: string
    className?: string
}

const GoogleGIcon = () => (
    <svg className={classes.icon} width="18" height="18" viewBox="0 0 48 48" aria-hidden>
        <path
            fill="#FFC107"
            d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.2 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.5-.4-3.5Z"
        />
        <path
            fill="#FF3D00"
            d="m6.3 14.7 6.6 4.8C14.7 16 19 12 24 12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.2 6.1 29.4 4 24 4 16.3 4 9.6 8.3 6.3 14.7Z"
        />
        <path
            fill="#4CAF50"
            d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.3C29.2 35.1 26.7 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44Z"
        />
        <path
            fill="#1976D2"
            d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.2-3.5 5.8-6.7 7.5l6.3 5.3C38.5 37.3 44 31.5 44 24c0-1.3-.1-2.5-.4-3.5Z"
        />
    </svg>
)

export const GoogleLoginButton = ({ onSuccess, onError, label, className }: GoogleLoginButtonProps) => {
    const t = useTranslations('auth')
    const wrapRef = useRef<HTMLDivElement>(null)
    const [width, setWidth] = useState(320)

    useEffect(() => {
        const el = wrapRef.current
        if (!el) return

        const update = () => {
            const next = Math.round(el.getBoundingClientRect().width)
            setWidth((current) => (next > 0 && next !== current ? next : current))
        }

        update()
        const observer = new ResizeObserver(update)
        observer.observe(el)
        return () => observer.disconnect()
    }, [])

    const gisWidth = Math.min(Math.max(width, 200), 400)
    const scale = width > 0 ? width / gisWidth : 1

    return (
        <div ref={wrapRef} className={cn(classes.wrap, className)}>
            <div className={classes.face}>
                <GoogleGIcon />
                <span className={classes.label}>{label ?? t('oauthGoogle')}</span>
            </div>
            <div className={classes.hit}>
                <div style={{ width: gisWidth, transform: `scaleX(${scale})`, transformOrigin: 'left center' }}>
                    <GoogleLogin
                        onSuccess={onSuccess}
                        onError={onError}
                        width={gisWidth}
                        size="large"
                        text="continue_with"
                        shape="rectangular"
                        theme="outline"
                        logo_alignment="center"
                    />
                </div>
            </div>
        </div>
    )
}
