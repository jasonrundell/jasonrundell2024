'use client'

import { useEffect, useState } from 'react'
import { Heading } from '@jasonrundell/dropship'
import { styled } from '@pigment-css/react'
import Link from 'next/link'

interface HeadingAnimationProps {
  steps: string[]
  speed: number
}

const StyledHeading = styled(Heading)`
  font-size: 1.5rem !important;
  font-weight: 400;
`

const HeadingAnimation = ({ steps, speed }: HeadingAnimationProps) => {
  const [currentStep, setCurrentStep] = useState(0)

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
      <Link href="/" className="decoration--none">
        {steps[currentStep]}
      </Link>
    </StyledHeading>
  )
}

export default HeadingAnimation
