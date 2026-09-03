export const getAcceptLanguage = (): string => {
    if (typeof window === 'undefined') return 'ru'
    const match = window.location.pathname.match(/^\/(ru|en)(?:\/|$)/)
    return match?.[1] ?? 'ru'
}
