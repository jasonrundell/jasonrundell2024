import { signUpAction } from './sign-up'
import { encodedRedirect } from '@/utils/utils'
import { _clearStore } from '@/lib/rate-limit'

jest.mock('@/utils/supabase/server')
jest.mock('@/utils/supabase/safe-client')
jest.mock('@/utils/utils')
jest.mock('next/navigation')
jest.mock('next/headers', () => ({
  headers: jest.fn().mockResolvedValue({
    get: jest.fn((name: string) => {
      if (name === 'x-forwarded-for') return '1.2.3.4'
      if (name === 'origin') return 'http://localhost:3000'
      return null
    }),
  }),
}))

const mockedEncodedRedirect = encodedRedirect as jest.MockedFunction<
  typeof encodedRedirect
>

describe('signUpAction', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    _clearStore()
    mockedEncodedRedirect.mockImplementation(
      (type, path, msg) => `${type}:${path}:${msg}` as unknown as never
    )
  })

  it('redirects with error when required fields are missing', async () => {
    const formData = new FormData()
    await signUpAction(formData)
    expect(mockedEncodedRedirect).toHaveBeenCalledWith(
      'error',
      '/sign-up',
      expect.any(String)
    )
  })

  it('redirects with error when email is invalid', async () => {
    const formData = new FormData()
    formData.set('displayName', 'Test User')
    formData.set('profileSlug', 'test-user')
    formData.set('email', 'not-an-email')
    formData.set('password', 'ValidPass1!')
    await signUpAction(formData)
    expect(mockedEncodedRedirect).toHaveBeenCalledWith(
      'error',
      '/sign-up',
      expect.stringContaining('Invalid email')
    )
  })

  it('redirects with error when password is too weak', async () => {
    const formData = new FormData()
    formData.set('displayName', 'Test User')
    formData.set('profileSlug', 'test-user')
    formData.set('email', 'test@example.com')
    formData.set('password', 'short')
    await signUpAction(formData)
    expect(mockedEncodedRedirect).toHaveBeenCalledWith(
      'error',
      '/sign-up',
      expect.any(String)
    )
  })
})
