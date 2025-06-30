import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SearchPageLight from '../pages/light_mode/search_light';
import '@testing-library/jest-dom';

// Mock PageLayout and Autocomplete to avoid unrelated errors
jest.mock('../components/shared/PageLayout/PageLayout', () => ({ children }) => <div>{children}</div>);
jest.mock('../components/shared/Autocomplete/Autocomplete', () => (props) => <input data-testid={`autocomplete-${props.placeholder}`} value={props.value} onChange={e => props.onValueChange(e.target.value)} placeholder={props.placeholder} />);

// Helper to create an inverted index from text
const createInvertedIndex = (text) => {
  if (!text) return {};
  const words = text.split(/\s+/);
  const invertedIndex = {};
  words.forEach((word, index) => {
    if (word) {
      if (!invertedIndex[word]) {
        invertedIndex[word] = [];
      }
      invertedIndex[word].push(index);
    }
  });
  return invertedIndex;
};

const mockAbstract = "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks in an encoder-decoder configuration. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely. Experiments on two machine translation tasks show these models to be superior in quality while being more parallelizable and requiring significantly less time to train.";

// Mock the fetch API
global.fetch = jest.fn((url) => {
  if (url.includes('api.openalex.org/types')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ results: [] }),
    });
  }

  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      results: [
        {
          id: 'W2750983224',
          display_name: 'Attention is All you Need',
          publication_year: 2017,
          publication_date: '2017-01-01',
          authorships: [
            { author: { display_name: 'Ashish Vaswani' } },
            { author: { display_name: 'Noam Shazeer' } },
          ],
          abstract_inverted_index: createInvertedIndex(mockAbstract),
          primary_location: {
            landing_page_url: 'http://example.com'
          },
          cited_by_count: 58540
        }
      ],
      meta: { count: 1, page: 1, per_page: 25 }
    }),
  });
});

describe('Search Page Happy Path', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('should show results for a specific paper search', async () => {
    render(
      <MemoryRouter>
        <SearchPageLight darkMode={false} toggleDarkMode={() => {}} />
      </MemoryRouter>
    );

    // 1. Fill in search criteria
    // Title
    const keywordInput = screen.getByPlaceholderText(/Enter keywords.../i);
    fireEvent.change(keywordInput, { target: { value: 'Attention Is All You need' } });

    // Author - already present by default
    const authorInput = screen.getByPlaceholderText(/Enter author name.../i);
    fireEvent.change(authorInput, { target: { value: 'Ashish Vaswani' } });

    // Add and fill Publication Year
    const addFilterButton = screen.getByRole('button', { name: '+' });
    fireEvent.click(addFilterButton);
    fireEvent.click(screen.getByText('Publication Year'));
    
    const yearInput = await screen.findByPlaceholderText(/e\.g\., 2023/i);
    fireEvent.change(yearInput, { target: { value: '2017' } });

    // 2. Click Search
    const searchButton = screen.getByRole('button', { name: /search/i });
    fireEvent.click(searchButton);

    // 3. Verify results
    // Wait for the title to appear
    await waitFor(() => {
      expect(
        screen.getByText((_, node) =>
          node?.textContent?.replace(/\s+/g, '').toLowerCase().includes("attentionisallyouneed")
        )
      ).toBeInTheDocument();
    });

    // Check for authors
    expect(screen.getByText("Ashish Vaswani, Noam Shazeer")).toBeInTheDocument();

    // Check for publication date/year
    expect(screen.getByText("Published on Jan 01 2017")).toBeInTheDocument();

    // Check for the first sentence of the abstract
    const firstSentenceOfAbstract = "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks in an encoder-decoder configuration.";
    expect(screen.getByText(new RegExp(firstSentenceOfAbstract, "i"))).toBeInTheDocument();
  });
}); 