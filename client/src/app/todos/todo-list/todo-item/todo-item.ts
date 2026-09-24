import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { Todo } from '../../models/todo';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.html',
  styleUrl: './todo-item.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoItem {
  todo = input.required<Todo>();
  removing = input(false);
  remove = output<void>();
}
