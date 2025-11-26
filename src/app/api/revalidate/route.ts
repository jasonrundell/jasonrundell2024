import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

/**
 * Webhook handler for Contentful to trigger incremental revalidation in Vercel.
 *
 * This endpoint receives webhook events from Contentful when content is published,
 * unpublished, or deleted. It then revalidates only the affected pages.
 *
 * Security: Validates webhook secret to ensure requests are from Contentful.
 */
export async function POST(request: NextRequest) {
  try {
    // Verify webhook secret
    const authHeader = request.headers.get('authorization')
    const expectedSecret = process.env.CONTENTFUL_WEBHOOK_SECRET

    if (!expectedSecret) {
      console.error('CONTENTFUL_WEBHOOK_SECRET is not configured')
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      )
    }

    if (authHeader !== `Bearer ${expectedSecret}`) {
      console.error('Invalid webhook secret')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse webhook payload
    const body = await request.json()

    // Contentful webhook payload can be the entry directly or wrapped
    // Handle both structures: direct entry or { sys, fields } format
    const entry = body.sys ? body : body.entry || body

    if (!entry || !entry.sys) {
      console.error('Invalid webhook payload: missing entry or sys object')
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const { sys, fields } = entry
    const contentType = sys.contentType?.sys?.id
    const entryId = sys.id
    const eventType = sys.type // 'Entry', 'Asset', etc.

    // Only process Entry events (content changes)
    if (eventType !== 'Entry') {
      console.log(`Skipping non-Entry event: ${eventType}`)
      return NextResponse.json({ message: 'Event ignored', eventType })
    }

    if (!contentType) {
      console.error('Invalid webhook payload: missing contentType')
      return NextResponse.json(
        { error: 'Invalid payload: missing contentType' },
        { status: 400 }
      )
    }

    // Get slug from fields if available
    // Handle both single locale and multi-locale formats
    const slug = fields?.slug?.['en-US'] || fields?.slug?.['en'] || fields?.slug

    console.log(
      `Processing webhook: contentType=${contentType}, entryId=${entryId}, slug=${slug}`
    )

    // Revalidate paths based on content type
    const revalidatedPaths: string[] = []

    switch (contentType) {
      case 'post': {
        // Revalidate the specific post page
        if (slug) {
          revalidatePath(`/posts/${slug}`)
          revalidatedPaths.push(`/posts/${slug}`)
        }
        // Always revalidate home page since it lists posts
        revalidatePath('/')
        revalidatedPaths.push('/')
        break
      }

      case 'project': {
        // Revalidate the specific project page
        if (slug) {
          revalidatePath(`/projects/${slug}`)
          revalidatedPaths.push(`/projects/${slug}`)
        }
        // Always revalidate home page since it lists projects
        revalidatePath('/')
        revalidatedPaths.push('/')
        break
      }

      case 'skill':
      case 'reference':
      case 'position':
      case 'lastSong': {
        // These content types are displayed on the home page
        revalidatePath('/')
        revalidatedPaths.push('/')
        break
      }

      default: {
        console.log(
          `Unknown content type: ${contentType}, revalidating home page`
        )
        // For unknown content types, revalidate home page as a safe default
        revalidatePath('/')
        revalidatedPaths.push('/')
      }
    }

    return NextResponse.json({
      revalidated: true,
      paths: revalidatedPaths,
      contentType,
      entryId,
      slug: slug || null,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
