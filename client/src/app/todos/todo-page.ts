import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';

import { TodoForm } from './todo-form/todo-form';
import { TodoList } from './todo-list/todo-list';
import { TodoStore } from './todo-store';

@Component({
  selector: 'app-todo-page',
  imports: [TodoForm, TodoList],
  templateUrl: './todo-page.html',
  styleUrl: './todo-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoPage implements OnInit {
  protected store = inject(TodoStore);

  ngOnInit(): void {
    void this.store.load();
  }
}
