'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import type { Comment } from '@/typeDefinitions/app'
import CommentForm from './CommentForm'
import CommentItem from './CommentItem'
import CommentsSkeleton from './CommentsSkeleton'
import {
  CommentsContainer,
  CommentsHeading,
  CommentsList,
  SignInPrompt,
  EmptyState,
} from './styles'

interface CommentsSectionProps {
  contentType: 'post' | 'project'
  contentSlug: string
}

export default function CommentsSection({
  contentType,
  contentSlug,
}: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const loadComments = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/comments?contentType=${encodeURIComponent(contentType)}&slug=${encodeURIComponent(contentSlug)}`
      )
      if (res.ok) {
        const data = await res.json()
        return data.comments as Comment[]
      }
    } catch (err) {
      console.error('Failed to fetch comments:', err)
    }

    return []
  }, [contentType, contentSlug])

  useEffect(() => {
    const init = async () => {
      const supabase = createClient()
      const [authResult, fetchedComments] = await Promise.all([
        supabase.auth.getUser(),
        loadComments(),
      ])

      const {
        data: { user },
      } = authResult

      if (user) {
        setCurrentUserId(user.id)
        setIsAuthenticated(true)
        setIsAdmin(user.app_metadata?.role === 'admin')
      }

      setComments(fetchedComments)
      setIsLoading(false)
    }

    init()
  }, [loadComments])

  const handleCommentCreated = (comment: Comment) => {
    setComments((prev) => [comment, ...prev])
  }

  const handleCommentUpdated = (updated: Comment) => {
    setComments((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    )
  }

  const handleCommentDeleted = (commentId: string) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId))
  }

  if (isLoading) {
    return <CommentsSkeleton />
  }

  return (
    <CommentsContainer>
      <CommentsHeading>Comments</CommentsHeading>

      {isAuthenticated ? (
        <CommentForm
          contentType={contentType}
          contentSlug={contentSlug}
          onCommentCreated={handleCommentCreated}
        />
      ) : (
        <SignInPrompt>
          <Link href="/sign-in">Sign in</Link> to leave a comment.
        </SignInPrompt>
      )}

      {comments.length === 0 ? (
        <EmptyState>No comments yet. Be the first to comment!</EmptyState>
      ) : (
        <CommentsList>
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUserId={currentUserId}
              isAdmin={isAdmin}
              onUpdated={handleCommentUpdated}
              onDeleted={handleCommentDeleted}
            />
          ))}
        </CommentsList>
      )}
    </CommentsContainer>
  )
}
