'use client'

import { useState, useEffect } from 'react'
import { LastSong as LastSongType } from '@/typeDefinitions/app'
import LastSong from './LastSong'
import LastSongSkeleton from './LastSongSkeleton'

export default function LastSongWrapper() {
  const [song, setSong] = useState<LastSongType | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function fetchLastSong() {
      try {
        const response = await fetch('/api/last-song')
        if (!response.ok) {
          throw new Error('Failed to fetch last song')
        }
        const data = await response.json()
        if (isMounted && data && data.title && data.artist && data.url) {
          setSong(data as LastSongType)
        }
      } catch (err) {
        console.error('Error fetching last song:', err)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchLastSong()

    return () => {
      isMounted = false
    }
  }, [])

  if (isLoading) {
    return <LastSongSkeleton />
  }

  if (!song) {
    return null
  }

  return <LastSong song={song} />
}
