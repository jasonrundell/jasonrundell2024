import { Row } from '@jasonrundell/dropship'
import ContentfulImage from './contentful-image'

export default function Avatar({ name, picture }) {
  return (
    <Row className="flex flex-row">
      <div className="relative w-12 h-12 mr-4">
        <ContentfulImage
          src={picture.url}
          fill
          className="rounded-full"
          alt=""
        />
      </div>
      <div className="text-xl font-bold">{name}</div>
    </Row>
  )
}
