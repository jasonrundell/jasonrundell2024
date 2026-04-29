import { render, screen } from '@testing-library/react'
import PromptList, { PromptItem } from './PromptList'

describe('PromptList', () => {
  it('renders a ul with the given aria-label', () => {
    render(
      <PromptList aria-label="Skills">
        <PromptList.Item>React</PromptList.Item>
        <PromptList.Item>TypeScript</PromptList.Item>
      </PromptList>
    )

    const list = screen.getByRole('list', { name: 'Skills' })
    expect(list.tagName).toBe('UL')
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
  })

  it('exposes PromptItem as both a static property and a named export', () => {
    expect(PromptList.Item).toBe(PromptItem)
  })

  it('renders the children of each PromptItem', () => {
    render(
      <PromptList>
        <PromptList.Item>Acme</PromptList.Item>
        <PromptList.Item>Globex</PromptList.Item>
      </PromptList>
    )

    expect(screen.getByText('Acme')).toBeInTheDocument()
    expect(screen.getByText('Globex')).toBeInTheDocument()
  })

  it('forwards extra props to the underlying ul', () => {
    render(
      <PromptList data-testid="prompt-list">
        <PromptList.Item>One</PromptList.Item>
      </PromptList>
    )

    expect(screen.getByTestId('prompt-list')).toBeInTheDocument()
  })
})
