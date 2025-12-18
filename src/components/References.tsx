import { Blockquote } from '@jasonrundell/dropship'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { Document } from '@contentful/rich-text-types'
import { styled } from '@pigment-css/react'
import Tokens from '@/lib/tokens'
import { References as ReferencesDef } from '@/typeDefinitions/app'

const options = {
  // renderMark: {
  //   [MARKS.BOLD]: (text) => <strong>{text}</strong>,
  // },
  // renderNode: {
  //   [BLOCKS.PARAGRAPH]: (node, children) => <p>{children}</p>,
  // },
}

const spacingSmall = `${Tokens.sizes.spacing.small.value}${Tokens.sizes.spacing.small.unit}`
const spacingMedium = `${Tokens.sizes.spacing.medium.value}${Tokens.sizes.spacing.medium.unit}`
const spacingLarge = `${Tokens.sizes.spacing.large.value}${Tokens.sizes.spacing.large.unit}`
const paddingLarge = `${Tokens.sizes.padding.large.value}${Tokens.sizes.padding.large.unit}`
const borderRadiusMedium = `${Tokens.borderRadius.medium.value}${Tokens.borderRadius.medium.unit}`

const StyledReferencesGrid = styled('section')`
  display: grid;
  gap: ${spacingLarge};
  margin-block: ${Tokens.sizes.padding.xlarge.value}${Tokens.sizes.padding.xlarge.unit};
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
`

const StyledReferenceCard = styled('article')`
  background: ${Tokens.colors.backgroundDarker.value};
  border: 1px solid ${Tokens.colors.background.value};
  border-radius: ${borderRadiusMedium};
  padding: ${paddingLarge};
  display: flex;
  flex-direction: column;
  gap: ${spacingMedium};
  color: ${Tokens.colors.secondary.value};
  box-shadow: ${Tokens.shadows.small.value} ${Tokens.colors.background.value}33;
`

const StyledQuote = styled(Blockquote)`
  margin: 0;
  font-family: ${Tokens.fonts.body.family};
  font-size: ${Tokens.sizes.medium.value}${Tokens.sizes.medium.unit};
  line-height: ${Tokens.sizes.lineHeight.value}${Tokens.sizes.lineHeight.unit};
  color: ${Tokens.colors.textPrimary.value};

  &::before {
    top: -0.5rem !important;
    left: -1.5rem !important;
  }
  &::after {
    right: -1.5rem !important;
  }
`

const StyledReferenceMeta = styled('div')`
  display: flex;
  flex-direction: column;
  gap: ${spacingSmall};
  margin-top: auto;
`

const StyledCite = styled('span')`
  font-weight: 600;
  color: ${Tokens.colors.white.value};
  font-size: ${Tokens.fontSizes.base.value}${Tokens.fontSizes.base.unit};
`

const StyledCompany = styled('span')`
  font-size: ${Tokens.fontSizes.sm.value}${Tokens.fontSizes.sm.unit};
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: ${Tokens.colors.textSecondary.value};
`

function ensureField<Value>(value: Value, label: string, index: number): Value {
  if (!value) {
    console.error(`${label} is required for reference at index ${index}`)
    throw new Error(`${label} is required for every reference entry.`)
  }

  return value
}

export default function References({ references }: ReferencesDef) {
  if (!references || references.length === 0) {
    console.error('References component rendered without data.')
    throw new Error('References data is required.')
  }

  return (
    <StyledReferencesGrid aria-label="Reference testimonials">
      {references.map((reference, index) => {
        const citeName = ensureField(
          reference.citeName,
          'Reference citeName',
          index
        )
        const quote = ensureField(reference.quote, 'Reference quote', index)
        const company = reference.company

        const renderQuote = documentToReactComponents(
          quote as Document,
          options
        )

        return (
          <StyledReferenceCard key={`${citeName}-${index}`}>
            <StyledQuote>{renderQuote}</StyledQuote>
            <StyledReferenceMeta>
              <StyledCite>{citeName}</StyledCite>
              {company && <StyledCompany>{company}</StyledCompany>}
            </StyledReferenceMeta>
          </StyledReferenceCard>
        )
      })}
    </StyledReferencesGrid>
  )
}
