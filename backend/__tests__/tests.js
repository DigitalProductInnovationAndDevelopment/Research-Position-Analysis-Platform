const { buildQuery } = require('../src/queryBuilder');
const { isSiemensRelevant } = require('../src/relevanceDetection');

describe('Query Builder', () => {
  test('Keyword-only search', () => {
    const query = buildQuery({ keyword: 'machine learning' });
    expect(query).toMatchObject({ keyword: 'machine learning', filters: {} });
  });

  test('Keyword + filters', () => {
    const query = buildQuery({ keyword: 'AI', filters: { location: 'Munich', level: 'PhD' } });
    expect(query).toMatchObject({
      keyword: 'AI',
      filters: { location: 'Munich', level: 'PhD' }
    });
  });

  test('Edge case: empty keyword', () => {
    const query = buildQuery({ keyword: '', filters: { location: 'Berlin' } });
    expect(query.keyword).toBe('');
    expect(query.filters).toEqual({ location: 'Berlin' });
  });

  test('Edge case: invalid filter', () => {
    const query = buildQuery({ keyword: 'data', filters: { foo: 'bar' } });
    // Assuming the builder ignores unknown filters
    expect(query.filters).not.toHaveProperty('foo');
  });
});

describe('Siemens Relevance Detection', () => {
  test('Detects Siemens relevance', () => {
    const position = { company: 'Siemens', title: 'Research Scientist' };
    expect(isSiemensRelevant(position)).toBe(true);
  });

  test('Detects non-Siemens relevance', () => {
    const position = { company: 'OtherCorp', title: 'Research Scientist' };
    expect(isSiemensRelevant(position)).toBe(false);
  });

  test('Edge case: missing company field', () => {
    const position = { title: 'Research Scientist' };
    expect(isSiemensRelevant(position)).toBe(false);
  });
});