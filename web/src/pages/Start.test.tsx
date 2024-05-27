import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Start from './Start';

test('renders apply for a postal vote text', () => {
  render(<Start onStart={() => { }} />);
  expect(screen.getByText(/Apply for a postal vote/i)).toBeInTheDocument();
});

test('clicking button triggers onStart', async () => {
  const user = userEvent.setup();

  // Given... start page with callback
  const onStart = jest.fn();
  render(<Start onStart={onStart} />);

  // Then... callback not automatically called
  expect(onStart).not.toHaveBeenCalled();

  // When... start button pressed
  await user.click(screen.getByText(/Start now/i));

  // Then... onStart callback called
  expect(onStart).toHaveBeenCalledTimes(1);
});
