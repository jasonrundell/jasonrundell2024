import styled from '@emotion/styled'
import ContentfulImage from './contentful-image'
import DateComponent from './date'
import { tokens } from '../data/tokens'

export default function Author({ name, picture, date }) {
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
          fill
          className="rounded-full"
          alt={name}
        />
      </StyledAuthor>
      <div>
        <StyledPublished>By: {name}</StyledPublished>
        Published: <DateComponent dateString={date} />
      </div>
    </StyledContainer>
  )
}
