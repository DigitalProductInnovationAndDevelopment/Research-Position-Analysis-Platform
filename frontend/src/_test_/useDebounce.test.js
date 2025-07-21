import { renderHook, act } from '@testing-library/react';
import useDebounce from '../hooks/useDebounce';

describe('useDebounce Custom Hook', () => {

  beforeAll(() => {
    // Jest timers are required for testing debounce
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should return the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));
    expect(result.current).toBe('initial');
  });

  it('should only update the debounced value after the specified delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'first', delay: 500 } }
    );

    // Value should not change immediately
    rerender({ value: 'second', delay: 500 });
    expect(result.current).toBe('first');

    // Fast-forward time by 500ms
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Now the value should be updated
    expect(result.current).toBe('second');
  });

  it('should reset the timer if the value changes within the delay period', () => {
    const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: 'first', delay: 500 } }
    );

    // Rerender with new value
    rerender({ value: 'second', delay: 500 });
    
    // Advance time by less than the delay
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // The value should still be the old one
    expect(result.current).toBe('first');

    // Rerender again with a third value
    rerender({ value: 'third', delay: 500 });

    // The timer should have been reset. Fast-forward past the original timeout.
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // The debounced value should now be the third one.
    expect(result.current).toBe('third');
  });
}); 