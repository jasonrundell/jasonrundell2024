import { checkSupabaseStatus } from '@/utils/supabase/status'
import { createSafeClient } from '@/utils/supabase/safe-client'
import { styled } from '@pigment-css/react'
import Tokens from '@/lib/tokens'

const Container = styled('div')`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`

const StatusCard = styled('div')`
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1rem;
`

const StatusTitle = styled('h2')`
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
  font-weight: 600;
`

const StatusText = styled('p')`
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
`

const CodeBlock = styled('pre')`
  background: ${Tokens.colors.muted.value};
  padding: 1rem;
  border-radius: ${Tokens.borderRadius.medium.value}${Tokens.borderRadius.medium.unit};
  overflow-x: auto;
  font-size: 0.875rem;
  margin: 1rem 0;
`

export default async function SupabaseStatusPage() {
  // Check current status
  const status = await checkSupabaseStatus()

  // Test safe client operations
  const safeClient = createSafeClient()
  const userResult = await safeClient.getUser()
  const sessionResult = await safeClient.getSession()

  return (
    <Container>
      <h1>Supabase Status Dashboard</h1>

      <StatusCard>
        <StatusTitle>Database Status</StatusTitle>
        <StatusText>
          <strong>Available:</strong> {status.isAvailable ? 'Yes' : 'No'}
        </StatusText>
        <StatusText>
          <strong>Paused:</strong> {status.isPaused ? 'Yes' : 'No'}
        </StatusText>
        {status.error && (
          <StatusText>
            <strong>Error:</strong> {status.error}
          </StatusText>
        )}
      </StatusCard>

      <StatusCard>
        <StatusTitle>User Authentication Test</StatusTitle>
        <StatusText>
          <strong>Available:</strong> {userResult.isAvailable ? 'Yes' : 'No'}
        </StatusText>
        <StatusText>
          <strong>Paused:</strong> {userResult.isPaused ? 'Yes' : 'No'}
        </StatusText>
        {userResult.error && (
          <StatusText>
            <strong>Error:</strong> {userResult.error}
          </StatusText>
        )}
        {userResult.data && userResult.data.user && (
          <StatusText>
            <strong>User:</strong> {userResult.data.user.email || 'No email'}
          </StatusText>
        )}
      </StatusCard>

      <StatusCard>
        <StatusTitle>Session Test</StatusTitle>
        <StatusText>
          <strong>Available:</strong> {sessionResult.isAvailable ? 'Yes' : 'No'}
        </StatusText>
        <StatusText>
          <strong>Paused:</strong> {sessionResult.isPaused ? 'Yes' : 'No'}
        </StatusText>
        {sessionResult.error && (
          <StatusText>
            <strong>Error:</strong> {sessionResult.error}
          </StatusText>
        )}
        {sessionResult.data && (
          <StatusText>
            <strong>Session:</strong>{' '}
            {sessionResult.data.session ? 'Active' : 'None'}
          </StatusText>
        )}
      </StatusCard>

      <div>
        <h2>What happens when Supabase is paused?</h2>
        <ul>
          <li>Authentication features are disabled</li>
          <li>Database queries fail gracefully</li>
          <li>Users see helpful error messages</li>
          <li>Public content remains accessible</li>
          <li>Status banner appears at the top</li>
        </ul>
      </div>

      <div>
        <h2>How to test paused state:</h2>
        <ol>
          <li>Go to your Supabase dashboard</li>
          <li>Navigate to Settings → General</li>
          <li>Click &quot;Pause&quot; to pause your project</li>
          <li>Refresh this page to see the changes</li>
          <li>Try accessing protected routes</li>
          <li>Resume your project to restore functionality</li>
        </ol>
      </div>

      <div>
        <h2>Current Status Response:</h2>
        <CodeBlock>{JSON.stringify(status, null, 2)}</CodeBlock>
      </div>
    </Container>
  )
}
