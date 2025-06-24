import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DisclaimerBox from '../components/about/DisclaimerBox';

describe('DisclaimerBox Component', () => {
  it('should render the disclaimer title and text', () => {
    render(<DisclaimerBox />);

    // Check if the title is rendered
    const titleElement = screen.getByText(/Disclaimer/i);
    expect(titleElement).toBeInTheDocument();

    // Check if the correct disclaimer text is present
    const textElement = screen.getByText(/SPARK is intended for internal research teams/i);
    expect(textElement).toBeInTheDocument();
  });
}); 