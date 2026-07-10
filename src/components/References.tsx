import { styled } from '@pigment-css/react'
import Tokens from '@/lib/tokens'
import { References as ReferencesDef } from '@/typeDefinitions/app'

const bp = `${Tokens.sizes.breakpoints.large.value}${Tokens.sizes.breakpoints.large.unit}`

const StyledReferencesGrid = styled('section')`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: 1fr;

  @media (min-width: ${bp}) {
    grid-template-columns: 1fr 1fr;
  }
`

const StyledReferenceCard = styled('article')`
  background: ${Tokens.colors.surfaceSecondary.var};
  border: 1px solid ${Tokens.colors.lineSubtle.var};
  border-left: 2px solid ${Tokens.colors.accent.var};
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`

const StyledQuote = styled('blockquote')`
  margin: 0;
  font-family: ${Tokens.fonts.quotes.var};
  font-size: 1.1875rem;
  line-height: 1.5;
  color: ${Tokens.colors.ink.var};
`

const StyledQuoteParagraph = styled('p')`
  margin: 0;

  &:not(:last-child) {
    margin-bottom: 1rem;
  }
`

const StyledReferenceMeta = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin-top: auto;
`

const StyledCite = styled('span')`
  font-family: ${Tokens.fonts.body.var};
  font-weight: 600;
  color: ${Tokens.colors.ink.var};
  font-size: 1rem;
`

const StyledCompany = styled('span')`
  font-family: ${Tokens.fonts.monospace.family};
  font-size: 0.8125rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${Tokens.colors.inkFaint.var};
`

function formatQuoteParagraphs(quote: string) {
  return quote.split('\n\n').map((paragraph, index) => (
    <StyledQuoteParagraph key={index}>{paragraph}</StyledQuoteParagraph>
  ))
}

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

        return (
          <StyledReferenceCard key={`${citeName}-${index}`}>
            <StyledQuote>{formatQuoteParagraphs(quote)}</StyledQuote>
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
