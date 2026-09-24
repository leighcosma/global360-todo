import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { titleMaxLength } from '../models/todo';
import { TodoStore } from '../todo-store';
import { notBlank } from './todo-form.logic';

@Component({
  selector: 'app-todo-form',
  imports: [ReactiveFormsModule],
  templateUrl: './todo-form.html',
  styleUrl: './todo-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoForm {
  private store = inject(TodoStore);

  protected titleInput = viewChild.required<ElementRef<HTMLInputElement>>('titleInput');

  protected form = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, notBlank, Validators.maxLength(titleMaxLength)],
    }),
  });
  protected titleMaxLength = titleMaxLength;
  protected saving = this.store.saving;
  protected submitted = signal(false);

  protected get title(): FormControl<string> {
    return this.form.controls.title;
  }

  protected async submit(): Promise<void> {
    if (this.saving()) {
      return;
    }

    this.submitted.set(true);
    this.focusTitle();
    if (this.form.invalid) {
      return;
    }

    const added = await this.store.add(this.title.value.trim());
    if (added) {
      this.form.reset();
      this.submitted.set(false);
    }
  }

  private focusTitle(): void {
    this.titleInput().nativeElement.focus();
  }
}
