import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SearchPageLight from '../pages/light_mode/search_light';
import '@testing-library/jest-dom';

// Mock PageLayout and Autocomplete to avoid unrelated errors
jest.mock('../components/shared/PageLayout/PageLayout', () => ({ children }) => <div>{children}</div>);
jest.mock('../components/shared/Autocomplete/Autocomplete', () => (props) => <input value={props.value} onChange={e => props.onValueChange(e.target.value)} placeholder={props.placeholder} />);

describe('Search filter data type validation (sequential logic)', () => {
  test('sequential validation and error messages', async () => {
    render(
      <MemoryRouter>
        <SearchPageLight darkMode={false} toggleDarkMode={() => {}} />
      </MemoryRouter>
    );

    // 1. Test empty keyword consisting of whitespaces
    const keywordInput = screen.getByPlaceholderText(/Enter keywords/i);
    fireEvent.change(keywordInput, { target: { value: '   ' } });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));
    expect(screen.getByText("Invalid input: '   ' is not a valid value for Keyword. Please enter a non-empty string that is not only a number.")).toBeInTheDocument();

    // Remove the keyword (simulate user clearing it)
    fireEvent.change(keywordInput, { target: { value: '' } });

    // 2. Add Publication Year filter and test string input
    const addBtn = screen.getByRole('button', { name: /\+/ });
    fireEvent.click(addBtn);
    fireEvent.click(screen.getByText('Publication Year'));
    // Wait for the input to appear in the DOM
    const yearInput = await screen.findByPlaceholderText(/e\.g\., 2023/i);
    // Set a valid keyword so Publication Year validation is triggered
    fireEvent.change(keywordInput, { target: { value: 'test' } });
    // Enter invalid value and search
    fireEvent.change(yearInput, { target: { value: 'abc' } });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));
    expect(screen.getByText(/not a valid year/i)).toBeInTheDocument();

    // Remove Publication Year input
    fireEvent.change(yearInput, { target: { value: '' } });

    // 3. Add Year Range filter and test invalid start and end
    fireEvent.click(addBtn);
    fireEvent.click(screen.getByText('Year Range'));
    // Wait for the inputs to appear in the DOM
    const startInput = await screen.findByPlaceholderText(/From Year/i);
    const endInput = await screen.findByPlaceholderText(/To Year/i);
    // Test invalid start year
    fireEvent.change(startInput, { target: { value: '20x0' } });
    fireEvent.change(endInput, { target: { value: '2023' } });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));
    expect(screen.getByText(/not a valid year/i)).toBeInTheDocument();
    // Test invalid end year
    fireEvent.change(startInput, { target: { value: '2020' } });
    fireEvent.change(endInput, { target: { value: '20y3' } });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));
    expect(screen.getByText(/not a valid year/i)).toBeInTheDocument();

    // Remove Year Range input
    fireEvent.change(startInput, { target: { value: '' } });
    fireEvent.change(endInput, { target: { value: '' } });

    // 4. Add Author filter and test whitespace-only input
    fireEvent.click(addBtn);
    fireEvent.click(screen.getByText('Author'));
    const authorInput = screen.getByPlaceholderText(/Enter author name/i);
    fireEvent.change(authorInput, { target: { value: '   ' } });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));
    expect(screen.getByText("Invalid input: '   ' is not a valid value for Author. Please enter a non-empty string without numbers.")).toBeInTheDocument();
    // Test author as a number
    fireEvent.change(authorInput, { target: { value: '1234' } });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));
    expect(screen.getByText("Invalid input: '1234' is not a valid value for Author. Please enter a non-empty string without numbers.")).toBeInTheDocument();

    // Remove Author input
    fireEvent.change(authorInput, { target: { value: '' } });

    // 5. Add Institution filter and test number-only input
    fireEvent.click(addBtn);
    fireEvent.click(screen.getByText('Institution'));
    const instInput = screen.getByPlaceholderText(/Enter institution name/i);
    fireEvent.change(instInput, { target: { value: '5678' } });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));
    expect(screen.getByText("Invalid input: '5678' is not a valid value for Institution. Please enter a non-empty string that is not only a number.")).toBeInTheDocument();
  });
}); 