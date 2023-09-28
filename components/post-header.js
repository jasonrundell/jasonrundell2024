import { Heading } from '@jasonrundell/dropship'
import Avatar from '../components/avatar'
import DateComponent from '../components/date'
import CoverImage from '../components/cover-image'

export default function PostHeader({ title, coverImage, date, author }) {
  return (
    <>
      <Heading level={1} label={title} classNames="font-bold" />
      <div className="hidden md:block md:mb-12">
        {author && <Avatar name={author.name} picture={author.picture} />}
      </div>
      <div className="mb-8 md:mb-16 sm:mx-0">
        <CoverImage title={title} url={coverImage.url} />
      </div>
      <div className="max-w-2xl mx-auto">
        <div className="block md:hidden mb-6">
          {author && <Avatar name={author.name} picture={author.picture} />}
        </div>
        <div className="mb-6 text-lg">
          <DateComponent dateString={date} />
        </div>
      </div>
    </>
  )
}
