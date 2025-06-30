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

describe('Publication Year Input Validation', () => {
    beforeEach(() => {
        // Mock fetch for types to prevent unrelated errors
        global.fetch = jest.fn(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ results: [] }),
          })
        );
      });

  test('shows error for whitespace-only input and then for non-numeric input', async () => {
    render(
      <MemoryRouter>
        <SearchPageLight darkMode={false} toggleDarkMode={() => {}} />
      </MemoryRouter>
    );

    const addBtn = screen.getByRole('button', { name: /\+/ });
    fireEvent.click(addBtn);
    fireEvent.click(screen.getByText('Publication Year'));

    const yearInput = await screen.findByPlaceholderText(/e\.g\., 2023/i);
    const searchButton = screen.getByRole('button', { name: /search/i });
    
    // Test whitespace input
    fireEvent.change(yearInput, { target: { value: ' ' } });
    fireEvent.click(searchButton);
    expect(screen.getByText("Please enter at least one search criterion.")).toBeInTheDocument();

    // Add a valid keyword to isolate the year validation
    const keywordInput = screen.getByPlaceholderText(/Enter keywords.../i);
    fireEvent.change(keywordInput, { target: { value: 'test' } });

    // Test invalid non-numeric input
    fireEvent.change(yearInput, { target: { value: 'hi' } });
    fireEvent.click(searchButton);
    expect(screen.getByText("Invalid input: 'hi' is not a valid year. Please enter a valid positive integer year (e.g., 2023).")).toBeInTheDocument();
  });
}); 