import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoList } from './todo-list';
import { mockTodos } from '../models/todo.mock';

describe('TodoList', () => {
  let component: TodoList;
  let fixture: ComponentFixture<TodoList>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoList],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoList);
    fixture.componentRef.setInput('todos', mockTodos);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('should render one item per todo', async () => {
    fixture.componentRef.setInput('todos', mockTodos);
    await fixture.whenStable();

    const items = element.querySelectorAll('app-todo-item');

    expect(items.length).toBe(mockTodos.length);
  });

  it('should emit remove event when an item is removed', async () => {
    fixture.componentRef.setInput('todos', mockTodos);
    await fixture.whenStable();

    const item = element.querySelector('app-todo-item')!;
    const removeButton = item.querySelector('button')!;

    let removedId: string | null = null;
    component.remove.subscribe((id) => (removedId = id));

    removeButton.click();
    await fixture.whenStable();

    expect(removedId).toBe(mockTodos[0].id);
  });

  it('should mark items as removing when their id is in the removing set', async () => {
    fixture.componentRef.setInput('removing', new Set([mockTodos[0].id]));
    await fixture.whenStable();

    const item = element.querySelector('app-todo-item')!;
    const removeButton = item.querySelector('button')!;

    expect(removeButton.getAttribute('aria-busy')).toBe('true');
  });
});
