import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { LandingPageLight } from '../pages/light_mode/landing_light';

describe('LandingPageLight', () => {
  test('renders the DisclaimerBox, PrivacyPolicyBox, and ImpressumBox', () => {
    render(
      <MemoryRouter>
        <LandingPageLight />
      </MemoryRouter>
    );

    // Check for unique text from DisclaimerBox
    expect(
      screen.getByText(/SPARK is intended for internal research teams/i)
    ).toBeInTheDocument();

    // Check for unique text from PrivacyPolicyBox
    expect(
      screen.getByText(/privacy policy/i)
    ).toBeInTheDocument();

    // Check for unique text from ImpressumBox
    expect(
      screen.getByText(/impressum/i)
    ).toBeInTheDocument();
  });
}); 