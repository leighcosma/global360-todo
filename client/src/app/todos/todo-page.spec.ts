import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject, throwError } from 'rxjs';

import { mockTodos } from './models/todo.mock';
import { TodoApi } from './todo-api';
import { MockTodoApi } from './todo-api.mock';
import { TodoPage } from './todo-page';

describe('TodoPage', () => {
  let fixture: ComponentFixture<TodoPage>;
  let element: HTMLElement;
  let api: MockTodoApi;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoPage],
      providers: [{ provide: TodoApi, useClass: MockTodoApi }],
    }).compileComponents();

    api = TestBed.inject(TodoApi) as unknown as MockTodoApi;
  });

  const render = async () => {
    fixture = TestBed.createComponent(TodoPage);
    element = fixture.nativeElement;
    await fixture.whenStable();
  };

  it('should show loading spinner before todos are loaded', async () => {
    api.getAll.mockReturnValueOnce(new Subject());

    await render();

    const spinner = element.querySelector('.spinner');
    expect(spinner).not.toBeNull();
  });

  it('should render the list once loaded', async () => {
    await render();

    expect(element.querySelector('[aria-live="polite"]')).toBeNull();
    expect(element.querySelectorAll('app-todo-item')).toHaveLength(mockTodos.length);
  });

  it('should show an error message if the API fails', async () => {
    api.getAll.mockReturnValueOnce(throwError(() => new HttpErrorResponse({ status: 500 })));

    await render();

    const alert = element.querySelector('[role="alert"]');
    expect(alert).not.toBeNull();
    expect(alert?.textContent).toContain('Something went wrong. Please try again.');
  });

  it('should open the form when the add button is clicked', async () => {
    await render();

    const addButton = element.querySelector<HTMLButtonElement>('.add');
    addButton?.click();
    await fixture.whenStable();

    expect(element.querySelector('app-todo-form')).not.toBeNull();
  });

  it('should close the form when the cancel button is clicked', async () => {
    await render();
    const addButton = element.querySelector<HTMLButtonElement>('.add');
    addButton?.click();
    await fixture.whenStable();

    const cancelButton = element.querySelector<HTMLButtonElement>('.cancel');
    cancelButton?.click();
    await fixture.whenStable();

    expect(element.querySelector('app-todo-form')).toBeNull();
  });
});
