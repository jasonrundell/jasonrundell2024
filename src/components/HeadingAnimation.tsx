'use client'

import { useEffect, useState } from 'react'
import { styled } from '@pigment-css/react'
import Link from 'next/link'
import Tokens from '@/lib/tokens'

interface MonoStepMatcher {
  /** Steps starting with any of these strings render in monospace. */
  prefixes?: readonly string[]
  /** Steps exactly matching any of these strings render in monospace. */
  exact?: readonly string[]
}

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
  /**
   * Serializable matcher for steps that should render in monospace.
   * Evaluated client-side to avoid passing functions across the RSC boundary.
   */
  monoStepMatcher?: MonoStepMatcher
}

const StyledBrand = styled('span')`
  display: inline-block;
  font-size: 1.5rem !important;
  font-weight: 400;
`

const StyledMonoText = styled('span')`
  font-family: ${Tokens.fonts.monospace.family};
`

function matchesMono(step: string, matcher?: MonoStepMatcher): boolean {
  if (!matcher) return false
  if (matcher.exact?.includes(step)) return true
  if (matcher.prefixes?.some((p) => step.startsWith(p))) return true
  return false
}

const HeadingAnimation = ({
  steps,
  speed,
  ariaLabel,
  monoStepMatcher,
}: HeadingAnimationProps) => {
  const [currentStep, setCurrentStep] = useState(0)
  const accessibleName = ariaLabel ?? steps[0]
  const currentText = steps[currentStep]
  const useMono = matchesMono(currentText, monoStepMatcher)

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
    <StyledBrand>
      <Link
        href="/"
        className="decoration--none primary-color"
        aria-label={accessibleName}
      >
        <span aria-hidden="true">
          {useMono ? (
            <StyledMonoText>{currentText}</StyledMonoText>
          ) : (
            currentText
          )}
        </span>
      </Link>
    </StyledBrand>
  )
}

export default HeadingAnimation
