import { inject, Injectable } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';

import { CreateBookDto } from '../../domain/book/dto/book.dto';

// O tipo do formulário permanece o mesmo
export type BookFormType = FormGroup<{
  title: FormControl<string>;
  author: FormControl<string>;
  price: FormControl<number>;
  publishedDate: FormControl<string>;
  available: FormControl<boolean>;
  genres: FormArray<FormControl<string>>;
}>;

@Injectable()
export class BookFormService {
  private fb = inject(NonNullableFormBuilder);

  buildForm(
    data: Partial<CreateBookDto> = {},
    mode: 'create' | 'edit' = 'create',
  ): BookFormType {
    const defaults: CreateBookDto = {
      title: '',
      author: '',
      price: 0,
      publishedDate: new Date().toISOString().substring(0, 10),
      genres: [],
      available: true,
    };

    const initialData = { ...defaults, ...data };

    const form = this.fb.group({
      title: [
        initialData.title,
        [Validators.required, Validators.maxLength(200)],
      ],
      author: [initialData.author, [Validators.required]],
      price: [initialData.price, [Validators.required, Validators.min(0)]],
      publishedDate: [initialData.publishedDate, [Validators.required]],
      available: [initialData.available],
      genres: this.fb.array(
        initialData.genres.map((genre) => this.fb.control(genre)),
      ),
    });

    // LÓGICA CONDICIONAL APLICADA AQUI
    if (mode === 'edit') {
      // No modo de edição, desabilitamos o campo de data de publicação.
      // É apenas um exemplo de regra de negócio.
      form.controls.publishedDate.disable();
    }

    return form;
  }

  addGenre(genresArray: FormArray<FormControl<string>>): void {
    genresArray.push(this.fb.control(''));
  }

  toDto(form: BookFormType): CreateBookDto {
    return form.getRawValue();
  }
}
