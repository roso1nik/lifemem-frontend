import { LandingHero } from './landing-hero'
import { LandingCapture } from './landing-capture'
import { LandingGraph } from './landing-graph'
import { LandingSearch } from './landing-search'
import { LandingAi } from './landing-ai'
import { LandingPlaces } from './landing-places'
import { LandingClose } from './landing-close'

export const LandingPage = () => {
    return (
        <>
            <LandingHero />
            <LandingCapture />
            <LandingGraph />
            <LandingSearch />
            <LandingAi />
            <LandingPlaces />
            <LandingClose />
        </>
    )
}

export { LandingNav } from './landing-nav'
export { LandingFooter } from './landing-footer'
