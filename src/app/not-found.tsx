import type { Metadata } from 'next'

import TerminalErrorPage from '@/components/TerminalErrorPage'

// Next.js already emits `<meta name="robots" content="noindex">` for the
// not-found boundary, so this only needs to supply the title.
export const metadata: Metadata = {
  title: 'Page not found | Jason Rundell',
}

export default async function NotFound() {
  return (
    <TerminalErrorPage
      statusCode="404"
      title="Page not found"
      comment="Not found"
      message="The page you're looking for isn't here. Head back home and pick a path."
    />
  )
}
