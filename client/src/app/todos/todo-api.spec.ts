import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../environments/environment';
import { createTodo } from './models/todo.factory';
import { TodoResponse } from './models/todo-response';
import { TodoApi } from './todo-api';

describe('TodoApi', () => {
  const url = `${environment.apiBaseUrl}/todos`;
  const response: TodoResponse = {
    id: '1',
    title: 'Write test',
    createdAt: '2026-01-01T00:01:00Z',
  };
  let api: TodoApi;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    api = TestBed.inject(TodoApi);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  describe('getAll', () => {
    it('should get all todos', async () => {
      const pending = firstValueFrom(api.getAll());

      http.expectOne({ method: 'GET', url }).flush([response]);

      expect(await pending).toEqual([createTodo()]);
    });
  });

  describe('create', () => {
    it('should create a todo', async () => {
      const pending = firstValueFrom(api.create('Write test'));

      const request = http.expectOne({ method: 'POST', url });
      request.flush(response);

      expect(request.request.body).toEqual({ title: 'Write test' });
      expect(await pending).toEqual(createTodo());
    });
  });

  describe('remove', () => {
    it('should delete a todo by id', async () => {
      const pending = firstValueFrom(api.remove('1'));

      http.expectOne({ method: 'DELETE', url: `${url}/1` }).flush(null);

      await expect(pending).resolves.toBeNull();
    });
  });
});
