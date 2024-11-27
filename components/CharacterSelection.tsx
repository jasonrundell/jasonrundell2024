import React from 'react'
import { useDispatch } from 'react-redux'
import { characters } from '../redux/store'
import { selectCharacter } from '../redux/characterSlice'
import { useRouter } from 'next/router'
import { Character } from '../types/Character'
import { Grid } from '@jasonrundell/dropship'

const CharacterSelection = () => {
  const dispatch = useDispatch()
  const router = useRouter()

  const handleCharacterSelect = (character: Character) => {
    dispatch(selectCharacter(character))
    router.push('/chat')
  }

  return (
    <div>
      <h2>Select Your Character</h2>
      <Grid
        gridTemplateColumns="1fr"
        mediumTemplateColumns="1fr 1fr"
        largeTemplateColumns="1fr 1fr 1fr"
        columnGap="2rem"
        breakInside="avoid"
      >
        {characters.map((character: Character) => (
          <div
            key={character.id}
            onClick={() => handleCharacterSelect(character)}
            style={{ cursor: 'pointer' }}
          >
            <h3>{character.name}</h3>
            <div>
              <img
                src={character.image}
                alt={character.name}
                width="150"
                height="150"
              />
            </div>
            <p>{character.bio}</p>
          </div>
        ))}
      </Grid>
    </div>
  )
}

export default CharacterSelection
