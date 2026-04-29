'use client'

import { useEffect, useState } from 'react'
import { Heading } from '@jasonrundell/dropship'
import { styled } from '@pigment-css/react'
import Link from 'next/link'

interface HeadingAnimationProps {
  steps: string[]
  speed: number
  /**
   * Stable accessible name announced to assistive tech. Defaults to the
   * first step which represents the resting/canonical title (e.g. "Jason
   * Rundell"). The animated visual text is hidden from the a11y tree so
   * screen readers see one stable label, never the typewriter flicker.
   */
  ariaLabel?: string
}

const StyledHeading = styled(Heading)`
  font-size: 1.5rem !important;
  font-weight: 400;
`

const HeadingAnimation = ({
  steps,
  speed,
  ariaLabel,
}: HeadingAnimationProps) => {
  const [currentStep, setCurrentStep] = useState(0)
  const accessibleName = ariaLabel ?? steps[0]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prevStep) => {
        if (prevStep + 1 === steps.length) {
          clearInterval(interval)
          return prevStep
        }
        return prevStep + 1
      })
    }, speed)
    return () => clearInterval(interval)
  }, [steps.length, speed])

  return (
    <StyledHeading level={1}>
      <Link
        href="/"
        className="decoration--none primary-color"
        aria-label={accessibleName}
      >
        <span aria-hidden="true">{steps[currentStep]}</span>
      </Link>
    </StyledHeading>
  )
}

export default HeadingAnimation
