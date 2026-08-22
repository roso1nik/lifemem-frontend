import { LandingHero } from './landing-hero'
import { LandingCapture } from './landing-capture'
import { LandingGraph } from './landing-graph'
import { LandingSearch } from './landing-search'
import { LandingPlaces } from './landing-places'
import { LandingClose } from './landing-close'

export const LandingPage = () => {
    return (
        <>
            <LandingHero />
            <LandingCapture />
            <LandingGraph />
            <LandingSearch />
            <LandingPlaces />
            <LandingClose />
        </>
    )
}

export { LandingNav } from './landing-nav'
export { LandingFooter } from './landing-footer'
