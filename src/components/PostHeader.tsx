import { Spacer } from '@jasonrundell/dropship'
import { styled } from '@pigment-css/react'

import PostImage from './PostImage'
import ContentDate from './ContentDate'
import { Post } from '@/typeDefinitions/app'
import { StyledHeading, StyledDescription } from '@/styles/common'
import Tokens from '@/lib/tokens'

interface PostHeaderProps {
  post: Post
}

const StyledHeader = styled('header')`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const StyledContentWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const StyledImageWrapper = styled('div')`
  margin-bottom: ${Tokens.sizes.large.value}${Tokens.sizes.large.unit};

  @media (min-width: ${Tokens.sizes.breakpoints.medium.value}${Tokens.sizes
      .breakpoints.medium.unit}) {
    margin-bottom: ${Tokens.sizes.xlarge.value}${Tokens.sizes.xlarge.unit};
    border-radius: 0;
  }
`

const StyledImageDescription = styled('div')`
  margin-top: ${Tokens.sizes.medium.value}${Tokens.sizes.medium.unit};
  padding: 0 ${Tokens.sizes.large.value}${Tokens.sizes.large.unit};
  text-align: center;
`

const StyledByline = styled('div')`
  font-weight: 700;
  font-size: ${Tokens.sizes.medium.value}${Tokens.sizes.medium.unit};
  line-height: 1.75rem;
`

export default function PostHeader({ post }: PostHeaderProps) {
  const { title, date, featuredImage, author } = post

  return (
    <StyledHeader>
      {featuredImage?.src && (
        <StyledImageWrapper>
          <PostImage
            title={title}
            url={featuredImage.src}
            altText={featuredImage.alt ?? ''}
          />
          {featuredImage.description && (
            <StyledImageDescription>
              <StyledDescription>{featuredImage.description}</StyledDescription>
            </StyledImageDescription>
          )}
        </StyledImageWrapper>
      )}

      <StyledContentWrapper>
        <StyledHeading>{title}</StyledHeading>
        {author && (
          <>
            <StyledByline>By: {author}</StyledByline>
            Published: <ContentDate dateString={date} />
            <Spacer />
          </>
        )}
      </StyledContentWrapper>
    </StyledHeader>
  )
}
