import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';

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
  private cdr = inject(ChangeDetectorRef);

  protected store = inject(TodoStore);
  protected adding = signal(false);
  protected form = viewChild(TodoForm);

  ngOnInit(): void {
    void this.store.load();
  }

  // Render and focus the form during the tap so the mobile keyboard opens
  protected openForm(): void {
    this.adding.set(true);
    this.cdr.detectChanges();
    this.form()?.focus();
  }
}
