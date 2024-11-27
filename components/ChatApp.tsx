import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { selectCharacter } from '../redux/characterSlice'
import CharacterSelection from './CharacterSelection'
import ChatInterface from './ChatInterface'
import { Character } from '../types/Character'

const ChatApp = () => {
  const dispatch = useDispatch()
  const character = useSelector((state) => state.character)

  const handleCharacterSelect = (character: Character) => {
    dispatch(selectCharacter(character))
  }

  return (
    <div>
      {character ? (
        <ChatInterface />
      ) : (
        <CharacterSelection onSelectCharacter={handleCharacterSelect} />
      )}
    </div>
  )
}

export default ChatApp
