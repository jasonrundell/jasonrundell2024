import { styled } from '@pigment-css/react'
import Link from 'next/link'
import HeadingAnimation from './HeadingAnimation'
import Tokens from '@/lib/tokens'
import { createClient } from '@/utils/supabase/server'
import MainNavClient from '@/components/MainNavClient'

const StyledMenuContainer = styled('div')`
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 99;
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
`

const StyledMobileMenuButton = styled('button')`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 2rem;
  height: 2rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-left: auto;
  margin-right: 1rem;

  span {
    display: block;
    width: 1.5rem;
    height: 2px;
    background-color: ${Tokens.colors.secondary.value};
    margin: 2px 0;
    transition: 0.3s;
    transform-origin: center;
  }

  &.open {
    span:nth-child(1) {
      transform: rotate(45deg) translate(5px, 5px);
    }
    span:nth-child(2) {
      opacity: 0;
    }
    span:nth-child(3) {
      transform: rotate(-45deg) translate(7px, -6px);
    }
  }
`

const StyledMobileMenu = styled('div')`
  position: absolute;
  top: 4rem;
  left: 0;
  right: 0;
  background-color: ${Tokens.colors.background.value};
  border-top: 1px solid ${Tokens.colors.border.value};
  padding: 1rem;
  transform: translateY(-100%);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;

  &.open {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }
`

const StyledMobileList = styled('ul')`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const StyledMobileListItem = styled('li')`
  a {
    color: ${Tokens.colors.secondary.value};
    text-decoration: none;
    font-size: 1.125rem;
    display: block;
    padding: 0.5rem 0;
    border-bottom: 1px solid transparent;
    transition: border-color 0.2s ease;

    &:hover {
      border-bottom-color: ${Tokens.colors.primary.value};
    }
  }
`

const steps = [
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
]

export default async function MainNav() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return (
    <StyledMenuContainer id="menu">
      <StyledMenu>
        {/* Desktop Navigation */}
        <StyledDesktopNav aria-label="Main Navigation" role="navigation">
          <StyledList aria-label="Main Menu" role="menubar">
            <StyledListItem role="menuitem">
              <StyledTitle steps={steps} speed={100} />
            </StyledListItem>
            <StyledListItem role="menuitem">
              <Link href="/#blog">Blog</Link>
            </StyledListItem>
            <StyledListItem role="menuitem">
              <Link href="/#projects">Projects</Link>
            </StyledListItem>
          </StyledList>
        </StyledDesktopNav>

        {/* Mobile Navigation */}
        <StyledMobileNav aria-label="Main Navigation" role="navigation">
          <StyledTitle steps={steps} speed={100} />
        </StyledMobileNav>

        <MainNavClient user={user} />
      </StyledMenu>
    </StyledMenuContainer>
  )
}
