import { styled } from '@pigment-css/react'
import ContentfulImage from './ContentfulImage'
import ContentDate from './ContentDate'
import Tokens from '@/lib/tokens'

interface PostAuthorProps {
  name: string
  picture: {
    url: string
  }
  date: string
}

const StyledContainer = styled('div')({
  display: 'flex',
  flexFlow: 'row wrap',
  justifyContent: 'start',
  justifyItems: 'start',
  alignItems: 'center',
})

const StyledAuthor = styled('div')({
  position: 'relative',
  width: '3rem',
  height: '3rem',
  marginRight: `${Tokens.sizes.small}rem`,
})

const StyledPublished = styled('div')({
  fontWeight: 700,
  fontSize: `${Tokens.sizes.medium}rem`,
  lineHeight: '1.75rem',
})

export default function PostAuthor({ name, picture, date }: PostAuthorProps) {
  return (
    <StyledContainer>
      <StyledAuthor>
        <ContentfulImage
          src={picture.url}
          fill={true}
          className="rounded-full"
          alt={name}
          sizes="(max-width: 48px)"
        />
      </StyledAuthor>
      <div>
        <StyledPublished>By: {name}</StyledPublished>
        Published: <ContentDate dateString={date} />
      </div>
    </StyledContainer>
  )
}
