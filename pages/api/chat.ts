import { NextApiRequest, NextApiResponse } from 'next'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { character, messages } = req.body

  console.log('Request body:', req.body) // Log the request body

  if (!character || !character.name || !character.bio || !character.visualDescription || !character.quotes) {
    console.error('Invalid character data:', character)
    return res.status(400).json({ error: 'Invalid character data' })
  }

  const characterBackground = `Name: ${character.name}. Bio: (${character.bio}). Visual Description: ${character.visualDescription}. Quotes: ${character.quotes.join(' ')}.`
  const prompt = `You are a chat program that assumes a character with the following background: ${characterBackground}. Generate a short greeting message based on this character.`

  const conversation = [
    { role: "system", content: prompt },
    ...messages.map((msg: any) => ({ role: msg.sender === 'user' ? 'user' : 'assistant', content: msg.text }))
  ]

  try {
    const openAiResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: conversation,
      max_tokens: 150,
    })

    console.log('Messages:', conversation)
    console.log('OpenAI response:', openAiResponse.choices[0].message.content)
    res.status(200).json({ reply: openAiResponse.choices[0].message.content.trim() })
  } catch (error) {
    console.error('Error generating response:', error)
    res.status(500).json({ error: 'Failed to generate response' })
  }
}