import { Todo } from './todo';
import { createTodo } from './todo.factory';

export const mockTodos: Todo[] = [
  createTodo(),
  createTodo({ id: '2', title: 'Write more tests', createdAt: new Date('2026-01-01T00:02:00Z') }),
  createTodo({
    id: '3',
    title: 'Write even more tests',
    createdAt: new Date('2026-01-01T00:03:00Z'),
  }),
];
