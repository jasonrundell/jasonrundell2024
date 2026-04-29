import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Spacer } from '@jasonrundell/dropship'
import { createPublicClient } from '@/utils/supabase/public-client'
import { SITE_DESCRIPTION } from '@/lib/constants'
import {
  StyledContainer,
  StyledSection,
  StyledBreadcrumb,
  StyledHeading,
} from '@/styles/common'
import {
  CommentCard,
  CommentDate,
  CommentBody,
  CommentsList,
  EmptyState,
} from '@/components/comments/styles'
import { styled } from '@pigment-css/react'
import Tokens from '@/lib/tokens'
import { formatDistanceToNow } from 'date-fns'
import { profileSlugSchema } from '@/lib/profile-slug'

const MemberSince = styled('p')`
  color: ${Tokens.colors.textSecondary.var};
  font-size: ${Tokens.fontSizes.sm.value}${Tokens.fontSizes.sm.unit};
  margin: 0 0 ${Tokens.sizes.xlarge.value}${Tokens.sizes.xlarge.unit} 0;
`

const CommentMeta = styled(Link)`
  color: ${Tokens.colors.rolePrompt.var};
  font-size: ${Tokens.fontSizes.sm.value}${Tokens.fontSizes.sm.unit};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`

const SectionHeading = styled('h3')`
  font-size: ${Tokens.sizes.fonts.medium.value}${Tokens.sizes.fonts.medium.unit};
  color: ${Tokens.colors.roleHeading.var};
  margin: 0 0 ${Tokens.sizes.large.value}${Tokens.sizes.large.unit} 0;
`

type PageProps = {
  params: Promise<{ slug: string }>
}

type PublicProfile = {
  full_name: string
  auth_user_id: string
  created_at: string
}

type PublicComment = {
  id: string
  content_type: 'post' | 'project'
  content_slug: string
  body: string
  created_at: string
}

export const revalidate = 300

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const parsed = profileSlugSchema.safeParse(slug)
  if (!parsed.success) {
    return { title: 'User Not Found | Jason Rundell' }
  }

  const supabase = createPublicClient()
  const { data } = await supabase
    .from('public_user_profiles')
    .select('full_name')
    .eq('profile_slug', parsed.data)
    .single()
  const profile = data as Pick<PublicProfile, 'full_name'> | null

  return {
    title: profile
      ? `${profile.full_name} | Jason Rundell`
      : 'User Not Found | Jason Rundell',
    description: SITE_DESCRIPTION,
  }
}

export default async function PublicProfileBySlugPage({ params }: PageProps) {
  const { slug } = await params
  const parsed = profileSlugSchema.safeParse(slug)
  if (!parsed.success) {
    notFound()
  }

  const supabase = createPublicClient()

  const { data: profileData, error: profileError } = await supabase
    .from('public_user_profiles')
    .select('full_name, auth_user_id, created_at')
    .eq('profile_slug', parsed.data)
    .single()
  const profile = profileData as PublicProfile | null

  if (profileError || !profile?.auth_user_id) {
    notFound()
  }

  const { data: commentsData } = await supabase
    .from('comments')
    .select('id, content_type, content_slug, body, created_at')
    .eq('user_id', profile.auth_user_id)
    .order('created_at', { ascending: false })
    .limit(50)
  const comments = commentsData as PublicComment[] | null

  const memberSince = new Date(profile.created_at).toLocaleDateString(
    'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  )

  return (
    <StyledContainer>
      <StyledSection id="user-profile">
        <StyledBreadcrumb>
          <Link href="/">Home</Link> &gt; {profile.full_name}
        </StyledBreadcrumb>
        <StyledHeading>{profile.full_name}</StyledHeading>
        <MemberSince>Member since {memberSince}</MemberSince>

        <Spacer />

        <SectionHeading>Comments</SectionHeading>
        {!comments || comments.length === 0 ? (
          <EmptyState>No comments yet.</EmptyState>
        ) : (
          <CommentsList>
            {comments.map((comment) => {
              const linkPath =
                comment.content_type === 'post'
                  ? `/posts/${comment.content_slug}`
                  : `/projects/${comment.content_slug}`

              return (
                <CommentCard key={comment.id}>
                  <CommentMeta href={linkPath}>
                    on {comment.content_type}: {comment.content_slug}
                  </CommentMeta>
                  <CommentDate>
                    {' '}
                    {formatDistanceToNow(new Date(comment.created_at), {
                      addSuffix: true,
                    })}
                  </CommentDate>
                  <CommentBody>{comment.body}</CommentBody>
                </CommentCard>
              )
            })}
          </CommentsList>
        )}
      </StyledSection>
    </StyledContainer>
  )
}
