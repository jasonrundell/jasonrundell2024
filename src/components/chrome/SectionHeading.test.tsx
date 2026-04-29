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

    const comment = container.querySelector('[data-section-comment]')
    expect(comment).toHaveTextContent('// experience.tsx')
    expect(comment).toHaveAttribute('aria-hidden', 'true')
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

  describe('Tier 2 reveal (Phase 6)', () => {
    it('renders in the settled "ready" state on first paint', () => {
      const { container } = render(
        <SectionHeading comment="skills.tsx">Skills</SectionHeading>
      )

      const wrapper = container.firstElementChild as HTMLElement
      expect(wrapper).toHaveAttribute('data-reveal-state', 'ready')
    })

    it('flips to "hidden" then "visible" when scrolled into view', () => {
      const { container } = render(
        <SectionHeading comment="skills.tsx">Skills</SectionHeading>
      )
      const observer = MockIntersectionObserver.instances[0]
      const wrapper = container.firstElementChild as HTMLElement

      act(() => {
        observer.trigger(false)
      })
      expect(wrapper).toHaveAttribute('data-reveal-state', 'hidden')

      act(() => {
        observer.trigger(true)
      })
      expect(wrapper).toHaveAttribute('data-reveal-state', 'visible')
    })

    it('keeps the heading and comment in the DOM regardless of reveal state', () => {
      const { container } = render(
        <SectionHeading comment="experience.tsx">Experience</SectionHeading>
      )
      const observer = MockIntersectionObserver.instances[0]

      act(() => {
        observer.trigger(false)
      })

      expect(
        screen.getByRole('heading', { name: 'Experience' })
      ).toBeInTheDocument()
      expect(
        container.querySelector('[data-section-comment]')
      ).toHaveTextContent('// experience.tsx')
    })
  })
})
