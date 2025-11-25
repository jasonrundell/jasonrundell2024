/**
 * Configuration for isomorphic-dompurify to work in Next.js server environment.
 * This prevents jsdom from trying to read the default-stylesheet.css file.
 */

// Set environment variable before importing DOMPurify
if (typeof process !== 'undefined') {
  // Prevent jsdom from trying to read default-stylesheet.css
  process.env.JSDOM_CSS = 'false'
}

export {}

