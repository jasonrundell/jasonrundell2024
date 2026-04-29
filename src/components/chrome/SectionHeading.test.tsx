import { render, screen } from '@testing-library/react'
import SectionHeading from './SectionHeading'

describe('SectionHeading', () => {
  it('renders an h2 by default with the provided children as accessible name', () => {
    render(<SectionHeading comment="skills.tsx">Skills</SectionHeading>)

    const heading = screen.getByRole('heading', { name: 'Skills' })
    expect(heading.tagName).toBe('H2')
  })

  it('renders an h3 when level=3', () => {
    render(
      <SectionHeading comment="nested.tsx" level={3}>
        Nested
      </SectionHeading>
    )

    const heading = screen.getByRole('heading', { name: 'Nested' })
    expect(heading.tagName).toBe('H3')
  })

  it('renders the // comment line above the heading and marks it aria-hidden', () => {
    const { container } = render(
      <SectionHeading comment="experience.tsx">Experience</SectionHeading>
    )

    const comment = container.querySelector('[aria-hidden="true"]')
    expect(comment).toHaveTextContent('// experience.tsx')
  })

  it('forwards id to the heading element', () => {
    render(
      <SectionHeading comment="recommendations.tsx" id="recommendations">
        Recommendations
      </SectionHeading>
    )

    const heading = screen.getByRole('heading', { name: 'Recommendations' })
    expect(heading).toHaveAttribute('id', 'recommendations')
  })
})
