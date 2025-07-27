import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormArray } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { BookForm } from '../../domain/book/form/book.form';

@Component({
  selector: 'app-book',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSlideToggleModule,
  ],
  templateUrl: './book.component.html',
  styleUrl: './book.component.scss',
})
export class BookComponent implements OnInit {
  form!: BookForm;

  ngOnInit(): void {
    this.form = new BookForm({}, 'create');
  }

  get genres(): FormArray {
    return this.form.getGenres();
  }

  onSubmit(): void {
    if (this.form.valid) {
      // eslint-disable-next-line no-console
      console.log(this.form.toDto());
    } else {
      this.form.markAllAsTouched();
    }
  }

  addGenre(): void {
    this.form.addGenre();
  }
}
