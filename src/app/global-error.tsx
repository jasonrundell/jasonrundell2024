'use client'

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'

import TerminalErrorPage from '@/components/TerminalErrorPage'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html>
      <body>
        <TerminalErrorPage
          statusCode="500"
          title="Runtime Error"
          comment="global-error.tsx"
          message="The current route crashed before it could finish rendering. Try the command again or return home."
          reset={reset}
        />
      </body>
    </html>
  )
}
