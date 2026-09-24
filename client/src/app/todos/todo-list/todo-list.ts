import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { Todo } from '../models/todo';
import { TodoItem } from './todo-item/todo-item';

@Component({
  selector: 'app-todo-list',
  imports: [TodoItem],
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoList {
  todos = input.required<readonly Todo[]>();
  removing = input<ReadonlySet<string>>(new Set());
  remove = output<string>();
}
