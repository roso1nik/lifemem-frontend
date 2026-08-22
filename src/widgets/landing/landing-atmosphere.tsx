'use client'

/** Soft Mist Aqua / Sage wash — not a mesh blob hero. */
export const LandingAtmosphere = () => {
    return (
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
            <div className="bg-background absolute inset-0" />
            <div className="absolute top-[-12%] left-[50%] h-[560px] w-[920px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,color-mix(in_srgb,var(--primary)_20%,transparent)_0%,transparent_68%)] blur-2xl" />
            <div className="absolute top-[28%] right-[-8%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--sage)_16%,transparent)_0%,transparent_70%)] blur-3xl" />
            <div className="absolute bottom-[-10%] left-[-6%] h-[380px] w-[520px] rounded-full bg-[radial-gradient(ellipse_at_center,color-mix(in_srgb,var(--primary)_10%,transparent)_0%,transparent_72%)] blur-3xl" />
        </div>
    )
}
