import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import styled from '@emotion/styled'
import Link from 'next/link'
import { tokens } from '../data/tokens'

const Footer = dynamic(() => import('./Footer'))
const Meta = dynamic(() => import('./Meta'))

export default function Layout({ children }) {
  useEffect(() => {
    const handleScroll = () => {
      const menu = document.getElementById('menu')
      if (window.scrollY > 0) {
        menu.classList.add('scrolled')
      } else {
        menu.classList.remove('scrolled')
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const StyledMenuContainer = styled.div`
    @property --background-color-start {
      syntax: '<color>';
      initial-value: ${tokens['--background-color']};
      inherits: false;
    }

    @property --background-color-end {
      syntax: '<color>';
      initial-value: ${tokens['--background-color']};
      inherits: false;
    }

    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 99;
    background-color: ${tokens['--background-color']};
    transition: background 1.3s ease, --background-color-start 1.3s ease,
      --background-color-end 1.3s ease;
  `

  const StyledMenu = styled.div`
    display: flex;
    flex-direction: row;
    max-width: 64rem;
    margin: 0 auto;
    height: 4rem;
    align-items: center;
  `

  const StyledList = styled.ul`
    display: flex;
    margin: 0 0 0 1rem;
    padding: 0;
    list-style: none;
    flex-direction: row;
    align-items: center;

    @media (min-width: 48rem) {
      margin: 0;
    }
  `

  const StyledListItem = styled.li`
    display: flex;
    flex-flow: row nowrap;
    margin: 0 1.5rem 0 0;
  `

  const StyledNav = styled.nav`
    display: flex;
  `

  const StyledTitle = styled.h1`
    text-wrap: nowrap;

    a {
      color: ${tokens['--secondary-color']};
    }
  `

  return (
    <>
      <Meta />
      <StyledMenuContainer id="menu">
        <StyledMenu>
          <StyledNav aria-label="Main Navigation" role="navigation">
            <StyledList aria-label="Main Menu" role="menubar">
              <StyledListItem role="menuitem">
                <StyledTitle>
                  <Link href="/" className="decoration--none">
                    Jason Rundell
                  </Link>
                </StyledTitle>
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
      <main>{children}</main>
      <Footer />
    </>
  )
}
