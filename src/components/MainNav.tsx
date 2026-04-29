import { styled } from '@pigment-css/react'
import Link from 'next/link'
import HeadingAnimation from './HeadingAnimation'
import Tokens from '@/lib/tokens'
import MainNavClient from '@/components/MainNavClient'

const StyledMenuContainer = styled('div')`
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: ${Tokens.zIndex.nav.value};
  background-color: ${Tokens.colors.background.value};
  transition: background 1.3s ease, --background-color-start 1.3s ease,
    --background-color-end 1.3s ease;
`

const StyledMenu = styled('div')`
  display: flex;
  flex-direction: row;
  max-width: ${Tokens.sizes.breakpoints.large.value}${Tokens.sizes.breakpoints.large.unit};
  margin: 0 auto;
  height: 4rem;
  align-items: center;
  padding: 0 1rem;

  @media (min-width: ${Tokens.sizes.breakpoints.large.value}${Tokens.sizes
      .breakpoints.large.unit}) {
    padding: 0;
  }
`

const StyledDesktopNav = styled('nav')`
  display: none;
  flex: 1;

  @media (min-width: ${Tokens.sizes.breakpoints.large.value}${Tokens.sizes
      .breakpoints.large.unit}) {
    display: flex;
  }
`

const StyledMobileNav = styled('nav')`
  display: flex;
  flex: 1;

  @media (min-width: ${Tokens.sizes.breakpoints.large.value}${Tokens.sizes
      .breakpoints.large.unit}) {
    display: none;
  }
`

const StyledList = styled('ul')`
  display: flex;
  margin: 0 0 0 ${Tokens.sizes.large.value}${Tokens.sizes.large.unit};
  padding: 0;
  list-style: none;
  flex-direction: row;
  align-items: center;

  @media (min-width: ${Tokens.sizes.breakpoints.large.value}${Tokens.sizes
      .breakpoints.large.unit}) {
    margin: 0;
  }
`

const StyledListItem = styled('li')`
  display: flex;
  flex-flow: row nowrap;
  margin: 0 ${Tokens.sizes.large.value}${Tokens.sizes.large.unit} 0 0;
  text-wrap: nowrap;

  a {
    color: ${Tokens.colors.secondary.value};
  }
`

const StyledTitle = styled(HeadingAnimation)`
  text-wrap: nowrap;
  color: ${Tokens.colors.background.value};
`

/**
 * Animation steps for the navigation title.
 * Moved outside component to avoid recreation on every render.
 */
const NAVIGATION_STEPS = [
  'Jason Rundell',
  'Jason Rundell',
  'Jason Rundell',
  'Jason Rundell',
  'Jason Rundell',
  'Jason Rundell',
  'Jason Rundel',
  'Jason Runde',
  'Jason Rund',
  'Jason Run',
  'Jason Ru',
  'Jason R',
  'Jason ',
  'Jason',
  'Jaso',
  'Jas',
  'Ja',
  'J',
  '',
  '',
  '',
  '',
  '',
  '',
  'jason$',
  'jason$',
  'jason$',
  'jason$',
  'jason$',
  'jason$',
  'jason$',
  'jason$ n',
  'jason$ np',
  'jason$ npm',
  'jason$ npm ',
  'jason$ npm r',
  'jason$ npm ru',
  'jason$ npm run',
  'jason$ npm run ',
  'jason$ npm run d',
  'jason$ npm run de',
  'jason$ npm run dev',
  'jason$ npm run dev',
  'jason$ npm run dev',
  'jason$ npm run dev',
  'jason$ npm run dev',
  'jason$ npm run dev',
  'jason$ npm run dev',
  'jason$ npm run dev',
  'jason$ npm run de',
  'jason$ npm run d',
  'jason$ npm run de',
  'jason$ npm run del',
  'jason$ npm run dell',
  'jason$ npm run dell',
  'jason$ npm run dell',
  'jason$ npm run dell',
  'jason$ npm run dell',
  'jason$ npm run dell',
  'jason$ npm run dell',
  'jason$ npm run dell',
  'jason$ npm run dell',
  'jason$ npm run dell',
  'jason$ rundell',
  'jason$ rundell',
  'jason$ rundell',
  'jason$ rundell',
  'jason$ rundell',
  'jason$ rundell',
  'jason$ rundell',
  'jason$ rundell',
  'jason$ rundell',
  'jason$ rundell',
  'jason$ rundell',
  'jason$ rundell',
  ':)',
  ':)',
  ':)',
  ':)',
  ':)',
  ':)',
  ':)',
  ':)',
  ':)',
  ':)',
  ':)',
  ':)',
  'Jason Rundell',
] satisfies string[]

/**
 * Main navigation component with responsive desktop and mobile layouts.
 * Includes animated title and navigation links.
 */
export default function MainNav() {
  return (
    <StyledMenuContainer id="menu">
      <StyledMenu>
        {/* Desktop Navigation */}
        <StyledDesktopNav aria-label="Main Navigation">
          <StyledList>
            <StyledListItem>
              <StyledTitle steps={NAVIGATION_STEPS} speed={100} />
            </StyledListItem>
            <StyledListItem>
              <Link href="/#blog">Blog</Link>
            </StyledListItem>
            <StyledListItem>
              <Link href="/#projects">Projects</Link>
            </StyledListItem>
          </StyledList>
        </StyledDesktopNav>

        {/* Mobile Navigation */}
        <StyledMobileNav aria-label="Main Navigation">
          <StyledTitle steps={NAVIGATION_STEPS} speed={100} />
        </StyledMobileNav>

        <MainNavClient />
      </StyledMenu>
    </StyledMenuContainer>
  )
}
