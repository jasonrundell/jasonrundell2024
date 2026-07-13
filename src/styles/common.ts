import { styled } from '@pigment-css/react'
import { Heading } from '@jasonrundell/dropship'
import Link from 'next/link'
import Tokens from '@/lib/tokens'

/** Alternating full-bleed band. Editorial system uses white on paper ground. */
export const StyledDivBgDark = styled('div')`
  background-color: ${Tokens.colors.surfaceSecondary.var};
  border-top: 1px solid ${Tokens.colors.lineSubtle.var};
  border-bottom: 1px solid ${Tokens.colors.lineSubtle.var};
`

export const StyledIntroParagraph = styled('p')`
  font-family: ${Tokens.fonts.body.var};
  font-size: 1.125rem;
  line-height: 1.6;
  color: ${Tokens.colors.inkMuted.var};
  max-width: 62ch;

  @media (min-width: ${Tokens.sizes.breakpoints.medium.value}${Tokens.sizes
      .breakpoints.medium.unit}) {
    font-size: 1.25rem;
  }
`

export const StyledContainer = styled('div')`
  width: 100%;
  padding: 0 1.25rem;
  margin: 0 auto;

  @media (min-width: ${Tokens.sizes.breakpoints.medium.value}${Tokens.sizes
      .breakpoints.medium.unit}) {
    padding: 0 4rem;
    max-width: 75rem;
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
  padding: 3.5rem 0;

  @media (min-width: ${Tokens.sizes.breakpoints.medium.value}${Tokens.sizes
      .breakpoints.medium.unit}) {
    padding: 4.5rem 0;
  }
`

export const StyledBody = styled('div')`
  font-family: ${Tokens.fonts.body.var};
  font-size: 1.0625rem;
  line-height: 1.7;
  color: ${Tokens.colors.ink.var};
  max-width: 68ch;

  a {
    color: ${Tokens.colors.accent.var};
  }
  a:hover,
  a:focus-visible {
    color: ${Tokens.colors.accentSoft.var};
  }
  p {
    width: 100%;
  }
  p:first-child {
    font-size: 1.1875rem;
  }
  li p:first-child {
    font-size: 1.0625rem;
  }
  h2,
  h3,
  h4,
  h5,
  h6 {
    width: 100%;
    font-family: ${Tokens.fonts.heading.var};
    color: ${Tokens.colors.ink.var};
    margin-top: 2rem;
  }
  blockquote {
    margin: 1.5rem 0;
    padding: 0.5rem 0 0.5rem 1.25rem;
    border-left: 2px solid ${Tokens.colors.accent.var};
    font-family: ${Tokens.fonts.quotes.var};
    font-size: 1.25rem;
    font-style: italic;
    color: ${Tokens.colors.ink.var};
  }
  code {
    font-family: ${Tokens.fonts.monospace.var};
    font-size: 0.9em;
    background: ${Tokens.colors.surfaceSecondary.var};
    border: 1px solid ${Tokens.colors.lineSubtle.var};
    padding: 0.1em 0.35em;
  }
  pre {
    background: ${Tokens.colors.ink.var};
    color: ${Tokens.colors.onInk.var};
    padding: 1rem 1.25rem;
    overflow: auto;
  }
  pre code {
    background: none;
    border: none;
    color: inherit;
    padding: 0;
  }
  img {
    max-width: 100%;
    height: auto;
    border: 1px solid ${Tokens.colors.lineSubtle.var};
  }
`

export const StyledBreadcrumb = styled('div')`
  font-family: ${Tokens.fonts.monospace.var};
  font-size: 0.8125rem;
  letter-spacing: 0.02em;
  padding-bottom: 2rem;
  color: ${Tokens.colors.inkFaint.var};

  a {
    color: ${Tokens.colors.inkFaint.var};
    text-decoration: none;
  }
  a:hover {
    color: ${Tokens.colors.accent.var};
  }
`

export const StyledMorePostsHeading = styled('h2')`
  font-family: ${Tokens.fonts.heading.var};
  font-size: clamp(1.75rem, 3vw, 2.25rem);
  font-weight: 600;
  color: ${Tokens.colors.ink.var};
`

