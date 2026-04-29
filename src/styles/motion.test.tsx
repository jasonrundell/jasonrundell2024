import React from 'react'
import { act, render, screen } from '@testing-library/react'

jest.mock('@pigment-css/react', () => {
  const actual = jest.requireActual('@pigment-css/react')
  return {
    ...actual,
    keyframes: jest.fn(() => 'mocked-keyframes'),
  }
})

type IOEntry = Pick<IntersectionObserverEntry, 'isIntersecting'>

class MockIntersectionObserver {
  static instances: MockIntersectionObserver[] = []

  callback: IntersectionObserverCallback
  options: IntersectionObserverInit | undefined
  observed: Element[] = []
  disconnected = false

  constructor(
    callback: IntersectionObserverCallback,
    options?: IntersectionObserverInit
  ) {
    this.callback = callback
    this.options = options
    MockIntersectionObserver.instances.push(this)
  }

  observe(target: Element) {
    this.observed.push(target)
  }

  unobserve() {}

  disconnect() {
    this.disconnected = true
  }

  takeRecords(): IntersectionObserverEntry[] {
    return []
  }

  trigger(entries: IOEntry[]) {
    this.callback(
      entries as unknown as IntersectionObserverEntry[],
      this as unknown as IntersectionObserver
    )
  }
}

const installMockIO = () => {
  MockIntersectionObserver.instances = []
  ;(
    globalThis as unknown as {
      IntersectionObserver: typeof MockIntersectionObserver
    }
  ).IntersectionObserver = MockIntersectionObserver
}

