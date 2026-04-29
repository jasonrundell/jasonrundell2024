import { styled } from '@pigment-css/react'
import Link from 'next/link'
import Tokens from '@/lib/tokens'

export const CommentsContainer = styled('div')`
  margin-top: ${Tokens.sizes.xlarge.value}${Tokens.sizes.xlarge.unit};
  border-top: 1px solid ${Tokens.colors.primary.value}30;
  padding-top: ${Tokens.sizes.xlarge.value}${Tokens.sizes.xlarge.unit};
`

export const CommentsHeading = styled('h3')`
  font-size: ${Tokens.sizes.fonts.large.value}${Tokens.sizes.fonts.large.unit};
  font-weight: 700;
  color: ${Tokens.colors.roleHeading.var};
  margin: 0 0 ${Tokens.sizes.large.value}${Tokens.sizes.large.unit} 0;
`

export const CommentsList = styled('div')`
  display: flex;
  flex-direction: column;
  gap: ${Tokens.sizes.large.value}${Tokens.sizes.large.unit};
`

export const CommentCard = styled('div')`
  background: ${Tokens.colors.surfaceDeepest.var};
  border-radius: ${Tokens.borderRadius.medium.value}${Tokens.borderRadius.medium.unit};
  padding: ${Tokens.sizes.padding.medium.value}${Tokens.sizes.padding.medium.unit};
  border: 1px solid ${Tokens.colors.primary.value}15;
`

export const CommentHeader = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${Tokens.sizes.spacing.xsmall.value}${Tokens.sizes.spacing.xsmall.unit};
`

export const CommentAuthor = styled(Link)`
  color: ${Tokens.colors.rolePrompt.var};
  text-decoration: none;
  font-weight: 600;
  font-size: ${Tokens.fontSizes.sm.value}${Tokens.fontSizes.sm.unit};
  transition: color 0.15s;

  &:hover {
    text-decoration: underline;
  }
`

export const CommentDate = styled('span')`
  font-size: ${Tokens.fontSizes.sm.value}${Tokens.fontSizes.sm.unit};
  color: ${Tokens.colors.textSecondary.var};
`

export const CommentBody = styled('p')`
  color: ${Tokens.colors.roleBody.var};
  margin: 0;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
`

export const CommentActions = styled('div')`
  display: flex;
  gap: ${Tokens.sizes.spacing.xsmall.value}${Tokens.sizes.spacing.xsmall.unit};
  margin-top: ${Tokens.sizes.spacing.xsmall.value}${Tokens.sizes.spacing.xsmall.unit};
`

export const ActionButton = styled('button')`
  background: none;
  border: none;
  color: ${Tokens.colors.textSecondary.var};
  cursor: pointer;
  font-size: ${Tokens.fontSizes.sm.value}${Tokens.fontSizes.sm.unit};
  padding: 0.25rem 0.5rem;
  border-radius: ${Tokens.borderRadius.xsmall.value}${Tokens.borderRadius.xsmall.unit};
  transition: color 0.15s, background 0.15s;

  &:hover {
    color: ${Tokens.colors.rolePrompt.var};
    background: ${Tokens.colors.primary.value}15;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

export const DeleteButton = styled(ActionButton)`
  &:hover {
    color: ${Tokens.colors.roleDanger.var};
    background: ${Tokens.colors.error.value}15;
  }
`

export const CommentFormWrapper = styled('form')`
  display: flex;
  flex-direction: column;
  gap: ${Tokens.sizes.spacing.small.value}${Tokens.sizes.spacing.small.unit};
  margin-bottom: ${Tokens.sizes.xlarge.value}${Tokens.sizes.xlarge.unit};
`

export const CommentTextarea = styled('textarea')`
  width: 100%;
  min-height: 100px;
  padding: ${Tokens.sizes.padding.small.value}${Tokens.sizes.padding.small.unit};
  background: ${Tokens.colors.surfaceDeepest.var};
  border: 1px solid ${Tokens.colors.primary.value}30;
  border-radius: ${Tokens.borderRadius.medium.value}${Tokens.borderRadius.medium.unit};
  color: ${Tokens.colors.roleBody.var};
  font-family: ${Tokens.fonts.body.family};
  font-size: ${Tokens.fontSizes.base.value}${Tokens.fontSizes.base.unit};
  resize: vertical;
  transition: border-color 0.15s;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${Tokens.colors.rolePrompt.var};
  }

  &::placeholder {
    color: ${Tokens.colors.textSecondary.var};
  }
`

export const SubmitRow = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const CharCount = styled('span')`
  font-size: ${Tokens.fontSizes.sm.value}${Tokens.fontSizes.sm.unit};
  color: ${Tokens.colors.textSecondary.var};
`

export const SubmitCommentButton = styled('button')`
  padding: ${Tokens.sizes.padding.small.value}${Tokens.sizes.padding.small.unit} ${Tokens.sizes.padding.large.value}${Tokens.sizes.padding.large.unit};
  background: ${Tokens.colors.rolePrompt.var};
  color: ${Tokens.colors.surfaceDeepest.var};
  border: none;
  border-radius: ${Tokens.borderRadius.xsmall.value}${Tokens.borderRadius.xsmall.unit};
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

export const SignInPrompt = styled('p')`
  color: ${Tokens.colors.textSecondary.var};
  font-size: ${Tokens.fontSizes.base.value}${Tokens.fontSizes.base.unit};
  margin-bottom: ${Tokens.sizes.large.value}${Tokens.sizes.large.unit};

  a {
    color: ${Tokens.colors.rolePrompt.var};
    text-decoration: underline;
  }
`

export const EmptyState = styled('p')`
  color: ${Tokens.colors.textSecondary.var};
  font-style: italic;
`

export const ErrorText = styled('p')`
  color: ${Tokens.colors.roleDanger.var};
  font-size: ${Tokens.fontSizes.sm.value}${Tokens.fontSizes.sm.unit};
  margin: 0;
`

export const ConfirmDialog = styled('div')`
  display: flex;
  align-items: center;
  gap: ${Tokens.sizes.spacing.xsmall.value}${Tokens.sizes.spacing.xsmall.unit};
  font-size: ${Tokens.fontSizes.sm.value}${Tokens.fontSizes.sm.unit};
  color: ${Tokens.colors.textSecondary.var};
`

export const EditTextarea = styled(CommentTextarea)`
  min-height: 60px;
  margin-top: ${Tokens.sizes.spacing.xsmall.value}${Tokens.sizes.spacing.xsmall.unit};
`
