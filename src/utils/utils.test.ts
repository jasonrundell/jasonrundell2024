import { encodedRedirect } from './utils'

jest.mock('next/navigation', () => ({
  redirect: jest.fn((url: string) => {
    throw Object.assign(new Error(`NEXT_REDIRECT:${url}`), { digest: `NEXT_REDIRECT:${url}` })
  }),
}))

import * as navigation from 'next/navigation'

const mockedRedirect = navigation.redirect as jest.MockedFunction<typeof navigation.redirect>

describe('encodedRedirect', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('calls redirect with error type and encoded message', () => {
    expect(() =>
      encodedRedirect('error', '/sign-in', 'Invalid credentials')
    ).toThrow()
    expect(mockedRedirect).toHaveBeenCalledWith(
      '/sign-in?error=Invalid%20credentials'
    )
  })

  it('calls redirect with success type and encoded message', () => {
    expect(() =>
      encodedRedirect('success', '/profile', 'Password updated')
    ).toThrow()
    expect(mockedRedirect).toHaveBeenCalledWith(
      '/profile?success=Password%20updated'
    )
  })

  it('encodes special characters in message', () => {
    expect(() =>
      encodedRedirect('error', '/sign-up', 'Email & password required!')
    ).toThrow()
    expect(mockedRedirect).toHaveBeenCalledWith(
      '/sign-up?error=Email%20%26%20password%20required!'
    )
  })

  it('handles empty message', () => {
    expect(() => encodedRedirect('error', '/sign-in', '')).toThrow()
    expect(mockedRedirect).toHaveBeenCalledWith('/sign-in?error=')
  })
})
