import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import faker from 'faker';
import _ from 'lodash';

import TodoApp from '@hexlet/react-todo-app-with-backend';

const getNextId = () => Number(_.uniqueId());

const primaryListId = getNextId();
const secondaryListId = getNextId();
const defaultState = {
  lists: [
    { id: primaryListId, name: 'primary', removable: false },
    { id: secondaryListId, name: 'secondary', removable: true },
  ],
  tasks: [],
  currentListId: primaryListId,
};

const addTask = async (taskName) => {
  const taskTextBox = screen.getByRole('textbox', { name: /new task/i });
  userEvent.type(taskTextBox, taskName);

  const view = screen.getByTestId('task-form');
  userEvent.click(within(view).getByRole('button', { name: /add/i }))

  await screen.findByText(taskName);
};

test('initial start', () => {
  render(TodoApp(defaultState));

  expect(screen.getByRole('textbox', { name: /new list/i })).toBeInTheDocument();
  expect(screen.getByRole('textbox', { name: /new task/i })).toBeInTheDocument();
});

test('can add tasks', async () => {
  const task1 = faker.lorem.word();
  const task2 = faker.lorem.word();
  render(TodoApp(defaultState));
  const taskForm = screen.getByTestId('task-form');

  await addTask(task1);
  await addTask(task2);

  expect(within(taskForm).getByRole('button', { name: /add/i })).not.toHaveValue();
  expect(screen.getByText(task1)).toBeInTheDocument();
  expect(screen.getByText(task2)).toBeInTheDocument();
});
