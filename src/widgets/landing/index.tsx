import { LandingAtmosphere } from './landing-atmosphere'
import { LandingHero } from './landing-hero'
import { LandingHow } from './landing-how'
import { LandingCapture } from './landing-capture'
import { LandingGraph } from './landing-graph'
import { LandingAsk } from './landing-ask'
import { LandingPlaces } from './landing-places'
import { LandingPricing } from './landing-pricing'
import { LandingClose } from './landing-close'
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
            <ScrollFocusSection>
                <LandingHow />
            </ScrollFocusSection>
            <ScrollFocusSection>
                <LandingCapture />
            </ScrollFocusSection>
            <ScrollFocusSection>
                <LandingGraph />
            </ScrollFocusSection>
            <ScrollFocusSection>
                <LandingAsk />
            </ScrollFocusSection>
            <ScrollFocusSection>
                <LandingPlaces />
            </ScrollFocusSection>
            <ScrollFocusSection>
                <LandingPricing />
            </ScrollFocusSection>
            <ScrollFocusSection>
                <LandingClose />
            </ScrollFocusSection>
            </ScrollFocusProvider>
        </>
    )
}

export { LandingNav } from './landing-nav'
export { LandingFooter } from './landing-footer'
