import { act, fireEvent, render, screen } from '@testing-library/react'

jest.mock('@pigment-css/react', () => {
  const actual = jest.requireActual('@pigment-css/react')
  return {
    ...actual,
    keyframes: jest.fn(() => 'mocked-keyframes'),
  }
})

import HeroTerminal, {
  HERO_TERMINAL_SKIP_KEY,
  type HeroConstField,
} from './HeroTerminal'

const fields: ReadonlyArray<HeroConstField> = [
  { key: 'name', value: 'Jason Rundell' },
  { key: 'role', value: 'Manager / Full Stack Developer' },
]

const baseProps = {
  fields,
  heading: 'Manager / Full Stack Developer',
  pitch: 'AI-first ADM and Senior Full Stack Web Developer with 20+ years.',
}

const setReducedMotion = (matches: boolean) => {
  ;(window.matchMedia as jest.Mock).mockImplementation((query: string) => ({
    matches:
      matches && query.includes('prefers-reduced-motion') ? true : false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }))
}

describe('HeroTerminal', () => {
  beforeEach(() => {
    window.sessionStorage.clear()
    setReducedMotion(false)
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('static DOM (always present, regardless of animation phase)', () => {
    it('renders a single canonical sr-only h1 with the heading prop', () => {
      setReducedMotion(true) // suppress animation for a quiet render
      render(<HeroTerminal {...baseProps} />)

      const headings = screen.getAllByRole('heading', { level: 1 })
      expect(headings).toHaveLength(1)
      expect(headings[0]).toHaveTextContent(baseProps.heading)
      expect(headings[0]).toHaveClass('sr-only')
    })

    it('renders the pitch as sr-only static text', () => {
      setReducedMotion(true)
      render(<HeroTerminal {...baseProps} />)

      const pitch = screen.getByText(baseProps.pitch)
      expect(pitch).toBeInTheDocument()
      expect(pitch).toHaveClass('sr-only')
    })

    it('marks the visual terminal `<pre>` as decorative (aria-hidden)', () => {
      setReducedMotion(true)
      const { container } = render(<HeroTerminal {...baseProps} />)

      const pre = container.querySelector('pre')
      expect(pre).toBeInTheDocument()
      expect(pre).toHaveAttribute('aria-hidden', 'true')
    })

    it('does not render the 3-doors hub navigation (now composed by the page)', () => {
      setReducedMotion(true)
      render(<HeroTerminal {...baseProps} />)

      expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
    })
  })

  describe('reduced-motion bypass', () => {
    it('renders fully settled (all chars + blinking cursor) when prefers-reduced-motion is set', () => {
      setReducedMotion(true)
      const { container } = render(<HeroTerminal {...baseProps} />)

      const pre = container.querySelector('pre')
      expect(pre?.textContent).toContain("'Jason Rundell'")
      expect(pre?.textContent).toContain("'Manager / Full Stack Developer'")

      const cursor = container.querySelector('[data-blink]')
      expect(cursor).toHaveAttribute('data-blink', 'true')
    })

    it('does NOT persist a skip flag when honouring prefers-reduced-motion', () => {
      setReducedMotion(true)
      render(<HeroTerminal {...baseProps} />)

      expect(window.sessionStorage.getItem(HERO_TERMINAL_SKIP_KEY)).toBeNull()
    })
  })

  describe('sessionStorage in-session skip flag', () => {
    it('renders fully settled when the skip flag is already set for this session', () => {
      window.sessionStorage.setItem(HERO_TERMINAL_SKIP_KEY, '1')

      const { container } = render(<HeroTerminal {...baseProps} />)

      const cursor = container.querySelector('[data-blink]')
      expect(cursor).toHaveAttribute('data-blink', 'true')

      const pre = container.querySelector('pre')
      expect(pre?.textContent).toContain("'Jason Rundell'")
    })
  })

  describe('typing animation', () => {
    it('starts typing from zero on mount, then completes with a blinking cursor', () => {
      jest.useFakeTimers()
      const { container } = render(
        <HeroTerminal {...baseProps} typeIntervalMs={10} />
      )

      const cursor = container.querySelector('[data-blink]')
      expect(cursor).toHaveAttribute('data-blink', 'false')

      act(() => {
        jest.advanceTimersByTime(5_000)
      })

      const pre = container.querySelector('pre')
      expect(pre?.textContent).toContain("'Jason Rundell'")
      expect(pre?.textContent).toContain("'Manager / Full Stack Developer'")

      const settledCursor = container.querySelector('[data-blink]')
      expect(settledCursor).toHaveAttribute('data-blink', 'true')
    })

    it('renders a partial mid-segment slice while typing is still in progress', () => {
      jest.useFakeTimers()
      const { container } = render(
        <HeroTerminal
          {...baseProps}
          comment="hero.tsx"
          typeIntervalMs={50}
        />
      )

      // Advance only enough for a handful of characters: should land
      // partway through the leading `// hero.tsx\n` comment segment.
      act(() => {
        jest.advanceTimersByTime(180)
      })

      const pre = container.querySelector('pre')
      const text = pre?.textContent ?? ''
      // Settled cursor glyph is always at the end; strip it before asserting
      // on typed-so-far content.
      const typed = text.replace(/\u25AE$/, '')
      expect(typed.length).toBeGreaterThan(0)
      expect(typed.length).toBeLessThan('// hero.tsx\n'.length)
      expect('// hero.tsx\n'.startsWith(typed)).toBe(true)
    })

    it('does NOT set the in-session skip flag when the animation completes naturally', () => {
      jest.useFakeTimers()
      render(<HeroTerminal {...baseProps} typeIntervalMs={10} />)

      act(() => {
        jest.advanceTimersByTime(5_000)
      })

      expect(window.sessionStorage.getItem(HERO_TERMINAL_SKIP_KEY)).toBeNull()
    })
  })

  describe('skip on user input', () => {
    it('cancels to settled state and persists the skip flag on keydown', () => {
      jest.useFakeTimers()
      const { container } = render(
        <HeroTerminal {...baseProps} typeIntervalMs={1000} />
      )

      expect(container.querySelector('[data-blink]')).toHaveAttribute(
        'data-blink',
        'false'
      )

      act(() => {
        fireEvent.keyDown(window, { key: 'Enter' })
      })

      expect(container.querySelector('[data-blink]')).toHaveAttribute(
        'data-blink',
        'true'
      )

      expect(window.sessionStorage.getItem(HERO_TERMINAL_SKIP_KEY)).toBe('1')
    })

    it('cancels to settled state on pointerdown', () => {
      jest.useFakeTimers()
      const { container } = render(
        <HeroTerminal {...baseProps} typeIntervalMs={1000} />
      )

      act(() => {
        fireEvent.pointerDown(window)
      })

      expect(container.querySelector('[data-blink]')).toHaveAttribute(
        'data-blink',
        'true'
      )
      expect(window.sessionStorage.getItem(HERO_TERMINAL_SKIP_KEY)).toBe('1')
    })
  })
})
