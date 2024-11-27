import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import CharacterSelection from '../components/CharacterSelection'
import '@testing-library/jest-dom'
import { store } from '../redux/store'
import { useRouter } from 'next/router'

// Mock the Next.js router
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}))

test('renders character selection', () => {
  useRouter.mockImplementation(() => ({
    route: '/',
    pathname: '',
    query: '',
    asPath: '',
    push: jest.fn(),
    replace: jest.fn(),
    reload: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn(),
    beforePopState: jest.fn(),
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
  }))

  render(
    <Provider store={store}>
      <CharacterSelection />
    </Provider>
  )
  const heading = screen.getByText(/Select Your Character/i)
  expect(heading).toBeInTheDocument()
})
