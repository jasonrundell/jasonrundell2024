'use client'

import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import type { Comment } from '@/typeDefinitions/app'
import {
  CommentCard,
  CommentHeader,
  CommentAuthor,
  CommentDate,
  CommentBody,
  CommentActions,
  ActionButton,
  DeleteButton,
  EditTextarea,
  SubmitRow,
  SubmitCommentButton,
  ErrorText,
  ConfirmDialog,
} from './styles'

const MAX_BODY_LENGTH = 2000

interface CommentItemProps {
  comment: Comment
  currentUserId: string | null
  isAdmin: boolean
  onUpdated: (comment: Comment) => void
  onDeleted: (commentId: string) => void
}

export default function CommentItem({
  comment,
  currentUserId,
  isAdmin,
  onUpdated,
  onDeleted,
}: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editBody, setEditBody] = useState(comment.body)
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isOwner = currentUserId === comment.user_id
  const canDelete = isOwner || isAdmin

  const handleSaveEdit = async () => {
    const trimmed = editBody.trim()
    if (!trimmed || trimmed.length > MAX_BODY_LENGTH || isSubmitting) return

    setIsSubmitting(true)
    setError(null)

    try {
      const res = await fetch(`/api/comments/${comment.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: trimmed }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to update comment')
      }

      const { comment: updated } = await res.json()
      onUpdated(updated)
      setIsEditing(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    setIsSubmitting(true)
    setError(null)

    try {
      const res = await fetch(`/api/comments/${comment.id}`, {
        method: 'DELETE',
      })

      if (!res.ok && res.status !== 204) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to delete comment')
      }

      onDeleted(comment.id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setIsConfirmingDelete(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const timeAgo = formatDistanceToNow(new Date(comment.created_at), {
    addSuffix: true,
  })

  return (
    <CommentCard>
      <CommentHeader>
        <CommentAuthor href={`/u/${comment.profile_slug}`}>
          {comment.display_name}
        </CommentAuthor>
        <CommentDate>{timeAgo}</CommentDate>
      </CommentHeader>

      {isEditing ? (
        <>
          <EditTextarea
            value={editBody}
            onChange={(e) => setEditBody(e.target.value)}
            maxLength={MAX_BODY_LENGTH}
            disabled={isSubmitting}
          />
          {error && <ErrorText>{error}</ErrorText>}
          <SubmitRow>
            <ActionButton
              type="button"
              onClick={() => {
                setIsEditing(false)
                setEditBody(comment.body)
                setError(null)
              }}
              disabled={isSubmitting}
            >
              Cancel
            </ActionButton>
            <SubmitCommentButton
              type="button"
              onClick={handleSaveEdit}
              disabled={
                !editBody.trim() ||
                editBody.trim().length > MAX_BODY_LENGTH ||
                isSubmitting
              }
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </SubmitCommentButton>
          </SubmitRow>
        </>
      ) : (
        <>
          <CommentBody>{comment.body}</CommentBody>

          {(isOwner || canDelete) && (
            <CommentActions>
              {isOwner && (
                <ActionButton
                  type="button"
                  onClick={() => {
                    setIsEditing(true)
                    setEditBody(comment.body)
                  }}
                >
                  Edit
                </ActionButton>
              )}

              {canDelete && !isConfirmingDelete && (
                <DeleteButton
                  type="button"
                  onClick={() => setIsConfirmingDelete(true)}
                >
                  Delete
                </DeleteButton>
              )}

              {isConfirmingDelete && (
                <ConfirmDialog>
                  <span>Delete this comment?</span>
                  <DeleteButton
                    type="button"
                    onClick={handleDelete}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Deleting...' : 'Yes'}
                  </DeleteButton>
                  <ActionButton
                    type="button"
                    onClick={() => setIsConfirmingDelete(false)}
                    disabled={isSubmitting}
                  >
                    No
                  </ActionButton>
                </ConfirmDialog>
              )}
            </CommentActions>
          )}

          {error && <ErrorText>{error}</ErrorText>}
        </>
      )}
    </CommentCard>
  )
}
