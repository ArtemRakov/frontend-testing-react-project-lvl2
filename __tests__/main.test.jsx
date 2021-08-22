import React from 'react';
import {
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import faker from 'faker';
import _ from 'lodash';
// eslint-disable-next-line jest/no-mocks-import
import getServer from '../__mocks__/server';

import TodoApp from '@hexlet/react-todo-app-with-backend';

const primaryListId = _.uniqueId();
const defaultState = {
  lists: [
    { id: primaryListId, name: 'primary', removable: false },
    { id: _.uniqueId(), name: 'secondary', removable: true },
  ],
  tasks: [],
  currentListId: primaryListId,
};

const addList = (listName) => {
  const listTextBox = screen.getByRole('textbox', { name: /new list/i });
  userEvent.type(listTextBox, listName);
  userEvent.click(screen.getByText('add list'));
};

const addTask = (taskName) => {
  const taskTextBox = screen.getByRole('textbox', { name: /new task/i });
  userEvent.type(taskTextBox, taskName);

  const button = screen.getByRole('button', { name: 'Add' });
  userEvent.click(button);
};

const finishTask = (taskName) => userEvent.click(screen.getByRole('checkbox', { name: taskName }));

let server;

beforeEach(() => {
  server = getServer(defaultState);
  server.listen();

  render(TodoApp(defaultState));
});

afterEach(() => {
  server.close();
});

test('can add tasks', async () => {
  const task = faker.lorem.word();

  const taskTextBox = screen.getByRole('textbox', { name: /new task/i });
  userEvent.type(taskTextBox, task);
  const button = screen.getByRole('button', { name: 'Add' });
  userEvent.click(button);

  await waitFor(() => {
    expect(screen.getByRole('textbox', { name: /new task/i })).not.toHaveValue();
    expect(screen.getByText(task)).toBeInTheDocument();
  });
});

test('can finish tasks', async () => {
  const taskToFinish = faker.lorem.word();
  const task = faker.lorem.word();

  addTask(taskToFinish);
  await screen.findByText(taskToFinish);

  addTask(task);
  await screen.findByText(task);

  finishTask(taskToFinish);

  const taskToFinishCheckbox = screen.getByRole('checkbox', { name: taskToFinish });
  const tasks = screen.getByTestId('tasks');
  await waitFor(() => {
    expect(taskToFinishCheckbox).toBeChecked();
    expect(tasks).lastElementContain(taskToFinishCheckbox);
  });
});

test('can delete task', async () => {
  const taskName = faker.lorem.word();

  addTask(taskName);
  await screen.findByText(taskName);

  const removeBtn = screen.getByRole('button', { name: 'Remove' });
  userEvent.click(removeBtn);

  await waitFor(() => expect(screen.queryByText(taskName)).not.toBeInTheDocument());
});

test('cannot create same task in the same list', async () => {
  const taskName = faker.lorem.word();

  addTask(taskName);
  await screen.findByText(taskName);

  addTask(taskName);

  expect(await screen.findByText(`${taskName} already exists`)).toBeVisible();
});

test('can add list', async () => {
  const listName = faker.lorem.word();

  addList(listName);

  const lists = screen.getByTestId('lists');
  await waitFor(() => {
    const list = screen.getByText(listName);

    expect(list).toBeVisible();
    expect(lists).lastElementContain(list);
    expect(screen.getByText(/tasks list is empty/i)).toBeInTheDocument();
  });
});

test('can only see current list tasks', async () => {
  const task = faker.lorem.word();
  const listTask = faker.lorem.word();
  const listName = faker.lorem.word();

  addTask(task);
  await screen.findByText(task);

  addList(listName);
  await screen.findByText(listName);

  userEvent.click(screen.getByText(listName));
  addTask(listTask);

  expect(await screen.findByText(listTask)).toBeVisible();
  await waitFor(() => expect(screen.queryByText(task)).not.toBeInTheDocument());
});

test('can create same task in different lists', async () => {
  const task = faker.lorem.word();
  const listName = faker.lorem.word();

  addTask(task);
  await screen.findByText(task);

  addList(listName);
  await screen.findByText(listName);

  addTask(task);

  expect(await screen.findByText(task)).toBeVisible();
});

test('can delete list', async () => {
  const listName = faker.lorem.word();

  addList(listName);
  await screen.findByText(listName);

  const lists = screen.getByTestId('lists');
  const removeListBtn = within(lists.lastElementChild).getByText('remove list');
  userEvent.click(removeListBtn);

  await waitFor(() => expect(screen.queryByText(listName)).not.toBeInTheDocument());
});

test('cannot create same list', async () => {
  const listName = faker.lorem.word();

  addList(listName);
  await screen.findByText(listName);

  addList(listName);

  expect(await screen.findByText(`${listName} already exists`)).toBeVisible();
});
