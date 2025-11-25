/**
 * Safe HTML sanitization utility for server and client environments.
 * Handles the isomorphic-dompurify/jsdom default-stylesheet.css issue.
 */

// Set environment variables before any imports
if (typeof process !== 'undefined') {
  // Prevent jsdom from trying to read default-stylesheet.css
  if (!process.env.JSDOM_CSS) {
    process.env.JSDOM_CSS = 'false'
  }
  if (!process.env.JSDOM_RESOURCE_LOADER) {
    process.env.JSDOM_RESOURCE_LOADER = 'false'
  }
}

let DOMPurify: typeof import('isomorphic-dompurify').default | null = null
let useFallback = false

// Initialize DOMPurify at module load time
// Using dynamic import to avoid ESLint require() error
void import('isomorphic-dompurify')
  .then((mod) => {
    DOMPurify = mod.default
  })
  .catch((error) => {
    console.warn(
      'Failed to load DOMPurify, using fallback sanitization:',
      error
    )
    useFallback = true
  })

/**
 * Safely sanitize HTML content.
 * Falls back to basic sanitization if DOMPurify fails to initialize.
 */
export function sanitizeHTML(html: string): string {
  // Use fallback if DOMPurify failed to initialize
  if (useFallback) {
    return basicSanitize(html)
  }

  try {
    // If DOMPurify is not loaded yet, use fallback
    // (This can happen on first call before async import completes)
    if (!DOMPurify) {
      return basicSanitize(html)
    }

    return DOMPurify.sanitize(html)
  } catch (error) {
    // If sanitization fails, use fallback
    console.warn('DOMPurify sanitization failed, using fallback:', error)
    useFallback = true
    return basicSanitize(html)
  }
}

/**
 * Basic HTML sanitization fallback.
 * Removes script tags and event handlers.
 */
function basicSanitize(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
}
