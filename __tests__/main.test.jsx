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

const addTask = (taskName) => {
  const taskTextBox = screen.getByRole('textbox', { name: /new task/i });
  userEvent.type(taskTextBox, taskName);

  const view = screen.getByTestId('task-form');
  userEvent.click(within(view).getByRole('button', { name: /add/i }))
};

const finishTask = (taskName) => userEvent.click(screen.getByRole('checkbox', { name: taskName }));

beforeEach(() => {
  render(TodoApp(defaultState));
});

test('initial start', () => {
  expect(screen.getByRole('textbox', { name: /new list/i })).toBeInTheDocument();
  expect(screen.getByRole('textbox', { name: /new task/i })).toBeInTheDocument();
});

test('can add tasks', async () => {
  const task = faker.lorem.word();
  const taskForm = screen.getByTestId('task-form');

  addTask(task);

  await waitFor(() => {
    expect(within(taskForm).getByRole('button', { name: /add/i })).not.toHaveValue();
    expect(screen.getByText(task)).toBeInTheDocument();
  });
});

test('can finish tasks', async () => {
  const taskToFinish = faker.lorem.word();
  const task = faker.lorem.word();

  addTask(taskToFinish);
  await screen.findByText(taskToFinish)

  addTask(task);
  await screen.findByText(task)

  finishTask(taskToFinish);

  const taskToFinishCheckbox = screen.getByRole('checkbox', { name: taskToFinish })
  const tasks = screen.getByTestId('tasks');
  await waitFor(() => {
    expect(taskToFinishCheckbox).toBeChecked();
    expect(tasks).lastElementContain(taskToFinishCheckbox);
  })
});

test('can delete task', async () => {
  const taskName = faker.lorem.word();

  addTask(taskName);
  await screen.findByText(taskName)

  const tasks = screen.getByTestId('tasks');
  const removeBtn = within(tasks).getByRole('button', { name: /remove/i });
  userEvent.click(removeBtn);

  await waitFor(() => expect(screen.queryByText(taskName)).not.toBeInTheDocument());
});
