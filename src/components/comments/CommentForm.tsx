'use client'

import { useState } from 'react'
import type { Comment } from '@/typeDefinitions/app'
import {
  CommentFormWrapper,
  CommentTextarea,
  SubmitRow,
  CharCount,
  SubmitCommentButton,
  ErrorText,
} from './styles'

const MAX_BODY_LENGTH = 2000

interface CommentFormProps {
  contentType: 'post' | 'project'
  contentSlug: string
  onCommentCreated: (comment: Comment) => void
}

export default function CommentForm({
  contentType,
  contentSlug,
  onCommentCreated,
}: CommentFormProps) {
  const [body, setBody] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const trimmedBody = body.trim()
  const isValid = trimmedBody.length >= 1 && trimmedBody.length <= MAX_BODY_LENGTH

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid || isSubmitting) return

    setIsSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentType,
          slug: contentSlug,
          body: trimmedBody,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to post comment')
      }

      const { comment } = await res.json()
      onCommentCreated(comment)
      setBody('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <CommentFormWrapper onSubmit={handleSubmit}>
      <CommentTextarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Write a comment..."
        maxLength={MAX_BODY_LENGTH}
        disabled={isSubmitting}
      />
      {error && <ErrorText>{error}</ErrorText>}
      <SubmitRow>
        <CharCount>
          {trimmedBody.length} / {MAX_BODY_LENGTH}
        </CharCount>
        <SubmitCommentButton type="submit" disabled={!isValid || isSubmitting}>
          {isSubmitting ? 'Posting...' : 'Post Comment'}
        </SubmitCommentButton>
      </SubmitRow>
    </CommentFormWrapper>
  )
}
