import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { throwError } from 'rxjs';

import { titleMaxLength } from '../models/todo';
import { TodoApi } from '../todo-api';
import { MockTodoApi } from '../todo-api.mock';
import { TodoForm } from './todo-form';

describe('TodoForm', () => {
  let component: TodoForm;
  let fixture: ComponentFixture<TodoForm>;
  let element: HTMLElement;
  let textarea: HTMLTextAreaElement;
  let api: MockTodoApi;

  const alertText = () => element.querySelector('[role="alert"]')?.textContent?.trim();

  const submit = async () => {
    element.querySelector<HTMLButtonElement>('button[type="submit"]')?.click();
    await fixture.whenStable();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoForm],
      providers: [{ provide: TodoApi, useClass: MockTodoApi }],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoForm);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    textarea = element.querySelector('textarea') as HTMLTextAreaElement;
    api = TestBed.inject(TodoApi) as unknown as MockTodoApi;
    await fixture.whenStable();
  });

  it('should focus the textarea when focus is called', () => {
    component.focus();

    expect(document.activeElement).toBe(textarea);
  });

  it('should show the required message and not call the API when submitted empty', async () => {
    await submit();

    expect(alertText()).toBe('Your todo needs a title');
    expect(api.create).not.toHaveBeenCalled();
  });

  it('should show the not blank message and not call the API when submitted with only whitespace', async () => {
    textarea.value = '   ';
    textarea.dispatchEvent(new Event('input'));
    await fixture.whenStable();

    await submit();

    expect(alertText()).toBe('Your todo needs a title');
    expect(api.create).not.toHaveBeenCalled();
  });

  it('should show the max length message and not call the API when submitted with a title that is too long', async () => {
    textarea.value = 'a'.repeat(titleMaxLength + 1);
    textarea.dispatchEvent(new Event('input'));
    await fixture.whenStable();

    await submit();

    expect(alertText()).toBe(`Keep your todo title to ${titleMaxLength} characters or fewer`);
    expect(api.create).not.toHaveBeenCalled();
  });

  it('should call the API and reset the form when submitted with a valid title', async () => {
    const title = 'Write test';
    textarea.value = title;
    textarea.dispatchEvent(new Event('input'));
    await fixture.whenStable();

    await submit();

    expect(api.create).toHaveBeenCalledWith(title);
    expect(textarea.value).toBe('');
  });

  it.each([
    [400, 'That title is not valid'],
    [409, 'A todo with that title already exists'],
  ])('should display the input error and keep the title for %i', async (status, message) => {
    api.create.mockReturnValueOnce(throwError(() => new HttpErrorResponse({ status })));
    textarea.value = 'Write test';
    textarea.dispatchEvent(new Event('input'));
    await fixture.whenStable();

    await submit();

    expect(alertText()).toBe(message);
    expect(textarea.value).toBe('Write test');
  });
});
