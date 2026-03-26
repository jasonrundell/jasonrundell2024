'use client'

import {
  CommentsContainer,
  CommentsHeading,
  CommentsList,
  CommentCard,
  CommentHeader,
  CommentFormWrapper,
  SubmitRow,
} from './styles'
import {
  SkeletonAuthor,
  SkeletonDate,
  SkeletonBodyLine,
  SkeletonBodyLineShort,
  SkeletonTextarea,
  SkeletonButton,
} from './skeleton-styles'

const SKELETON_COUNT = 3

function SkeletonCommentCard() {
  return (
    <CommentCard aria-hidden="true">
      <CommentHeader>
        <SkeletonAuthor />
        <SkeletonDate />
      </CommentHeader>
      <SkeletonBodyLine style={{ marginBottom: '0.375rem' }} />
      <SkeletonBodyLineShort />
    </CommentCard>
  )
}

export default function CommentsSkeleton() {
  return (
    <CommentsContainer role="status" aria-label="Loading comments">
      <CommentsHeading>Comments</CommentsHeading>

      <CommentFormWrapper as="div">
        <SkeletonTextarea aria-hidden="true" />
        <SubmitRow>
          <span />
          <SkeletonButton aria-hidden="true" />
        </SubmitRow>
      </CommentFormWrapper>

      <CommentsList>
        {Array.from({ length: SKELETON_COUNT }, (_, i) => (
          <SkeletonCommentCard key={i} />
        ))}
      </CommentsList>
    </CommentsContainer>
  )
}
