import { useEffect } from 'react'
import { Main } from '@jasonrundell/dropship'
import styled from '@emotion/styled'
import Link from 'next/link'
import Image from 'next/image'
import Footer from './Footer'
import Meta from './Meta'
import { tokens } from '../data/tokens'

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

  const StyledListItem = styled.li`
    display: flex;
    flex-flow: row nowrap;
    margin: 0;
  `

  const StyledList = styled.ul`
    display: flex;
    margin: 0 0 0 1rem;
    padding: 0;
    list-style: none;
    flex-direction: row;
    align-items: center;

    @media (min-width: 768px) {
      margin: 0;
    }
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

  const StyledLogo = styled(Image)`
    margin-right: ${tokens['--size-small']};
  `

  return (
    <>
      <Meta />
      <StyledMenuContainer id="menu">
        <StyledMenu>
          <StyledNav aria-label="Main Navigation" role="navigation">
            <StyledList aria-label="Main Menu" role="menu">
              <StyledListItem role="presentation">
                <Link href="/" role="menuitem">
                  <StyledLogo
                    src="/top-bar-icon.png"
                    alt="Placeholder Logo"
                    width={32}
                    height={32}
                  />
                </Link>
                <StyledTitle role="presentation">
                  <Link href="/" className="decoration--none" role="menuitem">
                    Jason Rundell
                  </Link>
                </StyledTitle>
              </StyledListItem>
              <li role="presentation">
                <Link role="menuitem" href="/#blog">
                  Blog
                </Link>
              </li>
              <li role="presentation">
                <Link role="menuitem" href="/#projects">
                  Projects
                </Link>
              </li>
            </StyledList>
          </StyledNav>
        </StyledMenu>
      </StyledMenuContainer>
      <Main>{children}</Main>
      <Footer />
    </>
  )
}
