'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { Play, ExternalLink, Music } from 'lucide-react'
import { styled } from '@pigment-css/react'
import { LastSong as LastSongType } from '@/typeDefinitions/app'
import Tokens from '@/lib/tokens'

export interface LastSongProps {
  song: LastSongType
}

const StyledSection = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const StyledSongInfo = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const StyledTitle = styled('h3')`
  margin: 0;
  font-size: ${Tokens.sizes.fonts.large.value}${Tokens.sizes.fonts.large.unit};
  color: ${Tokens.colors.secondary.value};
`

const StyledArtist = styled('p')`
  margin: 0;
  font-size: ${Tokens.sizes.fonts.medium.value}${Tokens.sizes.fonts.medium.unit};
  color: ${Tokens.colors.secondary.value};
`

const StyledActions = styled('div')`
  display: flex;
  gap: 1rem;
  align-items: center;
`

const StyledPlayButton = styled('button')`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${Tokens.colors.primary.value};
  color: ${Tokens.colors.background.value};
  border: none;
  border-radius: 0.3125rem;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.15s;
  text-decoration: none;

  &:hover {
    background: ${Tokens.colors.primary.value}CC;
  }

  &:focus-visible {
    outline: 2px solid ${Tokens.colors.primary.value}99;
    outline-offset: 2px;
  }
`

const StyledLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: ${Tokens.colors.primary.value};
  text-decoration: none;
  transition: color 0.15s;

  &:hover {
    color: ${Tokens.colors.primaryVariant.value};
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid ${Tokens.colors.primary.value}99;
    outline-offset: 2px;
    border-radius: 0.25rem;
  }
`

const StyledModal = styled('div')`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`

const StyledModalContent = styled('div')`
  position: relative;
  width: 100%;
  max-width: 800px;
  background: ${Tokens.colors.background.value};
  border-radius: 0.5rem;
  padding: 1rem;
`

const StyledCloseButton = styled('button')`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: transparent;
  border: none;
  color: ${Tokens.colors.secondary.value};
  cursor: pointer;
  font-size: 1.5rem;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.25rem;

  &:hover {
    background: ${Tokens.colors.backgroundDark.value};
  }

  &:focus-visible {
    outline: 2px solid ${Tokens.colors.primary.value}99;
    outline-offset: 2px;
  }
`

const StyledIframe = styled('iframe')`
  width: 100%;
  aspect-ratio: 16 / 9;
  border: none;
  border-radius: 0.25rem;
`

/**
 * Extracts YouTube video ID from various YouTube URL formats
 */
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|music\.youtube\.com\/watch\?v=)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }

  return null
}

/**
 * Component that displays the last song listened to with play and link functionality
 */
export default function LastSong({ song }: LastSongProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const videoId = song.youtubeId || extractYouTubeId(song.url)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!isModalOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isModalOpen])

  const handlePlay = () => {
    if (videoId) {
      setIsModalOpen(true)
    } else {
      // If no video ID, open the URL directly
      window.open(song.url, '_blank', 'noopener noreferrer')
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const embedUrl = videoId
    ? `https://www.youtube.com/embed/${videoId}?autoplay=1`
    : null

  return (
    <>
      <StyledSection>
        <StyledSongInfo>
          <StyledTitle>
            <Music
              size={20}
              style={{ display: 'inline', marginRight: '0.5rem' }}
            />
            Listening to:
          </StyledTitle>
          <StyledArtist>
            {song.title} by {song.artist}
          </StyledArtist>
        </StyledSongInfo>
        <StyledActions>
          <StyledPlayButton onClick={handlePlay} aria-label="Play song">
            <Play size={18} />
            Play
          </StyledPlayButton>
          <StyledLink
            href={song.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${song.title} by ${song.artist} on YouTube Music`}
          >
            <ExternalLink size={18} />
            Open on YouTube Music
          </StyledLink>
        </StyledActions>
      </StyledSection>

      {mounted &&
        embedUrl &&
        isModalOpen &&
        createPortal(
          <StyledModal
            onClick={handleCloseModal}
            aria-label="Video player modal"
            role="dialog"
            aria-modal="true"
          >
            <StyledModalContent onClick={(e) => e.stopPropagation()}>
              <StyledCloseButton
                onClick={handleCloseModal}
                aria-label="Close video player"
              >
                ×
              </StyledCloseButton>
              <StyledIframe
                src={embedUrl}
                title={`${song.title} by ${song.artist}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </StyledModalContent>
          </StyledModal>,
          document.body
        )}
    </>
  )
}
