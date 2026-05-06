import MetaDate from '@/components/chrome/MetaDate'

interface ContentDateProps {
  dateString: string
}

/**
 * Thin compatibility wrapper that delegates to the chrome `MetaDate` so all
 * existing callers (`PostAuthor`, etc.) inherit the refined-terminal cyan
 * `// date` styling without changing import sites.
 */
export default function ContentDate({ dateString }: ContentDateProps) {
  return <MetaDate dateString={dateString} />
}
