import { render, screen, fireEvent } from '@testing-library/react';
import { HashRouter } from 'react-router-dom';
import App from './App';

// Guards the router integration itself: every other test mounts leaf pages
// directly, so a react-router upgrade that breaks module resolution or
// rendering would otherwise pass CI untouched.
test('mounts through the router and navigates off the start page', () => {
  render(<HashRouter><App /></HashRouter>);

  expect(screen.getAllByText(/Apply for a postal vote/i).length).toBeGreaterThan(0);

  fireEvent.click(screen.getByText(/Start now/i));

  expect(window.location.hash).toBe('#/is-registered');
});
