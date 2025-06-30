import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SearchPageLight from '../pages/light_mode/search_light';
import '@testing-library/jest-dom';

jest.mock('../components/shared/PageLayout/PageLayout', () => ({ children }) => <div>{children}</div>);
jest.mock('../components/shared/Autocomplete/Autocomplete', () => (props) => (
  <input
    data-testid={`autocomplete-${props.placeholder}`}
    value={props.value}
    onChange={e => props.onValueChange(e.target.value)}
    placeholder={props.placeholder}
  />
));

// Helper for creating abstract index
const createInvertedIndex = (text) => {
  const words = text.split(/\s+/);
  const index = {};
  words.forEach((word, i) => {
    if (!index[word]) index[word] = [];
    index[word].push(i);
  });
  return index;
};

const mockAbstract = "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks in an encoder-decoder configuration. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely. Experiments on two machine translation tasks show these models to be superior in quality while being more parallelizable and requiring significantly less time to train.";

// Mock the fetch API
global.fetch = jest.fn((url) => {
  if (url.includes('api.openalex.org/types')) {
    return Promise.resolve({
      status: 200,
      ok: true,
      json: () => Promise.resolve({ results: [] }),
    });
  }

  if (url.includes('localhost:4000/api/publications/search')) {
    return Promise.resolve({
      status: 200,
      ok: true,
      json: () => Promise.resolve({
        results: [
          {
            id: 'W2750983224',
            display_name: 'Attention Is All You Need',
            publication_year: 2017,
            authorships: [
              { author: { display_name: 'Ashish Vaswani' } },
              { author: { display_name: 'Noam Shazeer' } },
            ],
            abstract_inverted_index: createInvertedIndex(mockAbstract),
            primary_location: {
              landing_page_url: 'http://example.com',
              source: { display_name: 'arXiv' }
            },
            cited_by_count: 58540
          }
        ],
        meta: { count: 1, page: 1, per_page: 25 }
      }),
    });
  }

  return Promise.reject(new Error(`Unhandled API call in test: ${url}`));
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
  
    fireEvent.change(screen.getByPlaceholderText(/Enter keywords/i), {
      target: { value: 'Attention Is All You Need' }
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter author name/i), {
      target: { value: 'Ashish Vaswani' }
    });
  
    fireEvent.click(screen.getByRole('button', { name: '+' }));
    fireEvent.click(screen.getByText('Publication Year'));
    fireEvent.change(await screen.findByPlaceholderText(/e\.g\., 2023/i), {
      target: { value: '2017' }
    });
  
    fireEvent.click(screen.getByRole('button', { name: /search/i }));
  
    // Title (composed from multiple <span>s)
    await waitFor(() => {
        screen.debug;
      const titleContainer = screen.getByRole('heading'); // h3 tag
      expect(titleContainer.textContent).toMatch(/attention is all you need/i);
    });
  
    // Author block (also composed from spans)
    await waitFor(() => {
      const authorContainer = screen.getByText((_, node) =>
        node?.className?.includes('search_authors') &&
        node?.textContent?.toLowerCase().includes('ashish vaswani')
      );
      expect(authorContainer.textContent).toMatch(/noam shazeer/i);
    });
  
    expect(screen.getByText(/published on jan 01 2017/i)).toBeInTheDocument();
  
    const firstSentence = "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks in an encoder-decoder configuration.";
    expect(screen.getByText(new RegExp(firstSentence, "i"))).toBeInTheDocument();
  });
  
  
});
