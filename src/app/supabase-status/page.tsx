import { checkSupabaseStatus } from '@/utils/supabase/status'
import { createSafeClient } from '@/utils/supabase/safe-client'
import { styled } from '@pigment-css/react'
import Tokens from '@/lib/tokens'

const Container = styled('div')`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`

const StatusCard = styled('div')<{ $isAvailable: boolean; $isPaused: boolean }>`
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  border: 1px solid
    ${(props) =>
      props.$isPaused
        ? Tokens.colors.error.value
        : props.$isAvailable
        ? Tokens.colors.success?.value || '#10b981'
        : Tokens.colors.warning.value};
  background: ${(props) =>
    props.$isPaused
      ? 'rgba(239, 68, 68, 0.1)'
      : props.$isAvailable
      ? 'rgba(16, 185, 129, 0.1)'
      : 'rgba(245, 158, 11, 0.1)'};
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

const TestButton = styled('button')`
  background: ${Tokens.colors.primary?.value || '#3b82f6'};
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  margin-right: 1rem;
  margin-bottom: 1rem;

  &:hover {
    background: ${Tokens.colors.primary?.value || '#2563eb'};
  }

  &:disabled {
    background: #6b7280;
    cursor: not-allowed;
  }
`

const CodeBlock = styled('pre')`
  background: #f3f4f6;
  padding: 1rem;
  border-radius: 6px;
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

      <StatusCard $isAvailable={status.isAvailable} $isPaused={status.isPaused}>
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

      <StatusCard
        $isAvailable={userResult.isAvailable}
        $isPaused={userResult.isPaused}
      >
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
        {userResult.data && (
          <StatusText>
            <strong>User:</strong> {userResult.data.email || 'No email'}
          </StatusText>
        )}
      </StatusCard>

      <StatusCard
        $isAvailable={sessionResult.isAvailable}
        $isPaused={sessionResult.isPaused}
      >
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
          <li>Click "Pause" to pause your project</li>
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
