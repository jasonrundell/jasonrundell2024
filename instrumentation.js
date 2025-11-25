import * as Sentry from '@sentry/nextjs';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Configure jsdom to skip default-stylesheet.css BEFORE any modules load
    // This must be set before isomorphic-dompurify/jsdom is imported
    process.env.JSDOM_CSS = 'false';
    process.env.JSDOM_RESOURCE_LOADER = 'false';
    
    await import('./sentry.server.config');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config');
  }
}

export const onRequestError = Sentry.captureRequestError;
