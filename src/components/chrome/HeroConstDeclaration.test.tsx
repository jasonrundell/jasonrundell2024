import { render } from '@testing-library/react'
import HeroConstDeclaration from './HeroConstDeclaration'

describe('HeroConstDeclaration', () => {
  it('renders the const block as decorative (aria-hidden) so the page h1 stays the announced heading', () => {
    const { container } = render(
      <HeroConstDeclaration
        fields={[
          { key: 'name', value: 'Jason Rundell' },
          { key: 'role', value: 'Manager / Full Stack Developer' },
        ]}
      />
    )

    const pre = container.querySelector('pre')
    expect(pre).toBeInTheDocument()
    expect(pre).toHaveAttribute('aria-hidden', 'true')
  })

  it('renders the comment header, identifier, and field key/value pairs', () => {
    const { container } = render(
      <HeroConstDeclaration
        comment="hero.tsx"
        identifier="session"
        fields={[
          { key: 'name', value: 'Jason Rundell' },
          { key: 'role', value: 'Manager / Full Stack Developer' },
        ]}
      />
    )

    const pre = container.querySelector('pre')
    expect(pre?.textContent).toContain('// hero.tsx')
    expect(pre?.textContent).toContain('const')
    expect(pre?.textContent).toContain('session')
    expect(pre?.textContent).toContain('name')
    expect(pre?.textContent).toContain("'Jason Rundell'")
    expect(pre?.textContent).toContain('role')
    expect(pre?.textContent).toContain("'Manager / Full Stack Developer'")
  })

  it('uses default comment "hero.tsx" and identifier "session" when omitted', () => {
    const { container } = render(
      <HeroConstDeclaration fields={[{ key: 'name', value: 'X' }]} />
    )

    const pre = container.querySelector('pre')
    expect(pre?.textContent).toContain('// hero.tsx')
    expect(pre?.textContent).toContain('session')
  })

  it('handles the single-field case without trailing-comma errors', () => {
    const { container } = render(
      <HeroConstDeclaration fields={[{ key: 'pitch', value: 'Hello' }]} />
    )

    const pre = container.querySelector('pre')
    expect(pre?.textContent).toContain('pitch')
    expect(pre?.textContent).toContain("'Hello'")
  })

  it('omits the trailing comma after the last field and keeps commas on preceding fields', () => {
    const { container } = render(
      <HeroConstDeclaration
        fields={[
          { key: 'first', value: 'A' },
          { key: 'last', value: 'B' },
        ]}
      />
    )

    const text = container.querySelector('pre')?.textContent ?? ''
    // The text contains "first: 'A'," followed by a newline
    expect(text).toMatch(/'A',/)
    // The final field value is NOT followed by a comma before the closing brace
    expect(text).toMatch(/'B'\n}/)
  })

  it('renders one key/value entry per field', () => {
    const { container } = render(
      <HeroConstDeclaration
        fields={[
          { key: 'a', value: '1' },
          { key: 'b', value: '2' },
          { key: 'c', value: '3' },
        ]}
      />
    )

    const text = container.querySelector('pre')?.textContent ?? ''
    expect(text).toContain('a')
    expect(text).toContain('b')
    expect(text).toContain('c')
    expect(text).toContain("'1'")
    expect(text).toContain("'2'")
    expect(text).toContain("'3'")
  })
})
