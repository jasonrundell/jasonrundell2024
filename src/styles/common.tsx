import { styled } from '@pigment-css/react'
import { Heading } from '@jasonrundell/dropship'
import Tokens from '@/lib/tokens'

export const StyledDivBgDark = styled('div')`
  background-color: ${Tokens.colors.background2};
`

export const StyledIntroParagraph = styled('p')`
  font-size: ${Tokens.sizes.fontSize.large}rem;
  line-height: 1.3;
  @media (min-width: ${Tokens.sizes.breakpoints.medium}rem) {
    font-size: ${Tokens.sizes.fontSize.xlarge}rem;
  }
`

export const StyledContainer = styled('div')`
  padding: 0 ${Tokens.sizes.large}rem;
  @media (min-width: ${Tokens.sizes.breakpoints.medium}rem) {
    margin: 0 auto;
    max-width: ${Tokens.sizes.breakpoints.large}rem;
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
  padding: 0 0 ${Tokens.sizes.padding.small}rem 0;
  align-items: center;
`

export const StyledSection = styled('section')`
  padding: ${Tokens.sizes.xlarge}rem 0;
`

export const StyledBody = styled('div')`
  p {
    width: 100%;
  }
  p:first-child {
    font-size: ${Tokens.sizes.fontSize.medium}rem;
  }
  li p:first-child {
    font-size: ${Tokens.sizes.fontSize.small}rem;
  }
  h2 {
    width: 100%;
  }
  h3 {
    width: 100%;
    color: ${Tokens.colors.secondary};
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
  font-size: ${Tokens.sizes.small}rem;
  padding-bottom: ${Tokens.sizes.large}rem;
`

export const StyledMorePostsHeading = styled('h2')`
  font-size: ${Tokens.sizes.large}rem;
  font-weight: 700;
  color: ${Tokens.colors.secondary};
`

export const StyledHeading = styled(Heading)`
  font-weight: 700;
  color: ${Tokens.colors.secondary};
  margin-bottom: ${Tokens.sizes.xlarge}rem !important;
`

export const StyledHeading3 = styled(Heading)`
  font-size: 1.5rem !important;
  margin: 0 0 ${Tokens.sizes.small}rem 0 !important;
`

export const StyledDescription = styled('p')`
  font-size: ${Tokens.sizes.small}rem;
  text-transform: italic;
  color: ${Tokens.colors.secondary};
  width: 100%;
`
