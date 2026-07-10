export const SITE_NAME =
  'Jason Rundell — Engineering leader & player-coach'
export const SITE_DESCRIPTION =
  'Jason Rundell is an engineering leader with 25+ years in full-stack web development — joining at inflection points to build the systems, culture, and standards that let teams scale.'
export const SITE_DOMAIN = 'https://jasonrundell.com'
export const HOME_OG_IMAGE_URL = `${SITE_DOMAIN}/images/ai-powered-developer.webp`

export interface CacheDurations {
  CLIENT_CACHE: number
  MAX_CACHE_AGE: number
  SESSION_TIMEOUT: number
  CLEANUP_INTERVAL: number
}

export const CACHE_DURATIONS: CacheDurations = {
  CLIENT_CACHE: 30_000,
  MAX_CACHE_AGE: 5 * 60 * 1000,
  SESSION_TIMEOUT: 3_000,
  CLEANUP_INTERVAL: 60_000,
}

/** TTL for the Supabase status health-check cache (in ms). */
export const SUPABASE_STATUS_TTL_MS = CACHE_DURATIONS.CLIENT_CACHE

const siteDomain = new URL(SITE_DOMAIN)

export const ALLOWED_ORIGINS: string[] =
  process.env.NODE_ENV === 'development'
    ? [
        SITE_DOMAIN,
        `https://www.${siteDomain.hostname}`,
        'http://localhost:3000',
      ]
    : [SITE_DOMAIN, `https://www.${siteDomain.hostname}`]
