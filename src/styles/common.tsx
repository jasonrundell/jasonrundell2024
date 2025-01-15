import { styled } from '@pigment-css/react'
import Tokens from '@/lib/tokens'

export const StyledDivBgDark = styled('div')({
  backgroundColor: Tokens.colors.background2,
})

export const StyledIntroParagraph = styled('p')({
  fontSize: `${Tokens.sizes.fontSize.large}rem`,
  lineHeight: 1.3,
  '@media (min-width: 48rem)': {
    fontSize: `${Tokens.sizes.fontSize.xlarge}rem`,
  },
})

export const StyledContainer = styled('div')({
  padding: `0 ${Tokens.sizes.large}`,
  '@media (min-width: 48rem)': {
    margin: '0 auto',
    maxWidth: '64rem',
  },
})

export const StyledList = styled('ul')({
  margin: 0,
  padding: 0,
  listStyle: 'none',
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
})

export const StyledListItem = styled('li')({
  display: 'flex',
  margin: 0,
  padding: '0 0 1rem 0',
  alignItems: 'center',
})

export const StyledSection = styled('section')({
  padding: `${Tokens.sizes.xlarge} 0`,
})

export const StyledBody = styled('div')({
  p: {
    width: '100%',
  },
  h2: {
    width: '100%',
  },
  h3: {
    width: '100%',
  },
  h4: {
    width: '100%',
  },
  h5: {
    width: '100%',
  },
  h6: {
    width: '100%',
  },
})

export const StyledBreadcrumb = styled('div')({
  fontSize: `${Tokens.sizes.small}rem`,
  paddingBottom: `${Tokens.sizes.large}rem`,
})

export const StyledMorePostsHeading = styled('h2')({
  fontSize: `${Tokens.sizes.large}rem`,
  fontWeight: 700,
  color: Tokens.colors.secondary,
})
