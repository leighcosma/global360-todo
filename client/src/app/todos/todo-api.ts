import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { CreateTodoRequest } from './models/create-todo-request';
import { Todo } from './models/todo';
import { TodoResponse } from './models/todo-response';
import { processTodoResponse } from './todo-api.transform';

@Injectable({ providedIn: 'root' })
export class TodoApi {
  private http = inject(HttpClient);
  private url = `${environment.apiBaseUrl}/todos`;

  getAll(): Observable<Todo[]> {
    return this.http
      .get<TodoResponse[]>(this.url)
      .pipe(map((todos) => todos.map(processTodoResponse)));
  }

  create(title: string): Observable<Todo> {
    const body: CreateTodoRequest = { title };

    return this.http.post<TodoResponse>(this.url, body).pipe(map(processTodoResponse));
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
