import { useEffect } from 'react'
import { Main } from '@jasonrundell/dropship'
import Link from 'next/link'
import Image from 'next/image'
import Footer from './Footer'
import Meta from './Meta'

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

  return (
    <>
      <Meta />
      <div id="menu">
        <div id="rmm__menu" role="navigation">
          <Image
            id="topbar"
            src="/top-bar-icon.png"
            alt="Placeholder Logo"
            width={32}
            height={32}
          />
          <h1 id="rmm__title">Jason Rundell</h1>
          <nav id="rmm__nav" aria-label="Main Navigation" role="navigation">
            <ul
              id="rmm__main"
              role="menubar"
              aria-label="Main Menu"
              className="rmm__nav-list"
            >
              <li
                id="rmm-main-nav-item-blog"
                role="none"
                className="rmm__main-nav-item"
              >
                <Link
                  role="menuitem"
                  href="/#blog"
                  className="rmm__main-nav-item-link"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <Main>{children}</Main>
      <Footer />
    </>
  )
}
