import React from 'react'; // ✅ Required for JSX in test files
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders homepage or login prompt successfully', () => {
  render(<App />);

  // ✅ Pick ONE real element that's always visible on initial load
  // Tip: Replace with something that always appears like a heading, slogan, or button
  const welcomeText = screen.getByText(/creme collections/i); // Example: brand heading

  // Optional alternates you can test instead if more appropriate:
  // const welcomeText = screen.getByText(/all in one/i);           // brand slogan
  // const welcomeText = screen.getByRole('button', { name: /logout/i }); // logout button

  // ✅ Final assertion
  expect(welcomeText).toBeInTheDocument();
});
