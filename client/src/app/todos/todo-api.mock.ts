import { of } from 'rxjs';
import { vi } from 'vitest';

import { mockTodos } from './models/todo.mock';

export class MockTodoApi {
  getAll = vi.fn().mockReturnValue(of(mockTodos));
  create = vi.fn((title: string) =>
    of({ id: '4', title, createdAt: new Date('2026-01-01T00:04:00Z') }),
  );
  remove = vi.fn(() => of(undefined));
}