const removeIO = () => {
  delete (
    globalThis as unknown as {
      IntersectionObserver?: typeof MockIntersectionObserver
    }
  ).IntersectionObserver
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

import {
  Reveal,
  RevealStaggerGroup,
  RevealStaggerItem,
  REVEAL_FADE_DURATION_MS,
  REVEAL_STAGGER_INTERVAL_MS,
  REVEAL_TYPE_DURATION_MS,
  REVEAL_SLIDE_DURATION_MS,
  useReveal,
} from './motion'

describe('motion module — Tier 2 scroll reveals', () => {
  beforeEach(() => {
    setReducedMotion(false)
    installMockIO()
  })

  afterEach(() => {
    removeIO()
    jest.clearAllMocks()
  })

  describe('locked timing constants', () => {
    it('exports the design-locked stagger interval (50 ms)', () => {
      expect(REVEAL_STAGGER_INTERVAL_MS).toBe(50)
    })

    it('exports plausible Tier 2 keyframe durations', () => {
      expect(REVEAL_FADE_DURATION_MS).toBeGreaterThan(0)
      expect(REVEAL_TYPE_DURATION_MS).toBeGreaterThan(0)
      expect(REVEAL_SLIDE_DURATION_MS).toBeGreaterThan(0)
    })
  })

  describe('Reveal — single-element fade-up', () => {
    it('renders settled (data-reveal-state="ready") on first paint', () => {
      const { container } = render(
        <Reveal>
          <p>Hello</p>
        </Reveal>
      )

      const wrapper = container.firstElementChild as HTMLElement
      expect(wrapper).toHaveAttribute('data-reveal-state', 'ready')
      expect(screen.getByText('Hello')).toBeInTheDocument()
    })

    it('flips to "hidden" on the first IO callback when offscreen, then "visible" on intersection', () => {
      const { container } = render(
        <Reveal>
          <p>Card</p>
        </Reveal>
      )
      const observer = MockIntersectionObserver.instances[0]
      expect(observer).toBeDefined()

      act(() => {
        observer.trigger([{ isIntersecting: false }])
      })
      const wrapper = container.firstElementChild as HTMLElement
      expect(wrapper).toHaveAttribute('data-reveal-state', 'hidden')

      act(() => {
        observer.trigger([{ isIntersecting: true }])
      })
      expect(wrapper).toHaveAttribute('data-reveal-state', 'visible')
      expect(observer.disconnected).toBe(true)
    })

    it('stays "ready" when the element is already in the viewport at mount (no flash)', () => {
      const { container } = render(
        <Reveal>
          <p>Card</p>
        </Reveal>
      )
      const observer = MockIntersectionObserver.instances[0]

      act(() => {
        observer.trigger([{ isIntersecting: true }])
      })

      const wrapper = container.firstElementChild as HTMLElement
      expect(wrapper).toHaveAttribute('data-reveal-state', 'ready')
      expect(observer.disconnected).toBe(true)
    })

    it('does NOT attach an IntersectionObserver when prefers-reduced-motion is set', () => {
      setReducedMotion(true)
      const { container } = render(
        <Reveal>
          <p>Quiet</p>
        </Reveal>
      )

      expect(MockIntersectionObserver.instances).toHaveLength(0)

      const wrapper = container.firstElementChild as HTMLElement
      expect(wrapper).toHaveAttribute('data-reveal-state', 'ready')
    })

    it('forwards optional --reveal-delay via inline style when delayMs is provided', () => {
      const { container } = render(
        <Reveal delayMs={120}>
          <p>Card</p>
        </Reveal>
      )

      const wrapper = container.firstElementChild as HTMLElement
      expect(wrapper.getAttribute('style') ?? '').toContain('120ms')
    })

    it('falls back to "ready" gracefully when IntersectionObserver is unavailable', () => {
      removeIO()
      const { container } = render(
        <Reveal>
          <p>Legacy</p>
        </Reveal>
      )

      const wrapper = container.firstElementChild as HTMLElement
      expect(wrapper).toHaveAttribute('data-reveal-state', 'ready')
    })
  })

  describe('RevealStaggerGroup + RevealStaggerItem — staggered cards', () => {
    it('shares a single IntersectionObserver across the group', () => {
      render(
        <RevealStaggerGroup>
          <RevealStaggerItem index={0}>
            <p>One</p>
          </RevealStaggerItem>
          <RevealStaggerItem index={1}>
            <p>Two</p>
          </RevealStaggerItem>
          <RevealStaggerItem index={2}>
            <p>Three</p>
          </RevealStaggerItem>
        </RevealStaggerGroup>
      )

      expect(MockIntersectionObserver.instances).toHaveLength(1)
    })

    it('writes --stagger-index to each item so CSS can space the fade-ups', () => {
      const { container } = render(
        <RevealStaggerGroup>
          <RevealStaggerItem index={0} data-testid="i0">
            <p>One</p>
          </RevealStaggerItem>
          <RevealStaggerItem index={1} data-testid="i1">
            <p>Two</p>
          </RevealStaggerItem>
          <RevealStaggerItem index={2} data-testid="i2">
            <p>Three</p>
          </RevealStaggerItem>
        </RevealStaggerGroup>
      )

      expect(screen.getByTestId('i0').getAttribute('style')).toContain(
        '--stagger-index: 0'
      )
      expect(screen.getByTestId('i1').getAttribute('style')).toContain(
        '--stagger-index: 1'
      )
      expect(screen.getByTestId('i2').getAttribute('style')).toContain(
        '--stagger-index: 2'
      )
      expect(container).toBeTruthy()
    })

    it('propagates state from group to items: ready → hidden → visible', () => {
      render(
        <RevealStaggerGroup data-testid="group">
          <RevealStaggerItem index={0} data-testid="i0">
            <p>One</p>
          </RevealStaggerItem>
          <RevealStaggerItem index={1} data-testid="i1">
            <p>Two</p>
          </RevealStaggerItem>
        </RevealStaggerGroup>
      )

      expect(screen.getByTestId('group')).toHaveAttribute(
        'data-reveal-state',
        'ready'
      )
      expect(screen.getByTestId('i0')).toHaveAttribute(
        'data-reveal-state',
        'ready'
      )

      const observer = MockIntersectionObserver.instances[0]
      act(() => {
        observer.trigger([{ isIntersecting: false }])
      })

      expect(screen.getByTestId('group')).toHaveAttribute(
        'data-reveal-state',
        'hidden'
      )
      expect(screen.getByTestId('i0')).toHaveAttribute(
        'data-reveal-state',
        'hidden'
      )
      expect(screen.getByTestId('i1')).toHaveAttribute(
        'data-reveal-state',
        'hidden'
      )

      act(() => {
        observer.trigger([{ isIntersecting: true }])
      })

      expect(screen.getByTestId('group')).toHaveAttribute(
        'data-reveal-state',
        'visible'
      )
      expect(screen.getByTestId('i0')).toHaveAttribute(
        'data-reveal-state',
        'visible'
      )
      expect(screen.getByTestId('i1')).toHaveAttribute(
        'data-reveal-state',
        'visible'
      )
    })

    it('a RevealStaggerItem rendered without a group falls back to "ready" (visible)', () => {
      render(
        <RevealStaggerItem index={0} data-testid="orphan">
          <p>Orphan</p>
        </RevealStaggerItem>
      )

      expect(screen.getByTestId('orphan')).toHaveAttribute(
        'data-reveal-state',
        'ready'
      )
    })
  })

  describe('useReveal — direct hook consumers', () => {
    function Probe() {
      const [ref, state] = useReveal<HTMLDivElement>()
      return (
        <div ref={ref} data-testid="probe" data-reveal-state={state} />
      )
    }

    it('exposes the same ready → hidden → visible lifecycle to ad-hoc consumers', () => {
      render(<Probe />)
      expect(screen.getByTestId('probe')).toHaveAttribute(
        'data-reveal-state',
        'ready'
      )

      const observer = MockIntersectionObserver.instances[0]
      act(() => {
        observer.trigger([{ isIntersecting: false }])
      })
      expect(screen.getByTestId('probe')).toHaveAttribute(
        'data-reveal-state',
        'hidden'
      )

      act(() => {
        observer.trigger([{ isIntersecting: true }])
      })
      expect(screen.getByTestId('probe')).toHaveAttribute(
        'data-reveal-state',
        'visible'
      )
    })

    it('disconnects the observer on unmount', () => {
      const { unmount } = render(<Probe />)
      const observer = MockIntersectionObserver.instances[0]

      unmount()

      expect(observer.disconnected).toBe(true)
    })
  })
})
