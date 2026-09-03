'use client'

import { useCallback, useRef, useState } from 'react'
import { OAUTH_CONFIG } from '@/shared/config/oauth'

type AppleSignInResult = {
    idToken: string
    fullName?: {
        givenName?: string
        familyName?: string
    } | null
}

type AppleAuthResponse = {
    authorization: {
        id_token: string
    }
    user?: {
        name?: {
            firstName?: string
            lastName?: string
        }
    }
}

declare global {
    interface Window {
        AppleID?: {
            auth: {
                init: (config: Record<string, unknown>) => void
                signIn: () => Promise<AppleAuthResponse>
            }
        }
    }
}

const APPLE_SCRIPT_ID = 'apple-sign-in-sdk'
const APPLE_SCRIPT_SRC = 'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js'

const loadAppleScript = (): Promise<void> =>
    new Promise((resolve, reject) => {
        if (typeof window === 'undefined') {
            reject(new Error('Apple Sign In is only available in browser'))
            return
        }

        if (window.AppleID) {
            resolve()
            return
        }

        const existing = document.getElementById(APPLE_SCRIPT_ID) as HTMLScriptElement | null
        if (existing) {
            existing.addEventListener('load', () => resolve())
            existing.addEventListener('error', () => reject(new Error('Failed to load Apple Sign In')))
            return
        }

        const script = document.createElement('script')
        script.id = APPLE_SCRIPT_ID
        script.src = APPLE_SCRIPT_SRC
        script.async = true
        script.onload = () => resolve()
        script.onerror = () => reject(new Error('Failed to load Apple Sign In'))
        document.head.appendChild(script)
    })

export const useAppleSignIn = () => {
    const [isLoading, setIsLoading] = useState(false)
    const initialized = useRef(false)

    const initApple = useCallback(async () => {
        if (!OAUTH_CONFIG.appleClientId) {
            throw new Error('Apple client ID is not configured')
        }

        await loadAppleScript()

        if (!window.AppleID) {
            throw new Error('Apple Sign In SDK is unavailable')
        }

        const redirectURI =
            OAUTH_CONFIG.appleRedirectUri ||
            (typeof window !== 'undefined' ? window.location.origin : '')

        if (!initialized.current) {
            window.AppleID.auth.init({
                clientId: OAUTH_CONFIG.appleClientId,
                scope: 'name email',
                redirectURI,
                usePopup: true
            })
            initialized.current = true
        }
    }, [])

    const signIn = useCallback(async (): Promise<AppleSignInResult> => {
        setIsLoading(true)
        try {
            await initApple()
            const response = await window.AppleID!.auth.signIn()
            return {
                idToken: response.authorization.id_token,
                fullName: response.user?.name
                    ? {
                          givenName: response.user.name.firstName,
                          familyName: response.user.name.lastName
                      }
                    : null
            }
        } finally {
            setIsLoading(false)
        }
    }, [initApple])

    return { signIn, isLoading, isConfigured: Boolean(OAUTH_CONFIG.appleClientId) }
}
