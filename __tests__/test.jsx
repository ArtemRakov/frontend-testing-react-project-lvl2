import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react'
// import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import TodoApp from '@hexlet/react-todo-app-with-backend';

test('initial start', () => {
  render(<TodoApp />);

  expect(screen.getByRole('textbox', { name: /new list/i })).toBeInTheDocument();
  expect(screen.getByRole('textbox', { name: /new task/i })).toBeInTheDocument();
});
