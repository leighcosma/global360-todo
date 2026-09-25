import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { throwError } from 'rxjs';

import { mockTodos } from './models/todo.mock';
import { TodoApi } from './todo-api';
import { MockTodoApi } from './todo-api.mock';
import { TodoStore } from './todo-store';
import { createTodo } from './models/todo.factory';

describe('TodoStore', () => {
  let store: TodoStore;
  let api: MockTodoApi;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: TodoApi, useClass: MockTodoApi }],
    });
    store = TestBed.inject(TodoStore);
    api = TestBed.inject(TodoApi) as unknown as MockTodoApi;
  });

  describe('load', () => {
    it('should set loading to true while request is in flight', async () => {
      const pending = store.load();

      expect(store.loading()).toBe(true);
      await pending;
      expect(store.loading()).toBe(false);
    });

    it('should populate todos from the API', async () => {
      await store.load();

      expect(store.todos()).toEqual(mockTodos);
    });

    it('should set error if the API fails', async () => {
      api.getAll.mockReturnValueOnce(throwError(() => new HttpErrorResponse({ status: 500 })));

      await store.load();

      expect(store.error()).toBe('Something went wrong');
      expect(store.todos()).toEqual([]);
    });

    it('should clear error on success', async () => {
      api.getAll.mockReturnValueOnce(throwError(() => new HttpErrorResponse({ status: 500 })));
      await store.load();

      await store.load();

      expect(store.error()).toBeNull();
    });
  });

  describe('add', () => {
    beforeEach(async () => {
      await store.load();
    });

    it('should set saving to true while request is in flight', async () => {
      const pending = store.add('Write test');

      expect(store.saving()).toBe(true);
      await pending;
      expect(store.saving()).toBe(false);
    });

    it('should add the new todo to the list and resolve ok on success', async () => {
      const expected = [...mockTodos, createTodo({ id: '4', title: 'Write a fourth test' })];

      const result = await store.add('Write a fourth test');

      expect(result).toEqual({ ok: true });
      expect(store.todos()).toEqual(expected);
    });

    it('should set error if the API fails', async () => {
      api.create.mockReturnValueOnce(throwError(() => new HttpErrorResponse({ status: 500 })));

      const result = await store.add('Write a fourth test');

      expect(result).toEqual({ ok: false, inputError: null });
      expect(store.error()).toBe('Something went wrong');
    });

    it('should clear error on success', async () => {
      api.create.mockReturnValueOnce(throwError(() => new HttpErrorResponse({ status: 500 })));
      await store.add('Write a fourth test');

      await store.add('Write a fifth test');

      expect(store.error()).toBeNull();
    });
  });

  describe('remove', () => {
    beforeEach(async () => {
      await store.load();
    });

    it('should set removing to true while request is in flight', async () => {
      const pending = store.remove('1');

      expect(store.removing()).toEqual(new Set(['1']));
      await pending;
      expect(store.removing()).toEqual(new Set());
    });

    it('should remove the todo from the list on success', async () => {
      const expected = mockTodos.filter((todo) => todo.id !== '1');

      await store.remove('1');

      expect(store.todos()).toEqual(expected);
    });

    it('should set error if the API fails', async () => {
      api.remove.mockReturnValueOnce(throwError(() => new HttpErrorResponse({ status: 500 })));

      await store.remove('1');

      expect(store.error()).toBe('Something went wrong');
      expect(store.todos()).toEqual(mockTodos);
    });

    it('should clear error on success', async () => {
      api.remove.mockReturnValueOnce(throwError(() => new HttpErrorResponse({ status: 500 })));
      await store.remove('1');

      await store.remove('2');

      expect(store.error()).toBeNull();
    });
  });
});
