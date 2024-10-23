/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useEffect, useState } from 'react'

const backToTopStyle = css`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background-color: #e9be62;
  color: #000;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  display: none;
  &:hover {
    background-color: #eee;
  }
`

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false)

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility)
    return () => {
      window.removeEventListener('scroll', toggleVisibility)
    }
  }, [])

  return (
    <div
      css={css`
        ${backToTopStyle};
        display: ${isVisible ? 'block' : 'none'};
      `}
      onClick={scrollToTop}
    >
      Back to top
    </div>
  )
}

export default BackToTop
