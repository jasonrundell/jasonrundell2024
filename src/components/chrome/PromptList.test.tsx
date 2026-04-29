import { act, render, screen } from '@testing-library/react'

jest.mock('@pigment-css/react', () => {
  const actual = jest.requireActual('@pigment-css/react')
  return {
    ...actual,
    keyframes: jest.fn(() => 'mocked-keyframes'),
  }
})

class MockIntersectionObserver {
  static instances: MockIntersectionObserver[] = []

  callback: IntersectionObserverCallback
  disconnected = false

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback
    MockIntersectionObserver.instances.push(this)
  }

  observe() {}
  unobserve() {}
  disconnect() {
    this.disconnected = true
  }
  takeRecords(): IntersectionObserverEntry[] {
    return []
  }

  trigger(isIntersecting: boolean) {
    this.callback(
      [{ isIntersecting }] as unknown as IntersectionObserverEntry[],
      this as unknown as IntersectionObserver
    )
  }
}

beforeEach(() => {
  MockIntersectionObserver.instances = []
  ;(
    globalThis as unknown as {
      IntersectionObserver: typeof MockIntersectionObserver
    }
  ).IntersectionObserver = MockIntersectionObserver
})

afterEach(() => {
  delete (
    globalThis as unknown as {
      IntersectionObserver?: typeof MockIntersectionObserver
    }
  ).IntersectionObserver
})

import PromptList, { PromptItem } from './PromptList'

describe('PromptList', () => {
  it('renders a ul with the given aria-label', () => {
    render(
      <PromptList aria-label="Skills">
        <PromptItem>React</PromptItem>
        <PromptItem>TypeScript</PromptItem>
      </PromptList>
    )

    const list = screen.getByRole('list', { name: 'Skills' })
    expect(list.tagName).toBe('UL')
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
  })

  it('exports PromptItem as a named export (server-component-friendly, no static property)', () => {
    expect(PromptItem).toBeDefined()
    expect((PromptList as unknown as { Item?: unknown }).Item).toBeUndefined()
  })

  it('renders the children of each PromptItem', () => {
    render(
      <PromptList>
        <PromptItem>Acme</PromptItem>
        <PromptItem>Globex</PromptItem>
      </PromptList>
    )

    expect(screen.getByText('Acme')).toBeInTheDocument()
    expect(screen.getByText('Globex')).toBeInTheDocument()
  })

  it('forwards extra props to the underlying ul', () => {
    render(
      <PromptList data-testid="prompt-list">
        <PromptItem>One</PromptItem>
      </PromptList>
    )

    expect(screen.getByTestId('prompt-list')).toBeInTheDocument()
  })

  describe('Tier 2 reveal (Phase 6)', () => {
    it('marks the ul with data-reveal-state and starts in "ready" (settled)', () => {
      render(
        <PromptList aria-label="Skills">
          <PromptItem>React</PromptItem>
          <PromptItem>TypeScript</PromptItem>
        </PromptList>
      )

      const list = screen.getByRole('list', { name: 'Skills' })
      expect(list).toHaveAttribute('data-reveal-state', 'ready')
    })

    it('flips to "hidden" then "visible" via the IntersectionObserver lifecycle', () => {
      render(
        <PromptList aria-label="Skills">
          <PromptItem>React</PromptItem>
          <PromptItem>TypeScript</PromptItem>
        </PromptList>
      )
      const list = screen.getByRole('list', { name: 'Skills' })
      const observer = MockIntersectionObserver.instances[0]

      act(() => {
        observer.trigger(false)
      })
      expect(list).toHaveAttribute('data-reveal-state', 'hidden')

      act(() => {
        observer.trigger(true)
      })
      expect(list).toHaveAttribute('data-reveal-state', 'visible')
    })

    it('injects --stagger-index per item so CSS can space the slide-ins', () => {
      render(
        <PromptList aria-label="Skills">
          <PromptItem data-testid="item-0">React</PromptItem>
          <PromptItem data-testid="item-1">TypeScript</PromptItem>
          <PromptItem data-testid="item-2">Next.js</PromptItem>
        </PromptList>
      )

      expect(screen.getByTestId('item-0').getAttribute('style')).toContain(
        '--stagger-index: 0'
      )
      expect(screen.getByTestId('item-1').getAttribute('style')).toContain(
        '--stagger-index: 1'
      )
      expect(screen.getByTestId('item-2').getAttribute('style')).toContain(
        '--stagger-index: 2'
      )
    })
  })
})
