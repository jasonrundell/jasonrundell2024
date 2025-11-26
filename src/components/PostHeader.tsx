import { Spacer } from '@jasonrundell/dropship'
import { styled } from '@pigment-css/react'

import Author from './PostAuthor'
import PostImage from './PostImage'
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

export default function PostHeader({ post }: PostHeaderProps) {
  const { title, date, featuredImage, author } = post

  return (
    <StyledHeader>
      {/* Featured image at the top */}
      {featuredImage?.fields.file.fields.file.url && (
        <StyledImageWrapper>
          <PostImage
            title={title}
            url={featuredImage.fields.file.fields.file.url}
            altText={featuredImage.fields.altText || ''}
          />
          {featuredImage.fields.description && (
            <StyledImageDescription>
              <StyledDescription>
                {featuredImage.fields.description}
              </StyledDescription>
            </StyledImageDescription>
          )}
        </StyledImageWrapper>
      )}

      {/* Title and author info below the image */}
      <StyledContentWrapper>
        <StyledHeading>{title}</StyledHeading>
        {author && (
          <>
            <Author
              name={author.fields.name}
              picture={author.fields.picture.fields.file}
              date={date}
            />
            <Spacer />
          </>
        )}
      </StyledContentWrapper>
    </StyledHeader>
  )
}
