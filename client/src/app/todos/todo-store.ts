import { HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { Todo } from './models/todo';
import { TodoApi } from './todo-api';

@Injectable({ providedIn: 'root' })
export class TodoStore {
  private api = inject(TodoApi);

  private todosState = signal<readonly Todo[]>([]);
  private loadingState = signal(false);
  private savingState = signal(false);
  private removingState = signal<ReadonlySet<string>>(new Set());
  private errorState = signal<string | null>(null);

  todos = this.todosState.asReadonly();
  loading = this.loadingState.asReadonly();
  saving = this.savingState.asReadonly();
  removing = this.removingState.asReadonly();
  error = this.errorState.asReadonly();
  isEmpty = computed(() => !this.loading() && this.todos().length === 0);

  async load(): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      this.todosState.set(await firstValueFrom(this.api.getAll()));
    } catch (error) {
      this.errorState.set(messageOf(error));
    } finally {
      this.loadingState.set(false);
    }
  }

  // Resolves true on success so the form knows when to clear itself
  async add(title: string): Promise<boolean> {
    this.savingState.set(true);
    this.errorState.set(null);

    try {
      const todo = await firstValueFrom(this.api.create(title));
      this.todosState.update((todos) => [...todos, todo]);
      return true;
    } catch (error) {
      this.errorState.set(messageOf(error));
      return false;
    } finally {
      this.savingState.set(false);
    }
  }

  // Pessimistic: the item stays in the list until the API confirms
  async remove(id: string): Promise<void> {
    this.setRemoving(id, true);
    this.errorState.set(null);

    try {
      await firstValueFrom(this.api.remove(id));
      this.todosState.update((todos) => todos.filter((todo) => todo.id !== id));
    } catch (error) {
      this.errorState.set(messageOf(error));
    } finally {
      this.setRemoving(id, false);
    }
  }

  private setRemoving(id: string, inFlight: boolean): void {
    this.removingState.update((ids) => {
      const next = new Set(ids);
      if (inFlight) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  }
}

function messageOf(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    if (error.status === 0) {
      return 'Could not reach the server.';
    }
    if (error.status === 400) {
      return 'That title is not valid.';
    }
    if (error.status === 404) {
      return 'That item no longer exists.';
    }
  }

  return 'Something went wrong. Please try again.';
}
