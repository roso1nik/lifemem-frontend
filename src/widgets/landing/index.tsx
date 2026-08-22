import { LandingAtmosphere } from './landing-atmosphere'
import { LandingHero } from './landing-hero'
import { LandingCapture } from './landing-capture'
import { LandingGraph } from './landing-graph'
import { LandingAsk } from './landing-ask'
import { LandingPlaces } from './landing-places'
import { LandingClose } from './landing-close'

export const LandingPage = () => {
    return (
        <>
            <LandingAtmosphere />
            <LandingHero />
            <LandingCapture />
            <LandingGraph />
            <LandingAsk />
            <LandingPlaces />
            <LandingClose />
        </>
    )
}

export { LandingNav } from './landing-nav'
export { LandingFooter } from './landing-footer'
