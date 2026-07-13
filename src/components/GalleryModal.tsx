'use client'

import { createPortal } from 'react-dom'
import { useEffect, useRef, useCallback } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { styled } from '@pigment-css/react'
import Tokens from '@/lib/tokens'
import { ContentImage } from '@/typeDefinitions/app'
import ContentImageComponent from './ContentImage'
import {
  StyledModal,
  StyledModalContent,
  StyledCloseButton,
} from '@/styles/common'

const imageContainStyle: React.CSSProperties = { objectFit: 'contain' }

const StyledNavButton = styled('button')`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: ${Tokens.colors.white.value}36;
  border: none;
  color: ${Tokens.colors.rolePrompt.var};
  cursor: pointer;
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 0.2s ease-in-out;
  z-index: ${Tokens.zIndex.modalContent.value};

  &:hover {
    background: ${Tokens.colors.primaryVariant.value}E6;
  }

  &:focus-visible {
    outline: 2px solid ${Tokens.colors.primary.value}99;
    outline-offset: 2px;
  }

  &:disabled {
    opacity: ${Tokens.opacity.low.value};
    cursor: not-allowed;
  }
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

const StyledImageInfo = styled('div')`
  position: absolute;
  bottom: ${Tokens.sizes.small.value}${Tokens.sizes.small.unit};
  left: 50%;
  transform: translateX(-50%);
  background: ${Tokens.colors.surface.value}b3;
  color: ${Tokens.colors.rolePrompt.var};
  padding: ${Tokens.sizes.padding.xsmall.value}${Tokens.sizes.padding.xsmall.unit} ${Tokens.sizes.spacing.large.value}${Tokens.sizes.spacing.large.unit};
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
  opacity: ${Tokens.opacity.higher.value};
`

const StyledImageCounter = styled('div')`
  font-size: 0.75rem;
  opacity: ${Tokens.opacity.medium.value};
  margin-top: ${Tokens.sizes.small.value}${Tokens.sizes.small.unit};
`

interface GalleryModalProps {
  selectedIndex: number
  totalImages: number
  image: ContentImage
  onClose: () => void
  onPrev: (e: React.MouseEvent) => void
  onNext: (e: React.MouseEvent) => void
}

export default function GalleryModal({
  selectedIndex,
  totalImages,
  image,
  onClose,
  onPrev,
  onNext,
}: GalleryModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  const trapFocus = useCallback((e: KeyboardEvent) => {
    if (e.key !== 'Tab' || !dialogRef.current) return
    const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
    )
    if (focusable.length === 0) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }, [])

  useEffect(() => {
    previousFocusRef.current = document.activeElement as HTMLElement
    closeButtonRef.current?.focus()
    document.addEventListener('keydown', trapFocus)
    return () => {
      document.removeEventListener('keydown', trapFocus)
      previousFocusRef.current?.focus()
    }
  }, [trapFocus])

  return createPortal(
    <StyledModal
      onClick={onClose}
      aria-label="Image gallery modal"
      role="dialog"
      aria-modal="true"
    >
      <StyledModalContent ref={dialogRef} onClick={(e) => e.stopPropagation()}>
        <StyledCloseButton ref={closeButtonRef} onClick={onClose} aria-label="Close image gallery">
          <X size={24} />
        </StyledCloseButton>

        {selectedIndex > 0 && (
          <StyledNavButton
            onClick={onPrev}
            aria-label="Previous image"
            style={{ left: `${Tokens.sizes.small.value}${Tokens.sizes.small.unit}` }}
          >
            <ChevronLeft size={24} />
          </StyledNavButton>
        )}

        {selectedIndex < totalImages - 1 && (
          <StyledNavButton
            onClick={onNext}
            aria-label="Next image"
            style={{ right: `${Tokens.sizes.small.value}${Tokens.sizes.small.unit}` }}
          >
            <ChevronRight size={24} />
          </StyledNavButton>
        )}

        <StyledModalImage>
          <ContentImageComponent
            src={image.src}
            alt={
              image.description ||
              image.alt ||
              `Gallery image ${selectedIndex + 1}`
            }
            fill={true}
            quality={90}
            sizes="90vw"
            style={imageContainStyle}
          />
        </StyledModalImage>

        {(image.alt || image.description) && (
          <StyledImageInfo>
            {image.alt && <StyledImageTitle>{image.alt}</StyledImageTitle>}
            {image.description && (
              <StyledImageDescription>{image.description}</StyledImageDescription>
            )}
            <StyledImageCounter>
              {selectedIndex + 1} of {totalImages}
            </StyledImageCounter>
          </StyledImageInfo>
        )}
      </StyledModalContent>
    </StyledModal>,
    document.body
  )
}
