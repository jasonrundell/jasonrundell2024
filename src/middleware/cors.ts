import { NextRequest, NextResponse } from 'next/server'
import { ALLOWED_ORIGINS } from '@/lib/constants'

function getAllowedOrigin(request: NextRequest): string | null {
  const origin = request.headers.get('origin')
  return origin && ALLOWED_ORIGINS.includes(origin) ? origin : null
}

function setCorsHeaders(
  response: NextResponse,
  allowedOrigin: string
): NextResponse {
  response.headers.set('Access-Control-Allow-Origin', allowedOrigin)
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  response.headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization'
  )
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  return response
}

export function handlePreflight(request: NextRequest): NextResponse | null {
  if (request.method !== 'OPTIONS') return null

  const allowedOrigin = getAllowedOrigin(request)
  const response = new NextResponse(null, { status: 204 })
  if (allowedOrigin) {
    setCorsHeaders(response, allowedOrigin)
  }
  return response
}

export function applyCorsHeaders(
  request: NextRequest,
  response: NextResponse
): NextResponse {
  const allowedOrigin = getAllowedOrigin(request)
  if (allowedOrigin) {
    setCorsHeaders(response, allowedOrigin)
  }
  return response
}
