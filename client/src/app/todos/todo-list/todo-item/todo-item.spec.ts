import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoItem } from './todo-item';
import { createTodo } from '../../models/todo.factory';

describe('TodoItem', () => {
  let component: TodoItem;
  let fixture: ComponentFixture<TodoItem>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoItem],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoItem);
    fixture.componentRef.setInput('todo', createTodo());
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('should render the title', () => {
    expect(element.textContent).toContain('Write test');
  });

  it('should emit a remove event when the delete button is clicked', async () => {
    const remove = vi.fn();
    component.remove.subscribe(remove);

    element.querySelector<HTMLButtonElement>('button')?.click();
    await fixture.whenStable();

    expect(remove).toHaveBeenCalled();
  });

  it('should show the spinner and mark the button busy when removing is true', async () => {
    fixture.componentRef.setInput('removing', true);
    await fixture.whenStable();

    const button = element.querySelector('button');

    expect(button?.querySelector('.spinner')).not.toBeNull();
    expect(button?.getAttribute('aria-busy')).toBe('true');
  });
});
