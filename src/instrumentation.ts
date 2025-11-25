/**
 * Next.js instrumentation hook.
 * This runs before any modules are loaded, allowing us to configure
 * the environment for isomorphic-dompurify/jsdom.
 */

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Configure jsdom to skip default-stylesheet.css
    // This must be set before any modules that use jsdom are imported
    process.env.JSDOM_CSS = 'false'
    process.env.JSDOM_RESOURCE_LOADER = 'false'

    // Also set NODE_OPTIONS to prevent jsdom from trying to load the stylesheet
    if (!process.env.NODE_OPTIONS) {
      process.env.NODE_OPTIONS = '--no-warnings'
    }
  }
}