export const StyledHeading = styled(Heading)`
  font-family: ${Tokens.fonts.heading.var};
  font-weight: 600;
  color: ${Tokens.colors.ink.var};
  margin-bottom: 1.5rem !important;
`

export const StyledHeading3 = styled(Heading)`
  font-family: ${Tokens.fonts.heading.var};
  font-size: 1.375rem !important;
  margin: 0 0 ${Tokens.sizes.small.value}${Tokens.sizes.small.unit} 0 !important;
`

export const StyledDescription = styled('p')`
  font-family: ${Tokens.fonts.body.var};
  font-size: 1rem;
  color: ${Tokens.colors.inkMuted.var};
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
  height: 220px;
  margin: 0;
  overflow: hidden;
  border: 1px solid ${Tokens.colors.lineSubtle.var};
  background-color: ${Tokens.colors.surfaceSecondary.var};

  @media (min-width: ${Tokens.sizes.breakpoints.medium.value}${Tokens.sizes
      .breakpoints.medium.unit}) {
    height: 360px;
    margin-bottom: ${Tokens.sizes.xlarge.value}${Tokens.sizes.xlarge.unit};
  }

  @media (min-width: ${Tokens.sizes.breakpoints.large.value}${Tokens.sizes
      .breakpoints.large.unit}) {
    height: 440px;
  }

  img {
    object-fit: cover;
    object-position: center;
  }
`

export const StyledLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${Tokens.sizes.spacing.xsmall.value}${Tokens.sizes.spacing.xsmall.unit};
  color: ${Tokens.colors.accent.var};
  text-decoration: none;
  font-weight: 500;
  transition: color 0.15s;

  &:hover {
    color: ${Tokens.colors.accentSoft.var};
    text-decoration: underline;
  }
`

export const StyledFlexSection = styled('div')`
  display: flex;
  flex-direction: column;
  gap: ${Tokens.sizes.small.value}${Tokens.sizes.small.unit};
`

export const StyledModal = styled('div')`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(26, 26, 26, 0.92);
  z-index: ${Tokens.zIndex.modal.value};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${Tokens.sizes.small.value}${Tokens.sizes.small.unit};
`

export const StyledModalContent = styled('div')`
  position: relative;
  width: 100%;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const StyledCloseButton = styled('button')`
  position: absolute;
  top: ${Tokens.sizes.small.value}${Tokens.sizes.small.unit};
  right: ${Tokens.sizes.small.value}${Tokens.sizes.small.unit};
  background: ${Tokens.colors.surfaceSecondary.var};
  border: 1px solid ${Tokens.colors.line.var};
  color: ${Tokens.colors.ink.var};
  cursor: pointer;
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease-in-out;
  z-index: ${Tokens.zIndex.modalContent.value};

  &:hover {
    background: ${Tokens.colors.surfacePrimary.var};
  }

  &:focus-visible {
    outline: 2px solid ${Tokens.colors.accent.var};
    outline-offset: 2px;
  }
`

/** Shared `<h3>` heading for preview cards (ProjectPreview, PostPreview, Skills). */
export const StyledPreviewHeading = styled('h3')`
  font-family: ${Tokens.fonts.heading.var};
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 ${Tokens.sizes.xsmall.value}${Tokens.sizes.xsmall.unit} 0;
`

/**
 * Square light icon button shared by GalleryModal nav arrows and
 * StyledCloseButton descendants. Extend for positional variants.
 */
export const StyledIconCircleButton = styled('button')`
  background: ${Tokens.colors.surfaceSecondary.var};
  border: 1px solid ${Tokens.colors.line.var};
  color: ${Tokens.colors.ink.var};
  cursor: pointer;
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease-in-out;

  &:hover {
    background: ${Tokens.colors.surfacePrimary.var};
  }

  &:focus-visible {
    outline: 2px solid ${Tokens.colors.accent.var};
    outline-offset: 2px;
  }

  &:disabled {
    opacity: ${Tokens.opacity.low.value};
    cursor: not-allowed;
  }
`
