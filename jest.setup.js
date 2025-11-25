// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Polyfill Node.js globals needed by Next.js edge runtime
if (typeof global.TextDecoder === 'undefined') {
  const { TextDecoder, TextEncoder } = require('util')
  global.TextDecoder = TextDecoder
  global.TextEncoder = TextEncoder
}

if (typeof global.setImmediate === 'undefined') {
  global.setImmediate = (fn, ...args) => setTimeout(fn, 0, ...args)
  global.clearImmediate = clearTimeout
}

// Polyfill Next.js Request/Response APIs for testing
// Use a simpler approach that doesn't require edge runtime
if (typeof global.Request === 'undefined') {
  // Use fetch API polyfill if available, otherwise create minimal mocks
  try {
    const { Request, Response, Headers } = require('next/dist/compiled/@edge-runtime/primitives')
    global.Request = Request
    global.Response = Response
    global.Headers = Headers
  } catch (e) {
    // Fallback: create minimal mocks
    global.Request = class Request {
      constructor(input, init) {
        this.url = typeof input === 'string' ? input : input.url
        this.method = init?.method || 'GET'
        this.headers = new Map()
        if (init?.headers) {
          Object.entries(init.headers).forEach(([k, v]) => this.headers.set(k, v))
        }
      }
    }
    global.Response = class Response {
      constructor(body, init) {
        this.body = body
        this.status = init?.status || 200
        this.headers = new Map()
        if (init?.headers) {
          Object.entries(init.headers).forEach(([k, v]) => this.headers.set(k, v))
        }
      }
      json() {
        return Promise.resolve(JSON.parse(this.body))
      }
    }
    global.Headers = class Headers {
      constructor(init) {
        this.map = new Map()
        if (init) {
          Object.entries(init).forEach(([k, v]) => this.map.set(k, v))
        }
      }
      get(name) {
        return this.map.get(name)
      }
      set(name, value) {
        this.map.set(name, value)
      }
    }
  }
}

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
const originalWarn = console.warn
global.console = {
  ...console,
  error: jest.fn((...args) => {
    // Filter out the jsdom "Not implemented: HTMLFormElement.prototype.requestSubmit" errors
    // These are harmless warnings from jsdom not supporting this feature
    const firstArg = args[0]
    const errorMessage = firstArg?.message || firstArg?.toString() || ''
    
    if (
      errorMessage.includes('Not implemented: HTMLFormElement.prototype.requestSubmit') ||
      errorMessage.includes('HTMLFormElement.prototype.requestSubmit') ||
      errorMessage.includes('Sign in error:') || // Suppress expected sign-in test errors
      errorMessage.includes('Invalid value for prop `formAction`') || // Suppress Next.js server action warnings
      errorMessage.includes('Invalid value for prop `action`') || // Suppress Next.js server action warnings
      errorMessage.includes('Either remove it from the element, or pass a string or number value') // Suppress Next.js server action warnings
    ) {
      return // Suppress these specific errors
    }
    // Call original error for everything else
    originalError(...args)
  }),
  warn: jest.fn((...args) => {
    // Suppress React warnings about invalid form props (formAction, action)
    // Next.js server actions pass functions as these props, which is expected behavior
    const firstArg = args[0]
    const warningMessage = typeof firstArg === 'string' ? firstArg : firstArg?.toString() || ''
    
    if (
      warningMessage.includes('Invalid value for prop `formAction`') ||
      warningMessage.includes('Invalid value for prop `action`') ||
      warningMessage.includes('Either remove it from the element, or pass a string or number value')
    ) {
      return // Suppress these expected Next.js server action warnings
    }
    // Call original warn for everything else
    originalWarn(...args)
  }),
  log: jest.fn(),
}
