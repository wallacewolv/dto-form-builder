import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { ReactiveFormsModule, FormArray, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { BookFormService } from '../../core/services/book-form.service';
import { CreateBookDto } from '../../domain/book/dto/book.dto';

@Component({
  selector: 'app-book-edit',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatButtonModule,
  ],
  templateUrl: './book-form.html',
  styleUrl: './book.component.scss',
  providers: [BookFormService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookEditComponent {
  bookData = input.required<Partial<CreateBookDto>>();

  private bookFormService = inject(BookFormService);

  // O computed reage automaticamente ao valor do input `bookData`
  // e recria o formulário.
  form = computed(() =>
    this.bookFormService.buildForm(this.bookData(), 'edit'),
  );

  pageTitle = computed(() => `Editando: ${this.bookData().title}`);

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
      console.log('Atualizando livro:', bookDto);
      // Lógica para enviar para a API de atualização
    } else {
      this.form().markAllAsTouched();
    }
  }
}
