'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Grid } from '@jasonrundell/dropship'
import { GalleryImage } from '@/typeDefinitions/app'
import ContentfulImage from './ContentfulImage'
import { styled } from '@pigment-css/react'
import Tokens from '@/lib/tokens'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

// Image style constants
const imageCoverNoPointerStyle: React.CSSProperties = {
  objectFit: 'cover',
  pointerEvents: 'none',
}

const imageContainStyle: React.CSSProperties = {
  objectFit: 'contain',
}

const StyledGalleryItem = styled('div')`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: ${Tokens.borderRadius.medium.value}${Tokens.borderRadius.medium.unit};
  background-color: ${Tokens.colors.backgroundDarker.value};
  cursor: pointer;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.02);
  }

  img {
    object-fit: cover;
    object-position: center;
  }
`

const StyledModal = styled('div')`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`

const StyledModalContent = styled('div')`
  position: relative;
  width: 100%;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
`

const StyledModalImage = styled('div')`
  position: relative;
  width: 100%;
  height: 80vh;
  max-width: 100%;
  max-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    max-width: 100%;
    max-height: 90vh;
    object-fit: contain;
    border-radius: ${Tokens.borderRadius.medium.value}${Tokens.borderRadius.medium.unit};
  }
`

const StyledCloseButton = styled('button')`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.7);
  border: none;
  color: ${Tokens.colors.primary.value};
  cursor: pointer;
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 0.2s ease-in-out;
  z-index: 10000;

  &:hover {
    background: rgba(0, 0, 0, 0.9);
  }

  &:focus-visible {
    outline: 2px solid ${Tokens.colors.primary.value}99;
    outline-offset: 2px;
  }
`

const StyledNavButtonLeft = styled('button')`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.7);
  border: none;
  color: ${Tokens.colors.primary.value};
  cursor: pointer;
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 0.2s ease-in-out;
  z-index: 10000;

  &:hover {
    background: rgba(0, 0, 0, 0.9);
  }

  &:focus-visible {
    outline: 2px solid ${Tokens.colors.primary.value}99;
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`

const StyledNavButtonRight = styled('button')`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.7);
  border: none;
  color: ${Tokens.colors.primary.value};
  cursor: pointer;
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 0.2s ease-in-out;
  z-index: 10000;

  &:hover {
    background: rgba(0, 0, 0, 0.9);
  }

  &:focus-visible {
    outline: 2px solid ${Tokens.colors.primary.value}99;
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`

const StyledImageInfo = styled('div')`
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  color: ${Tokens.colors.primary.value};
  padding: 0.75rem 1.5rem;
  border-radius: ${Tokens.borderRadius.medium.value}${Tokens.borderRadius.medium.unit};
  text-align: center;
  max-width: 80%;
`

const StyledImageTitle = styled('div')`
  font-weight: 600;
  margin-bottom: ${Tokens.sizes.xsmall.value}${Tokens.sizes.xsmall.unit};
`

const StyledImageDescription = styled('div')`
  font-size: ${Tokens.sizes.fonts.small.value}${Tokens.sizes.fonts.small.unit};
  opacity: 0.9;
`

const StyledImageCounter = styled('div')`
  font-size: 0.75rem;
  opacity: 0.7;
  margin-top: ${Tokens.sizes.small.value}${Tokens.sizes.small.unit};
`

interface ProjectGalleryProps {
  images: GalleryImage[]
}

