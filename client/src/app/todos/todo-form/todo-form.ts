import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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

  cancelled = output<void>();

  private titleInput = viewChild.required<ElementRef<HTMLTextAreaElement>>('titleInput');

  protected form = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, notBlank, Validators.maxLength(titleMaxLength)],
    }),
  });
  protected titleMaxLength = titleMaxLength;
  protected saving = this.store.saving;
  protected submitted = signal(false);

  constructor() {
    // Errors only show for a submit attempt, editing clears them until the next one
    this.title.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => this.submitted.set(false));
  }

  focus(): void {
    this.titleInput().nativeElement.focus();
  }

  protected get title(): FormControl<string> {
    return this.form.controls.title;
  }

  protected async submit(): Promise<void> {
    if (this.saving()) {
      return;
    }

    this.submitted.set(true);
    this.focus();
    if (this.form.invalid) {
      return;
    }

    const added = await this.store.add(this.title.value.trim());
    if (added) {
      this.form.reset();
    }
  }

  protected cancel(): void {
    this.cancelled.emit();
  }
}
