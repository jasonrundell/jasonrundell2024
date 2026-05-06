import TerminalErrorPage from '@/components/TerminalErrorPage'

export default async function NotFound() {
  return (
    <TerminalErrorPage
      statusCode="404"
      title="Page Not Found"
      comment="not-found.tsx"
      message="The route you requested is not in this site map. Return home and choose a known command."
    />
  )
}
