/**
 * Component: Character
 * Description: Display a character that consists of 1 image, 1 name, 1 shortBio, and 4 quotes.
 */

import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Image from 'next/image'
import styled from '@emotion/styled'
import { Heading } from '@jasonrundell/dropship'

import { tokens } from '../data/tokens'

const StyledContainer = styled.div`
  display: block;
  width: 20rem;
  flex-direction: column;
  border: 2px solid ${tokens['--primary-color']};
  padding: ${tokens['--size-xlarge']};
  margin: ${tokens['--size-xlarge']} 0;
`
// background-color: ${tokens['--background-color-2']};
// padding: 1rem;
// border: 2px solid ${tokens['--primary-color']};
// position: fixed;
// width: 10rem;
// top: 1;
// right: 0;
// z-index: 100;

const StyledQuote = styled.div`
  font-family: Courier, monospace;
  position: relative;
  display: block;
`

const Character = ({ character }) => {
  // Custom loader function for the Image component with relative URL
  const myLoader = ({ src, width, quality }) => {
    return `${src}?w=${width}&q=${quality || 75}`
  }

  const [quote, setQuote] = useState('')
  const [randomQuote, setRandomQuote] = useState('')
  const [index, setIndex] = useState(0)

  // pick a random quote from the character's quotes array
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * character.quotes.length)
    setRandomQuote(character.quotes[randomIndex])
  }, [character.quotes])

  // animate the quote by slowly typing out each letter
  useEffect(() => {
    if (index < randomQuote.length) {
      const interval = setInterval(() => {
        setQuote((prev) => prev + randomQuote[index])
        setIndex((prev) => prev + 1)
      }, 75)
      return () => clearInterval(interval)
    }
  }, [index, randomQuote])

  return (
    <StyledContainer>
      <Heading level={3} label={character.name} classNames="font-bold" />
      <Image
        loader={myLoader}
        src={character.image}
        alt={character.name || ''}
        width={250}
        height={250}
      />
      <StyledQuote>{quote}</StyledQuote>
    </StyledContainer>
  )
}

Character.propTypes = {
  character: PropTypes.shape({
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    visualDescription: PropTypes.string.isRequired,
    shortBio: PropTypes.string.isRequired,
    quotes: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
}

export default Character
