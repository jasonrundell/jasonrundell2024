import { NextResponse } from 'next/server'
import { getLastSong } from '@/lib/contentful'

export async function GET() {
  try {
    const lastSong = await getLastSong()
    return NextResponse.json(lastSong, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    })
  } catch (error) {
    console.error('Error fetching last song:', error)
    return NextResponse.json(
      { error: 'Failed to fetch last song' },
      { status: 500 }
    )
  }
}

