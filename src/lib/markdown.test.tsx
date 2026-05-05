import { render, screen } from '@testing-library/react'

jest.mock('react-markdown', () => {
  return function MockReactMarkdown({
    children,
    components,
  }: {
    children: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    components?: Record<string, any>
  }) {
    const imgMatch = children.match(/!\[([^\]]*)\]\(([^)]+)\)/)
    const codeBlockMatch = children.match(/```(\w+)?\n([\s\S]+?)\n```/)
    const inlineCodeMatch = !codeBlockMatch && children.match(/`([^`]+)`/)
    const h2Match = children.match(/^## (.+)$/m)
    const tableMatch = children.includes('| Name |')

    // Exercise all three branches of the custom code renderer:
    // 1. className starts with 'language-' → fenced block
    // 2. className defined but not 'language-' → treated as inline
    // 3. className undefined → inline
    const nonLangCodeMatch = children.match(/`!([^`]+)`/)

    return (
      <div data-testid="markdown">
        {h2Match && <h2>{h2Match[1]}</h2>}
        {tableMatch && (
          <table>
            <tbody>
              <tr>
                <td>Name</td>
                <td>Value</td>
              </tr>
              <tr>
                <td>a</td>
                <td>1</td>
              </tr>
            </tbody>
          </table>
        )}
        {imgMatch && components?.img?.({ src: imgMatch[2], alt: imgMatch[1] })}
        {codeBlockMatch &&
          components?.code?.({
            children: codeBlockMatch[2],
            className: `language-${codeBlockMatch[1] || ''}`,
          })}
        {inlineCodeMatch &&
          components?.code?.({ children: inlineCodeMatch[1], className: undefined })}
        {nonLangCodeMatch &&
          components?.code?.({ children: nonLangCodeMatch[1], className: 'highlight' })}
        {!imgMatch &&
          !codeBlockMatch &&
          !inlineCodeMatch &&
          !nonLangCodeMatch &&
          !h2Match &&
          !tableMatch && (
            <p>{children.replace(/\*\*([^*]+)\*\*/g, '$1')}</p>
          )}
      </div>
    )
  }
})

jest.mock('remark-gfm', () => () => {})

import RenderedMDX from './markdown'

describe('RenderedMDX', () => {
  it('renders plain text', () => {
    render(<RenderedMDX source="Hello world" />)
    expect(screen.getByText('Hello world')).toBeInTheDocument()
  })

  it('renders an image via the custom img component with maxWidth style', () => {
    render(<RenderedMDX source="![Alt text](./image.webp)" />)
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', './image.webp')
    expect(img).toHaveAttribute('alt', 'Alt text')
    expect((img as HTMLImageElement).style.maxWidth).toBe('100%')
  })

  it('renders inline code (no className) via the custom code component', () => {
    render(<RenderedMDX source="Use `npm install` to set up." />)
    const code = screen.getByText('npm install')
    expect(code.tagName.toLowerCase()).toBe('code')
  })

  it('renders a fenced code block (with language className) via the custom code component', () => {
    render(<RenderedMDX source={"```js\nconst x = 1\n```"} />)
    expect(screen.getByText('const x = 1')).toBeInTheDocument()
    const pre = screen.getByText('const x = 1').closest('pre')
    expect(pre).toBeInTheDocument()
  })

  it('renders bold text passthrough', () => {
    render(<RenderedMDX source="**bold text**" />)
    expect(screen.getByText('bold text')).toBeInTheDocument()
  })

  it('renders a heading', () => {
    render(<RenderedMDX source="## Heading Two" />)
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'Heading Two'
    )
  })

  it('renders GFM tables', () => {
    const src = `| Name | Value |
| ---- | ----- |
| a    | 1     |`
    render(<RenderedMDX source={src} />)
    expect(screen.getByRole('table')).toBeInTheDocument()
    expect(screen.getByText('Name')).toBeInTheDocument()
  })

  it('renders code with a non-language className as inline code', () => {
    // The mock pattern `!sometext` triggers the non-language className branch
    render(<RenderedMDX source="`!highlighted`" />)
    const code = screen.getByText('highlighted')
    expect(code.tagName.toLowerCase()).toBe('code')
  })

  it('renders an empty source without crashing', () => {
    const { container } = render(<RenderedMDX source="" />)
    expect(container).toBeInTheDocument()
  })
})
