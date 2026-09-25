import { Todo } from './todo';

export function createTodo(overrides: Partial<Todo> = {}): Todo {
  return {
    id: '1',
    title: 'Write test',
    createdAt: new Date(`2026-01-01T00:0${overrides.id || '1'}:00Z`),
    ...overrides,
  };
}
