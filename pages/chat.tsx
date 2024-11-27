import { useSelector } from 'react-redux'
import { useState } from 'react'
import ChatApp from '../components/ChatApp'

const ChatInterface = () => {
  const character = useSelector((state) => state.character)
  const [messages, setMessages] = useState([])
  const [userInput, setUserInput] = useState('')

  const handleSendMessage = async () => {
    setMessages((prev) => [...prev, { sender: 'user', text: userInput }])

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ character, message: userInput }),
    })
    const { reply } = await response.json()

    setMessages((prev) => [...prev, { sender: 'character', text: reply }])
    setUserInput('')
  }

  return (
    <div>
      <ChatApp />
    </div>
  )
}

export default ChatInterface
