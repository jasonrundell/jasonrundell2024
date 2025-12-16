import { styled } from '@pigment-css/react'
import { Heading } from '@jasonrundell/dropship'
import Tokens from '@/lib/tokens'

export const StyledDivBgDark = styled('div')`
  background-color: ${Tokens.colors.backgroundDark.value};
`

export const StyledIntroParagraph = styled('p')`
  font-size: ${Tokens.sizes.fonts.large.value}${Tokens.sizes.fonts.large.unit};
  line-height: 1.3;
  @media (min-width: ${Tokens.sizes.breakpoints.medium.value}${Tokens.sizes
      .breakpoints.medium.unit}) {
    font-size: ${Tokens.sizes.fonts.xlarge.value}${Tokens.sizes.fonts.xlarge.unit};
  }
`

export const StyledContainer = styled('div')`
  padding: 0 ${Tokens.sizes.large.value}${Tokens.sizes.large.unit};
  @media (min-width: ${Tokens.sizes.breakpoints.medium.value}${Tokens.sizes
      .breakpoints.medium.unit}) {
    margin: 0 auto;
    max-width: ${Tokens.sizes.breakpoints.large.value}${Tokens.sizes.breakpoints.large.unit};
  }
`

export const StyledList = styled('ul')`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  width: 100%;
`

export const StyledListItem = styled('li')`
  display: flex;
  margin: 0;
  padding: 0 0 ${Tokens.sizes.padding.small.value}${Tokens.sizes.padding.small
      .unit} 0;
  align-items: center;
`

export const StyledSection = styled('section')`
  padding: ${Tokens.sizes.xlarge.value}${Tokens.sizes.xlarge.unit} 0;
`

export const StyledBody = styled('div')`
  a {
    color: ${Tokens.colors.primary.value};
  }
  p {
    width: 100%;
  }
  p:first-child {
    font-size: ${Tokens.sizes.fonts.medium.value}${Tokens.sizes.fonts.medium.unit};
  }
  li p:first-child {
    font-size: ${Tokens.sizes.fonts.small.value}${Tokens.sizes.fonts.small.unit};
  }
  h2 {
    width: 100%;
  }
  h3 {
    width: 100%;
    color: ${Tokens.colors.secondary.value};
  }
  h4 {
    width: 100%;
  }
  h5 {
    width: 100%;
  }
  h6 {
    width: 100%;
  }
`

export const StyledBreadcrumb = styled('div')`
  font-size: ${Tokens.sizes.small.value}${Tokens.sizes.small.unit};
  padding-bottom: ${Tokens.sizes.large.value}${Tokens.sizes.large.unit};

  a {
    color: ${Tokens.colors.primary.value};
  }
`

export const StyledMorePostsHeading = styled('h2')`
  font-size: ${Tokens.sizes.large.value}${Tokens.sizes.large.unit};
  font-weight: 700;
  color: ${Tokens.colors.secondary.value};
`

export const StyledHeading = styled(Heading)`
  font-weight: 700;
  color: ${Tokens.colors.secondary.value};
  margin-bottom: ${Tokens.sizes.xlarge.value}${Tokens.sizes.xlarge.unit} !important;
`

export const StyledHeading3 = styled(Heading)`
  font-size: 1.5rem !important;
  margin: 0 0 ${Tokens.sizes.small.value}${Tokens.sizes.small.unit} 0 !important;
`

export const StyledDescription = styled('p')`
  font-size: ${Tokens.sizes.small.value}${Tokens.sizes.small.unit};
  text-transform: italic;
  color: ${Tokens.colors.secondary.value};
  width: 100%;
`

export const StyledEmbeddedAsset = styled('div')`
  display: flex;
  justify-content: flex-start;
  justify-items: flex-start;
  align-items: flex-start;
  margin: 40px auto;
  width: 100%;
  height: 100%;

  img {
    width: 100%;
    height: 100%;
    max-width: 350px;
    max-height: 350px;
  }
`
export const StyledImageContainer = styled('div')`
  position: relative;
  display: block;
  width: 100%;
  height: 150px;
  margin: 0;
  overflow: hidden;
  border-radius: ${Tokens.borderRadius.medium.value}${Tokens.borderRadius.medium.unit};
  background-color: ${Tokens.colors.backgroundDarker.value};

  @media (min-width: ${Tokens.sizes.breakpoints.medium.value}${Tokens.sizes
      .breakpoints.medium.unit}) {
    height: 350px;
    margin-bottom: ${Tokens.sizes.xlarge.value}${Tokens.sizes.xlarge.unit};
  }

  @media (min-width: ${Tokens.sizes.breakpoints.large.value}${Tokens.sizes
      .breakpoints.large.unit}) {
    height: 400px;
  }

  img {
    object-fit: cover;
    object-position: center;
  }
`
