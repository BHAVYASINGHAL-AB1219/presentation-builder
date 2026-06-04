import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import HomePage from '@/app/page'

// Mock the Next.js router since it's not available in the test environment
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
    };
  },
}));

describe('HomePage', () => {
  it('renders the main heading', () => {
    render(<HomePage />)
    
    // Check if the hero title is rendered
    const heading = screen.getByRole('heading', {
      name: /Turn ideas into stunning decks instantly/i,
    })
    
    expect(heading).toBeInTheDocument()
  })

  it('renders the prompt input field', () => {
    render(<HomePage />)
    
    const input = screen.getByPlaceholderText(/Describe your presentation/i)
    expect(input).toBeInTheDocument()
  })
})
