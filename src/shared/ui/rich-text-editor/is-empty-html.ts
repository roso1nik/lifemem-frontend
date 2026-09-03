/** TipTap empty doc is often `<p></p>` / `<p><br></p>`, not `''`. */
export const isEmptyHtml = (html: string | null | undefined): boolean => {
    if (!html?.trim()) return true

    const text = html
        .replace(/<br\s*\/?>/gi, '')
        .replace(/&nbsp;/gi, ' ')
        .replace(/<[^>]+>/g, '')
        .replace(/\s+/g, ' ')
        .trim()

    return text.length === 0
}
