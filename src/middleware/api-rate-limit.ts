import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'

const API_RATE_LIMIT = { maxAttempts: 30, windowMs: 60_000 }

export function applyApiRateLimit(request: NextRequest): NextResponse | null {
  const clientIp =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    '127.0.0.1'
  const { success } = rateLimit(`api:${clientIp}`, API_RATE_LIMIT)
  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429, headers: { 'Retry-After': '60' } }
    )
  }
  return null
}
