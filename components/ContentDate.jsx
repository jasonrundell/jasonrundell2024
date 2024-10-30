import { format } from 'date-fns'

export default function ContentDate({ dateString }) {
  return (
    <time dateTime={dateString}>
      {format(new Date(dateString), 'LLLL	d, yyyy')}
    </time>
  )
}
