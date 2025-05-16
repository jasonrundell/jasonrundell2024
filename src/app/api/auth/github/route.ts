import { NextResponse } from 'next/server'
import { redirect } from 'next/navigation'

export async function GET() {
  const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID
  const redirectUri = `${process.env.NEXT_PUBLIC_URL}/api/auth/callback/github`

  if (!clientId) {
    console.error('Missing GitHub Client ID')
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 }
    )
  }

  if (!process.env.NEXT_PUBLIC_URL) {
    console.error('Missing NEXT_PUBLIC_URL environment variable')
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 }
    )
  }

  // Create the authorization URL
  const authUrl = new URL('https://github.com/login/oauth/authorize')
  authUrl.searchParams.append('client_id', clientId)
  authUrl.searchParams.append('redirect_uri', redirectUri)
  authUrl.searchParams.append('scope', 'user:email')
  
  // Return a JSON response with the auth URL for the client to handle the redirect
  return NextResponse.json({ url: authUrl.toString() })
}

// Handle OPTIONS method for CORS preflight
export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 })
  response.headers.set('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_URL || '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  return response
}
