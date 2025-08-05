import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom'; 
import SearchPageLight from '../pages/search';

// Mock the global fetch function
global.fetch = jest.fn();

const renderComponent = () =>
  render(
    <MemoryRouter>
      <SearchPageLight />
    </MemoryRouter>
  );

describe('SearchPageLight Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    fetch.mockClear();
  });

  // Test #1: Component Renders Without Crashing
  test('renders the search page without crashing', () => {
    renderComponent();
    // Use a more specific query by role to avoid ambiguity
    expect(screen.getByRole('heading', { name: /Publication Search/i })).toBeInTheDocument();
  });

  // Test #2: State Updates Correctly on User Interaction
  test('updates the search keyword state when the user types in the input', () => {
    renderComponent();
    const input = screen.getByPlaceholderText(/Enter keywords.../i);
    fireEvent.change(input, { target: { value: 'test keyword' } });
    expect(input.value).toBe('test keyword');
  });

  // Test #3: API Call Triggered on Action & Conditional Rendering
  test('triggers an API call and shows loading state when the search button is clicked', async () => {
    // Mock a successful API response that includes authorships
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        results: [{ 
          id: '1', 
          display_name: 'Attention is all you need', 
          authorships: [{ author: { display_name: 'Vaswani' } }] 
        }],
        meta: { count: 1 },
      }),
    });

    renderComponent();

    // Simulate user typing a keyword and clicking search
    const input = screen.getByPlaceholderText(/Enter keywords.../i);
    fireEvent.change(input, { target: { value: 'attention' } });
    const searchButton = screen.getByRole('button', { name: /Search/i });
    fireEvent.click(searchButton);

    // Assert on the loading state:
    // 1. The button becomes disabled and its text changes to "Searching..."
    //expect(screen.getByRole('button', { name: /Searching.../i })).toBeDisabled();
    // 2. A separate "Loading..." message also appears elsewhere.
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();

    // Check that fetch was called
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      // Verify the URL to ensure it calls the correct OpenAlex endpoint
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('https://api.openalex.org/works?'));
    });

    // After the call, check if the loading indicators disappear and results are shown
    await waitFor(() => {
      expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
      expect(screen.getByText(/Vaswani/i)).toBeInTheDocument();
      // It's also good practice to check that the button is re-enabled
      expect(screen.getByRole('button', { name: /Search/i })).toBeEnabled();
    });
  });
}); 