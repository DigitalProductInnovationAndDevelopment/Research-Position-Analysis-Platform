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

describe('Keyword Input Validation', () => {
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

    const keywordInput = screen.getByPlaceholderText(/Enter keywords.../i);
    const searchButton = screen.getByRole('button', { name: /search/i });

    // Test whitespace input
    fireEvent.change(keywordInput, { target: { value: ' ' } });
    fireEvent.click(searchButton);
    expect(screen.getByText("Invalid input: ' ' is not a valid value for Keyword. Please enter a non-empty string that is not only a number.")).toBeInTheDocument();

    // Test invalid numeric input
    fireEvent.change(keywordInput, { target: { value: '1' } });
    fireEvent.click(searchButton);
    expect(screen.getByText("Invalid input: '1' is not a valid value for Keyword. Please enter a non-empty string that is not only a number.")).toBeInTheDocument();
  });
}); 