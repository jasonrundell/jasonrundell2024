'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export interface HeadingAnimationProps {
  steps: string[]
  speed: number
}

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
    <h1>
      <Link href="/" className="decoration--none">
        {steps[currentStep]}
      </Link>
    </h1>
  )
}

export default HeadingAnimation
