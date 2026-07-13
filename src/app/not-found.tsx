import TerminalErrorPage from '@/components/TerminalErrorPage'

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
