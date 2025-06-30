import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SearchPageLight from '../pages/light_mode/search_light';
import '@testing-library/jest-dom';

// Mock dependencies
jest.mock('../components/shared/PageLayout/PageLayout', () => ({ children }) => <div>{children}</div>);
jest.mock('../components/shared/Autocomplete/Autocomplete', () => (props) => (
  <input
    value={props.value}
    onChange={(e) => props.onValueChange(e.target.value)}
    placeholder={props.placeholder}
  />
));

describe('Author Input Validation', () => {
  beforeEach(() => {
    // Mock fetch for types to prevent unrelated errors
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ results: [] }),
      })
    );
  });

  test('shows error for whitespace-only input and then for numeric input', async () => {
    render(
      <MemoryRouter>
        <SearchPageLight darkMode={false} toggleDarkMode={() => {}} />
      </MemoryRouter>
    );

    const authorInput = screen.getByPlaceholderText(/Enter author name/i);
    const searchButton = screen.getByRole('button', { name: /search/i });

    // Test whitespace input
    fireEvent.change(authorInput, { target: { value: ' ' } });
    fireEvent.click(searchButton);
    expect(screen.getByText("Invalid input: ' ' is not a valid value for Author. Please enter a non-empty string without numbers.")).toBeInTheDocument();

    // Test invalid numeric input after clearing
    fireEvent.change(authorInput, { target: { value: '1' } });
    fireEvent.click(searchButton);
    expect(screen.getByText("Invalid input: '1' is not a valid value for Author. Please enter a non-empty string without numbers.")).toBeInTheDocument();
  });
}); 