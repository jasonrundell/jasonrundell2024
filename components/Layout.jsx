import { Main } from '@jasonrundell/dropship'
import { Menu } from '@jasonrundell/react-mega-menu'
import Footer from './Footer'
import Meta from './Meta'

export default function Layout({ children }) {
  const menuConfig = {
    topbar: {
      id: 'topbar',
      logo: {
        src: '/top-bar-icon.png',
        alt: 'Placeholder Logo',
        rel: 'home',
      },
      title: 'Jason Rundell',
    },
    menu: {
      items: [
        {
          id: 'home',
          label: 'Home',
          type: 'main',
          url: '/',
        },
        {
          id: 'blog',
          label: 'Blog',
          type: 'main',
          url: '/#blog',
        },
        {
          id: 'contact',
          label: 'Contact',
          type: 'main',
          url: '/#contact',
        },
      ],
    },
  }

  return (
    <>
      <Meta />
      <div className="min-h-screen">
        <Menu config={menuConfig} />
        <Main>{children}</Main>
      </div>
      <Footer />
    </>
  )
}
