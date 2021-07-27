import { rest } from 'msw';
import _ from 'lodash';

const getNextId = () => Number(_.uniqueId());

const state = {
  tasks: [],
};

const handlers = [
  rest.post('/api/v1/lists/:id/tasks', (req, res, ctx) => {
    const { text } = req.body;

    const task = {
      text,
      listId: Number(req.params.id),
      id: getNextId(),
      completed: false,
      touched: Date.now(),
    };
    state.tasks.push(task);

    return res(ctx.status(201), ctx.json(task));
  }),
  rest.patch('/api/v1/tasks/:id', (req, res, ctx) => {
    const taskId = Number(req.params.id);
    const { completed } = req.body;

    const task = state.tasks.find((t) => t.id === taskId);

    return res(
      ctx.status(201),
      ctx.json({ ...task, completed, touched: Date.now() }),
    )
  }),
  rest.delete('/api/v1/tasks/:id', (req, res, ctx) => {
    const taskId = Number(req.params.id);

    state.tasks = state.tasks.filter((t) => t.id !== taskId);

    return res(ctx.status(204));
  }),
];

export { handlers };
