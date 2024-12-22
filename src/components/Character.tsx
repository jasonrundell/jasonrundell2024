/**
 * Component: Character
 * Description: Display a character that consists of 1 image, 1 name, 1 shortBio, and 4 quotes.
 */
'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import styled from '@emotion/styled'
import { Heading } from '@jasonrundell/dropship'

import { tokens } from '@/data/tokens'
import { characters } from '@/data/characters'

// choose a random index from characters array
const randomIndex = Math.floor(Math.random() * characters.length)

const StyledContainer = styled.div`
  display: block;
  width: 20rem;
  flex-direction: column;
  border: 0.125rem solid ${tokens['--primary-color']};
  padding: ${tokens['--size-xlarge']};
  margin: ${tokens['--size-xlarge']} 0;
`

const StyledQuote = styled.div`
  font-family: Courier, monospace;
  position: relative;
  display: block;
`

interface CharacterProps {
  image: string
  name: string
  visualDescription: string
  shortBio: string
  quotes: string[]
}

const Character = () => {
  const [randomCharacter, setRandomCharacter] = useState<CharacterProps | null>(
    null
  )
  const [quote, setQuote] = useState('')
  const [randomQuote, setRandomQuote] = useState('')
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * characters.length)
    setRandomCharacter(characters[randomIndex])
  }, [])

  // pick a random quote from the character's quotes array
  useEffect(() => {
    if (randomCharacter) {
      const randomIndex = Math.floor(
        Math.random() * randomCharacter.quotes.length
      )
      setRandomQuote(randomCharacter.quotes[randomIndex])
    }
  }, [randomCharacter])

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

  // Custom loader function for the Image component with relative URL

  type LoaderProps = {
    src: string
    width: number
    quality?: number
  }

  const myLoader = ({ src, width, quality }: LoaderProps) => {
    return `${src}?w=${width}&q=${quality || 75}`
  }

  return (
    <StyledContainer>
      {randomCharacter && (
        <>
          <Heading level={3} label={randomCharacter.name} />
          <Image
            loader={myLoader}
            src={randomCharacter.image}
            alt={randomCharacter.name || ''}
            width={250}
            height={250}
          />
          <StyledQuote>{quote}</StyledQuote>
        </>
      )}
    </StyledContainer>
  )
}

export default Character
