import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { ReactiveFormsModule, FormArray, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { BookFormService } from '../../core/services/book-form.service';

@Component({
  selector: 'app-book-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatButtonModule,
  ],
  templateUrl: './book-form.html', // Reutilizaremos o mesmo HTML
  styleUrl: './book.component.scss',
  providers: [BookFormService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookCreateComponent {
  private bookFormService = inject(BookFormService);

  // O formulário é construído explicitamente no modo 'create'
  form = signal(this.bookFormService.buildForm({}, 'create'));

  pageTitle = signal<string>('Cadastrar Novo Livro');

  get genres(): FormArray<FormControl<string>> {
    return this.form().controls.genres;
  }

  addGenre(): void {
    this.bookFormService.addGenre(this.genres);
  }

  onSubmit(): void {
    if (this.form().valid) {
      const bookDto = this.bookFormService.toDto(this.form());
      // eslint-disable-next-line no-console
      console.log('Criando novo livro:', bookDto);
      // Lógica para enviar para a API de criação
    } else {
      this.form().markAllAsTouched();
    }
  }
}
