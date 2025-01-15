'use client'

import { useEffect } from 'react'
import { styled } from '@pigment-css/react'
import Link from 'next/link'
import HeadingAnimation from './HeadingAnimation'
import Tokens from '@/lib/tokens'

const StyledMenuContainer = styled('div')({
  width: '100%',
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 99,
  backgroundColor: Tokens.colors.background,
  transition:
    'background 1.3s ease, --background-color-start 1.3s ease, --background-color-end 1.3s ease',
})

const StyledMenu = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  maxWidth: '64rem',
  margin: '0 auto',
  height: '4rem',
  alignItems: 'center',
})

const StyledList = styled('ul')({
  display: 'flex',
  margin: 0,
  padding: 0,
  listStyle: 'none',
  flexDirection: 'row',
  alignItems: 'center',
  '@media (min-width: 48rem)': {
    margin: 0,
  },
})

const StyledListItem = styled('li')({
  display: 'flex',
  flexDirection: 'row',
  margin: '0 1.5rem 0 0',
  textWrap: 'nowrap',
  a: {
    color: Tokens.colors.secondary,
  },
})

const StyledNav = styled('nav')({
  display: 'flex',
})

const StyledTitle = styled(HeadingAnimation)({
  textWrap: 'nowrap',
})

const MainNav = () => {
  useEffect(() => {
    const handleScroll = () => {
      const menu = document.getElementById('menu')
      if (menu) {
        if (window.scrollY > 0) {
          menu.classList.add('scrolled')
        } else {
          menu.classList.remove('scrolled')
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // steps for animated heading
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

  return (
    <StyledMenuContainer id="menu">
      <StyledMenu>
        <StyledNav aria-label="Main Navigation" role="navigation">
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
        </StyledNav>
      </StyledMenu>
    </StyledMenuContainer>
  )
}

export default MainNav
