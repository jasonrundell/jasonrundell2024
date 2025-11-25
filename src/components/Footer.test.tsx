import { render, screen } from '@testing-library/react'
import Footer from './Footer'

// Mock dependencies
jest.mock('./ContactList', () => {
  return function MockContactList() {
    return <div data-testid="contact-list">Contact List</div>
  }
})

jest.mock('./BackToTop', () => {
  return function MockBackToTop() {
    return <button data-testid="back-to-top">Back to Top</button>
  }
})

jest.mock('@/styles/common', () => ({
  StyledContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="container">{children}</div>
  ),
  StyledSection: ({ children }: { children: React.ReactNode }) => (
    <section data-testid="section">{children}</section>
  ),
}))

describe('Footer Component', () => {
  it('should render footer with contact section', async () => {
    // Act
    const footerComponent = await Footer()
    render(footerComponent)

    // Assert
    const footer = screen.getByRole('contentinfo')
    expect(footer).toBeInTheDocument()
    expect(footer).toHaveAttribute('id', 'contact')
  })

  it('should display "Contact me" heading', async () => {
    // Act
    const footerComponent = await Footer()
    render(footerComponent)

    // Assert
    const heading = screen.getByRole('heading', { name: /contact me/i })
    expect(heading).toBeInTheDocument()
  })

  it('should render ContactList component', async () => {
    // Act
    const footerComponent = await Footer()
    render(footerComponent)

    // Assert
    expect(screen.getByTestId('contact-list')).toBeInTheDocument()
  })

  it('should display copyright information with current year', async () => {
    // Act
    const footerComponent = await Footer()
    render(footerComponent)

    // Assert
    const currentYear = new Date().getFullYear()
    expect(
      screen.getByText(new RegExp(`© Jason Rundell ${currentYear}`, 'i'))
    ).toBeInTheDocument()
  })

  it('should display design consulting credit with link', async () => {
    // Act
    const footerComponent = await Footer()
    render(footerComponent)

    // Assert
    const link = screen.getByRole('link', { name: /donna vitan/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', 'https://donnavitan.com')
    expect(link).toHaveClass('link')
  })

  it('should render BackToTop component', async () => {
    // Act
    const footerComponent = await Footer()
    render(footerComponent)

    // Assert
    expect(screen.getByTestId('back-to-top')).toBeInTheDocument()
  })
})
