import { LandingAtmosphere } from './landing-atmosphere'
import { LandingHero } from './landing-hero'
import { LandingAudience } from './landing-audience'
import { LandingAsk } from './landing-ask'
import { LandingHow } from './landing-how'
import { LandingGraph } from './landing-graph'
import { LandingCapture } from './landing-capture'
import { LandingTrustStrip } from './landing-trust-strip'
import { LandingPricing } from './landing-pricing'
import { LandingPlaces } from './landing-places'
import { LandingClose } from './landing-close'
import { LandingBottom } from './landing-bottom'
import { ScrollFocusProvider, ScrollFocusSection } from './scroll-focus-section'
import { LandingHashScroll } from './landing-hash-scroll'

export const LandingPage = () => {
    return (
        <>
            <LandingHashScroll />
            <LandingAtmosphere />
            <ScrollFocusProvider>
                <ScrollFocusSection>
                    <LandingHero />
                </ScrollFocusSection>
                <LandingAudience />
                <ScrollFocusSection>
                    <LandingAsk />
                </ScrollFocusSection>
                <LandingHow />
                <ScrollFocusSection>
                    <LandingGraph />
                </ScrollFocusSection>
                <LandingCapture />
                <LandingTrustStrip />
                <LandingPricing />
                <LandingPlaces />
                <LandingClose />
                <LandingBottom />
            </ScrollFocusProvider>
        </>
    )
}

export { LandingNav } from './landing-nav'
export { LandingFooter } from './landing-footer'
