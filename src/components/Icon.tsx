import Image from 'next/image'
import styled from '@emotion/styled'

import LinkedIn from '../public/images/linkedin-mark-white.png'
import GitHub from '../public/images/github-mark-white.svg'
import Email from '../public/images/email-mark-white.png'
import Calendar from '../public/images/calendar-mark-white.png'

export interface IconProps {
  type: 'LinkedIn' | 'GitHub' | 'Email' | 'Calendar'
}

const iconMap = {
  LinkedIn: {
    src: LinkedIn,
    alt: 'LinkedIn',
  },
  GitHub: {
    src: GitHub,
    alt: 'GitHub',
  },
  Email: {
    src: Email,
    alt: 'Email',
  },
  Calendar: {
    src: Calendar,
    alt: 'Calendar',
  },
}

const Icon = ({ type }: IconProps) => {
  const { src, alt } = iconMap[type] || {}
  const StyledIcon = styled(Image)`
    width: 1.75rem;
    height: 1.75rem;
    display: inline;
    margin-right: 0.5rem;
  `

  if (!src) {
    return null // Return null if the type is not found in the iconMap
  }

  return <StyledIcon width={25} height={25} src={src} alt={alt} />
}

export default Icon
