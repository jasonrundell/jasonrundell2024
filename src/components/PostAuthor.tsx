import styled from '@emotion/styled'
import ContentfulImage from './ContentfulImage'
import ContentDate from './ContentDate'
import { tokens } from '@/data/tokens'

interface PostAuthorProps {
  name: string
  picture: {
    url: string
  }
  date: string
}

export default function PostAuthor({ name, picture, date }: PostAuthorProps) {
  const StyledContainer = styled.div`
    display: flex;
    flex-flow: row wrap;
    justify-content: start;
    justify-items: start;
    align-items: center;
  `

  const StyledAuthor = styled.div`
    position: relative;
    width: 3rem;
    height: 3rem;
    margin-right: ${tokens['--size-small']};
  `

  const StyledPublished = styled.div`
    font-weight: 700;
    font-size: ${tokens['--size-normal']};
    line-height: 1.75rem;
  `

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
