import { Main } from '@jasonrundell/dropship'
import Alert from '../components/alert'
import Footer from '../components/footer'
import Meta from '../components/meta'

export default function Layout({ preview, children }) {
  return (
    <>
      <Meta />
      <div className="min-h-screen">
        <Alert preview={preview} />
        <Main>{children}</Main>
      </div>
      <Footer />
    </>
  )
}
