/** Strip HTML tags for API `text` while keeping light line breaks. */
export const htmlToPlainText = (html: string | null | undefined): string => {
    if (!html?.trim()) return ''

    return html
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/&nbsp;/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+\n/g, '\n')
        .replace(/\n\s+/g, '\n')
        .replace(/[ \t]+/g, ' ')
        .trim()
}
