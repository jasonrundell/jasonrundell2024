import { useSelector, useDispatch } from 'react-redux'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import styled from '@emotion/styled'
import { resetCharacter } from '../redux/characterSlice'
import CharacterSelection from './CharacterSelection'

const ChatInterface = () => {
  const dispatch = useDispatch()
  const character = useSelector((state) => state.character)
  const [messages, setMessages] = useState([])
  const [userInput, setUserInput] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (character) {
      // Fetch the initial greeting from the server
      const fetchInitialGreeting = async () => {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ character, messages: [] }),
        })
        const { reply } = await response.json()
        setMessages([{ sender: 'character', text: reply }])
      }

      fetchInitialGreeting()
    }
  }, [character])

  const handleSendMessage = async () => {
    if (userInput.trim() === '') return

    const newMessage = { sender: 'user', text: userInput }
    const updatedMessages = [...messages, newMessage]

    setMessages(updatedMessages)
    setLoading(true)

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ character, messages: updatedMessages }),
    })
    const { reply } = await response.json()

    setMessages((prev) => [...prev, { sender: 'character', text: reply }])
    setUserInput('')
    setLoading(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage()
    }
  }

  const handleEndConversation = () => {
    // Reset the character state
    dispatch(resetCharacter())
  }

  if (!character) {
    return <CharacterSelection />
  }

  return (
    <ChatContainer>
      <h1>You are chatting with {character?.name}</h1>
      <div>
        <img
          src={character?.image}
          alt={character?.name}
          width="150"
          height="150"
        />
      </div>
      <MessagesContainer>
        {messages.map((msg, idx) => (
          <Message key={idx} sender={msg.sender}>
            {msg.text}
          </Message>
        ))}
        {loading && <Ellipsis />}
      </MessagesContainer>
      <InputContainer>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage}>Send</button>
        <button onClick={handleEndConversation}>End Conversation</button>
      </InputContainer>
    </ChatContainer>
  )
}

const ChatContainer = styled.div`
  background-color: #232f3e;
  color: #ffffff;
  padding: 20px;
  border-radius: 8px;
`

const MessagesContainer = styled.div`
  margin-bottom: 20px;
`

const Message = styled.p<{ sender: string }>`
  color: ${(props) => (props.sender === 'user' ? '#ffffff' : '#00ffcc')};
`

const Ellipsis = styled.div`
  display: inline-block;
  width: 80px;
  height: 80px;
  &:after {
    content: '...';
    font-size: 24px;
    animation: ellipsis 1.5s infinite;
  }
  @keyframes ellipsis {
    0% {
      content: '.';
    }
    33% {
      content: '..';
    }
    66% {
      content: '...';
    }
    100% {
      content: '.';
    }
  }
`

const InputContainer = styled.div`
  display: flex;
  gap: 10px;

  input {
    flex: 1;
    padding: 10px;
    border-radius: 4px;
    border: 1px solid #ccc;
  }

  button {
    padding: 10px 20px;
    border-radius: 4px;
    border: none;
    background-color: #00ffcc;
    color: #232f3e;
    cursor: pointer;

    &:hover {
      background-color: #00e6b8;
    }
  }
`

export default ChatInterface
