'use client'

import { useMemo, useState, type HTMLAttributes } from 'react'
import { useTranslations } from 'next-intl'
import Lightbox, { type SlideImage } from 'yet-another-react-lightbox'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'
import Counter from 'yet-another-react-lightbox/plugins/counter'
import Captions from 'yet-another-react-lightbox/plugins/captions'
import 'yet-another-react-lightbox/styles.css'
import 'yet-another-react-lightbox/plugins/thumbnails.css'
import 'yet-another-react-lightbox/plugins/counter.css'
import 'yet-another-react-lightbox/plugins/captions.css'
import './image-gallery-lightbox.css'
import { cn } from '@/shared/utils'
import classes from './image-gallery.module.css'

export type ImageGalleryItem = {
    id: string
    src: string
    alt?: string
    caption?: string
}

export type ImageGalleryProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
    items: ImageGalleryItem[]
    columns?: 2 | 3 | 4
}

const toCaption = (value: unknown): string | undefined => {
    if (typeof value === 'string' && value.trim()) return value.trim()
    if (value && typeof value === 'object') {
        const record = value as Record<string, unknown>
        for (const key of ['text', 'description', 'caption', 'title']) {
            const candidate = record[key]
            if (typeof candidate === 'string' && candidate.trim()) return candidate.trim()
        }
    }
    return undefined
}

export const imageGalleryItemFromEntryPhoto = (
    photo: { id: string; url: string; description?: unknown },
    fallbackAlt: string
): ImageGalleryItem | null => {
    if (!photo.url) return null
    const caption = toCaption(photo.description)
    return {
        id: photo.id,
        src: photo.url,
        alt: caption || fallbackAlt,
        caption
    }
}

export const ImageGallery = ({ items, columns = 3, className, ...props }: ImageGalleryProps) => {
    const t = useTranslations('common.gallery')
    const [index, setIndex] = useState(-1)

    const slides = useMemo<SlideImage[]>(
        () =>
            items.map((item) => {
                const slide: SlideImage = {
                    src: item.src,
                    alt: item.alt
                }
                if (item.caption) {
                    slide.title = item.caption
                    slide.description = item.caption
                }
                return slide
            }),
        [items]
    )

    if (items.length === 0) return null

    const isSingle = items.length === 1

    return (
        <div className={cn(classes.root, className)} {...props}>
            <ul
                className={cn(
                    classes.grid,
                    isSingle && classes.gridSingle,
                    !isSingle && columns === 2 && classes.cols2,
                    !isSingle && columns === 4 && classes.cols4
                )}
                aria-label={t('label')}
            >
                {items.map((item, i) => (
                    <li key={item.id}>
                        <button
                            type="button"
                            className={classes.thumb}
                            onClick={() => setIndex(i)}
                            aria-label={t('open', { index: i + 1, total: items.length })}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={item.src}
                                alt={item.alt || ''}
                                loading={i < 3 ? 'eager' : 'lazy'}
                                decoding="async"
                                className={classes.image}
                            />
                            {i === 0 && items.length > 1 && (
                                <span className={classes.badge}>{items.length}</span>
                            )}
                        </button>
                    </li>
                ))}
            </ul>

            <Lightbox
                className="lifemem-lightbox"
                open={index >= 0}
                close={() => setIndex(-1)}
                index={index}
                slides={slides}
                plugins={[Zoom, Thumbnails, Counter, Captions]}
                carousel={{ finite: items.length <= 1, padding: '4%' }}
                controller={{ closeOnBackdropClick: true }}
                animation={{ fade: 220, swipe: 280 }}
                zoom={{ maxZoomPixelRatio: 3, scrollToZoom: true }}
                thumbnails={{
                    position: 'bottom',
                    border: 0,
                    padding: 0,
                    gap: 8,
                    borderRadius: 12,
                    width: 72,
                    height: 72,
                    vignette: true
                }}
                captions={{ showToggle: false, descriptionTextAlign: 'center' }}
                labels={{
                    Next: t('next'),
                    Previous: t('previous'),
                    Close: t('close'),
                    'Zoom in': t('zoomIn'),
                    'Zoom out': t('zoomOut')
                }}
                on={{
                    view: ({ index: next }) => setIndex(next)
                }}
            />
        </div>
    )
}
