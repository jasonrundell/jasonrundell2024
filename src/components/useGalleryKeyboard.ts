import { useEffect } from 'react'

interface UseGalleryKeyboardOptions {
  selectedIndex: number | null
  totalImages: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

export function useGalleryKeyboard({
  selectedIndex,
  totalImages,
  onClose,
  onPrev,
  onNext,
}: UseGalleryKeyboardOptions): void {
  useEffect(() => {
    if (selectedIndex === null) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowLeft' && selectedIndex > 0) {
        onPrev()
      } else if (e.key === 'ArrowRight' && selectedIndex < totalImages - 1) {
        onNext()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [selectedIndex, totalImages, onClose, onPrev, onNext])
}
