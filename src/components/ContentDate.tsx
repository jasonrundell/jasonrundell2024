import { format } from 'date-fns'

interface ContentDateProps {
  dateString: string
}

export default async function ContentDate({ dateString }: ContentDateProps) {
  return (
    <time dateTime={dateString}>
      {format(new Date(dateString), 'LLLL	d, yyyy')}
    </time>
  )
}