export default function ProjectGallery({ images }: ProjectGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)

  // Filter out images without URLs
  const validImages = (images || []).filter((image) => image?.fields?.file?.url)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (selectedIndex === null) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedIndex(null)
      } else if (e.key === 'ArrowLeft' && selectedIndex > 0) {
        setSelectedIndex(selectedIndex - 1)
      } else if (
        e.key === 'ArrowRight' &&
        selectedIndex < validImages.length - 1
      ) {
        setSelectedIndex(selectedIndex + 1)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [selectedIndex, validImages.length])

  const handleImageClick = (index: number) => {
    setSelectedIndex(index)
  }

  const handleClose = () => {
    setSelectedIndex(null)
  }

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1)
    }
  }

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (selectedIndex !== null && selectedIndex < validImages.length - 1) {
      setSelectedIndex(selectedIndex + 1)
    }
  }

  if (!images || validImages.length === 0) {
    return null
  }

  const selectedImage =
    selectedIndex !== null ? validImages[selectedIndex] : null
  const imageUrl = selectedImage?.fields?.file?.url
  const modalImageUrl = imageUrl
    ? imageUrl.startsWith('//')
      ? `https:${imageUrl}`
      : imageUrl
    : null

  return (
    <>
      <Grid
        gridTemplateColumns="1fr"
        mediumTemplateColumns="1fr 1fr"
        largeTemplateColumns="1fr 1fr 1fr"
        columnGap="1.5rem"
        rowGap="1.5rem"
      >
        {validImages.map((image, index) => {
          const imageUrl = image.fields.file.url
          const url = imageUrl.startsWith('//') ? `https:${imageUrl}` : imageUrl

          return (
            <StyledGalleryItem
              key={image.sys.id || index}
              onClick={() => handleImageClick(index)}
              role="button"
              tabIndex={0}
              aria-label={`View ${
                image.fields.title || `Gallery image ${index + 1}`
              } in full screen`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleImageClick(index)
                }
              }}
            >
              <ContentfulImage
                src={url}
                alt={
                  image.fields.description ||
                  image.fields.title ||
                  `Gallery image ${index + 1}`
                }
                fill={true}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={imageCoverNoPointerStyle}
              />
            </StyledGalleryItem>
          )
        })}
      </Grid>

      {mounted &&
        selectedIndex !== null &&
        modalImageUrl &&
        createPortal(
          <StyledModal
            onClick={handleClose}
            aria-label="Image gallery modal"
            role="dialog"
            aria-modal="true"
          >
            <StyledModalContent onClick={(e) => e.stopPropagation()}>
              <StyledCloseButton
                onClick={handleClose}
                aria-label="Close image gallery"
              >
                <X size={24} />
              </StyledCloseButton>

              {selectedIndex > 0 && (
                <StyledNavButtonLeft
                  onClick={handlePrev}
                  aria-label="Previous image"
                >
                  <ChevronLeft size={24} />
                </StyledNavButtonLeft>
              )}

              {selectedIndex < validImages.length - 1 && (
                <StyledNavButtonRight
                  onClick={handleNext}
                  aria-label="Next image"
                >
                  <ChevronRight size={24} />
                </StyledNavButtonRight>
              )}

              {selectedImage && (
                <>
                  <StyledModalImage>
                    <ContentfulImage
                      src={modalImageUrl || ''}
                      alt={
                        selectedImage.fields.description ||
                        selectedImage.fields.title ||
                        `Gallery image ${selectedIndex + 1}`
                      }
                      fill={true}
                      quality={90}
                      sizes="90vw"
                      style={imageContainStyle}
                    />
                  </StyledModalImage>

                  {(selectedImage.fields.title ||
                    selectedImage.fields.description) && (
                    <StyledImageInfo>
                      {selectedImage.fields.title && (
                        <StyledImageTitle>
                          {selectedImage.fields.title}
                        </StyledImageTitle>
                      )}
                      {selectedImage.fields.description && (
                        <StyledImageDescription>
                          {selectedImage.fields.description}
                        </StyledImageDescription>
                      )}
                      <StyledImageCounter>
                        {selectedIndex + 1} of {validImages.length}
                      </StyledImageCounter>
                    </StyledImageInfo>
                  )}
                </>
              )}
            </StyledModalContent>
          </StyledModal>,
          document.body
        )}
    </>
  )
}
