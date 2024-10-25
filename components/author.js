import { Row } from '@jasonrundell/dropship'
import ContentfulImage from './contentful-image'
import DateComponent from './date'

export default function Author({ name, picture, date }) {
  return (
    <Row className="flex flex-row justify-items-start items-center">
      <div className="relative w-12 h-12 mr-4">
        <ContentfulImage
          src={picture.url}
          fill
          className="rounded-full"
          alt={name}
        />
      </div>
      <div>
        <div className="text-xl font-bold">By: {name}</div>
        Published: <DateComponent dateString={date} />
      </div>
    </Row>
  )
}
