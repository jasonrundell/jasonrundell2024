// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Polyfill Node.js globals needed by Next.js edge runtime
if (typeof global.TextDecoder === 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
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
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Request, Response, Headers } = require('next/dist/compiled/@edge-runtime/primitives')
    global.Request = Request
    global.Response = Response
    global.Headers = Headers
  } catch {
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
// Completely replace it to prevent errors from being thrown
if (typeof HTMLFormElement !== 'undefined' && HTMLFormElement.prototype) {
  // Delete the existing method first to ensure we completely replace it
  try {
    delete HTMLFormElement.prototype.requestSubmit
  } catch {
    // Ignore if delete fails
  }
  
  // Define our own implementation that never throws "not implemented" errors
  Object.defineProperty(HTMLFormElement.prototype, 'requestSubmit', {
    value: function (submitter) {
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
    },
    writable: true,
    configurable: true,
  })
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
// Use jest.spyOn for better control over what gets logged
const originalError = console.error
const originalWarn = console.warn

// Create a custom error function that filters expected errors
const filteredError = (...args) => {
    // Filter out expected errors during tests
    const firstArg = args[0]
    const errorMessage = firstArg?.message || firstArg?.toString() || ''
    const errorStack = firstArg?.stack || ''
    
    // Build full message from all arguments
    const fullMessage = args.map(arg => {
      if (typeof arg === 'string') return arg
      if (arg?.message) return arg.message
      if (arg?.stack) return arg.stack
      if (arg?.toString) return arg.toString()
      return String(arg)
    }).join(' ')
    
    // Check if this is a Contentful error (expected during tests)
    const isContentfulError = 
      fullMessage.includes('Error fetching') && (
        fullMessage.includes('Contentful') ||
        fullMessage.includes('from Contentful') ||
        fullMessage.includes('Error fetching skills:') ||
        fullMessage.includes('Error fetching projects:') ||
        fullMessage.includes('Error fetching references:') ||
        fullMessage.includes('Error fetching positions:') ||
        fullMessage.includes('Error fetching posts:') ||
        fullMessage.includes('Error fetching entry') ||
        fullMessage.includes('Error fetching entry by slug:') ||
        fullMessage.includes('Error fetching last song:')
      )
    
    // Check if this is the HTMLFormElement.requestSubmit error
    // Check both message and stack trace, and also check if it's from jsdom
    // Also check the stack trace for jsdom-specific paths
    const isRequestSubmitError = 
      fullMessage.includes('Not implemented: HTMLFormElement.prototype.requestSubmit') ||
      fullMessage.includes('HTMLFormElement.prototype.requestSubmit') ||
      errorMessage.includes('Not implemented: HTMLFormElement.prototype.requestSubmit') ||
      errorMessage === 'Not implemented: HTMLFormElement.prototype.requestSubmit' ||
      errorMessage.includes('HTMLFormElement.prototype.requestSubmit') ||
      errorStack.includes('HTMLFormElement.prototype.requestSubmit') ||
      errorStack.includes('not-implemented.js') ||
      errorStack.includes('HTMLFormElement-impl.js') ||
      (firstArg instanceof Error && 
       (firstArg.message === 'Not implemented: HTMLFormElement.prototype.requestSubmit' ||
        firstArg.message.includes('HTMLFormElement.prototype.requestSubmit')))
    
    if (
      isRequestSubmitError ||
      errorMessage.includes('Sign in error:') || // Suppress expected sign-in test errors
      errorMessage.includes('Invalid value for prop `formAction`') || // Suppress Next.js server action warnings
      errorMessage.includes('Invalid value for prop `action`') || // Suppress Next.js server action warnings
      errorMessage.includes('Either remove it from the element, or pass a string or number value') || // Suppress Next.js server action warnings
      isContentfulError // Suppress expected Contentful error logs during tests
    ) {
      // Completely suppress - don't call original, don't log anything
      return
    }
    // Call original error for everything else
    originalError(...args)
}

// Replace console.error with our filtered version
global.console.error = filteredError

global.console = {
  ...console,
  error: filteredError,
  warn: jest.fn((...args) => {
    // Suppress React warnings about invalid form props (formAction, action)
    // Next.js server actions pass functions as these props, which is expected behavior
    const firstArg = args[0]
    const warningMessage = typeof firstArg === 'string' ? firstArg : firstArg?.toString() || ''
    const fullMessage = args.map(arg => 
      typeof arg === 'string' ? arg : arg?.toString() || ''
    ).join(' ')
    
    // Check if this is a Contentful warning (expected during tests)
    const isContentfulWarning = 
      fullMessage.includes('found in Contentful') ||
      warningMessage.includes('found in Contentful') ||
      (fullMessage.includes('No') && fullMessage.includes('Contentful'))
    
    if (
      warningMessage.includes('Invalid value for prop `formAction`') ||
      warningMessage.includes('Invalid value for prop `action`') ||
      warningMessage.includes('Either remove it from the element, or pass a string or number value') ||
      isContentfulWarning // Suppress expected Contentful warnings during tests
    ) {
      return // Suppress these expected warnings
    }
    // Call original warn for everything else
    originalWarn(...args)
  }),
  log: jest.fn(),
}
