import Image from 'next/image'
import styled from '@emotion/styled'

import LinkedIn from '../public/images/linkedin-mark-white.png'
import GitHub from '../public/images/github-mark-white.svg'

const StyledIcon = styled(Image)`
  width: 25px;
  height: 25px;
  display: inline;
`

const Icon = ({ type }) => {
  const isLinkedIn = type === 'LinkedIn'
  const ImgSrc = isLinkedIn ? LinkedIn : GitHub
  const altText = isLinkedIn ? 'LinkedIn' : 'GitHub'

  return <StyledIcon width={25} height={25} src={ImgSrc} alt={altText} />
}

export default Icon
