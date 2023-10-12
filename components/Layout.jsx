import { Main } from '@jasonrundell/dropship'
import Footer from './Footer'
import Meta from './Meta'
import Navigation from './Navigation'

export default function Layout({ preview, children }) {
  return (
    <>
      <Meta />
      <div className="min-h-screen">
        <Navigation />
        <Main>{children}</Main>
      </div>
      <Footer />
    </>
  )
}
