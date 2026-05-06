import { styled } from '@pigment-css/react'
import ContentDate from './ContentDate'
import Tokens from '@/lib/tokens'

interface PostAuthorProps {
  name: string
  date: string
}

const StyledContainer = styled('div')`
  display: flex;
  flex-flow: row wrap;
  justify-content: start;
  justify-items: start;
  align-items: center;
`

const StyledPublished = styled('div')`
  font-weight: 700;
  font-size: ${Tokens.sizes.medium.value}${Tokens.sizes.medium.unit};
  line-height: 1.75rem;
`

export default function PostAuthor({ name, date }: PostAuthorProps) {
  return (
    <StyledContainer>
      <div>
        <StyledPublished>By: {name}</StyledPublished>
        Published: <ContentDate dateString={date} />
      </div>
    </StyledContainer>
  )
}
