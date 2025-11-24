// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Polyfill for HTMLFormElement.prototype.requestSubmit
// jsdom has this method but throws "not implemented" errors
// Override it to properly dispatch submit events in tests
HTMLFormElement.prototype.requestSubmit = function (submitter) {
  if (submitter) {
    if (!this.contains(submitter)) {
      throw new DOMException(
        "Failed to execute 'requestSubmit' on 'HTMLFormElement': The specified element is not a submit button.",
      )
    }
    if (submitter.type !== 'submit') {
      throw new DOMException(
        "Failed to execute 'requestSubmit' on 'HTMLFormElement': The specified element is not a submit button.",
      )
    }
  }
  // Trigger submit event
  const submitEvent = new Event('submit', {
    bubbles: true,
    cancelable: true,
  })
  this.dispatchEvent(submitEvent)
}

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  })),
  useSearchParams: jest.fn(() => new URLSearchParams()),
  usePathname: jest.fn(() => '/'),
}))

// Mock browser APIs
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

global.window.matchMedia = jest.fn().mockImplementation(query => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
}))

// Mock console methods to reduce noise in tests
const originalError = console.error
global.console = {
  ...console,
  error: jest.fn((...args) => {
    // Filter out the jsdom "Not implemented: HTMLFormElement.prototype.requestSubmit" errors
    // These are harmless warnings from jsdom not supporting this feature
    const firstArg = args[0]
    const errorMessage = firstArg?.message || firstArg?.toString() || ''
    
    if (
      errorMessage.includes('Not implemented: HTMLFormElement.prototype.requestSubmit') ||
      errorMessage.includes('HTMLFormElement.prototype.requestSubmit')
    ) {
      return // Suppress this specific error
    }
    // Call original error for everything else
    originalError(...args)
  }),
  warn: jest.fn(),
  log: jest.fn(),
}
