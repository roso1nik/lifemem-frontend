'use client'

/** Full-viewport soft wash — no clipped blobs or hard edges. */
export const LandingAtmosphere = () => {
    return (
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
            <div className="bg-background absolute inset-0" />
            <div
                className="absolute -inset-[35%] bg-[radial-gradient(ellipse_90%_72%_at_8%_16%,color-mix(in_srgb,var(--primary)_14%,transparent),transparent_68%),radial-gradient(ellipse_82%_64%_at_96%_20%,color-mix(in_srgb,var(--sage)_11%,transparent),transparent_66%),radial-gradient(ellipse_88%_58%_at_48%_108%,color-mix(in_srgb,var(--primary)_9%,transparent),transparent_64%),radial-gradient(ellipse_70%_52%_at_78%_72%,color-mix(in_srgb,var(--sage)_7%,transparent),transparent_62%)]"
            />
        </div>
    )
}
