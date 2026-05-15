export const pathWithoutLang = (href: string) => {
    return href?.replace(/^\/[a-z]{2}(\/|$)/, '/') || '/'
}
