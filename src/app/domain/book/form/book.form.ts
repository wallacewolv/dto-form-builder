import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

import { createFormGroupFromDto } from '../../../core/utils/generators/form.generator';
import { CreateBookDto } from '../dto/book.dto';

export class BookForm extends FormGroup {
  constructor(
    data: Partial<CreateBookDto> = {},
    mode: 'create' | 'edit' = 'create',
  ) {
    const defaults: Partial<CreateBookDto> = {
      title: '',
      author: '',
      price: 0,
      publishedDate: new Date().toISOString().substring(0, 10),
      genres: [],
      available: true,
    };

    const editableFields: (keyof CreateBookDto)[] = [
      'title',
      'author',
      'price',
      'publishedDate',
      'genres',
      'available',
    ];

    const group = createFormGroupFromDto<CreateBookDto>(
      { ...defaults, ...data },
      {
        editableFields: mode === 'edit' ? editableFields : undefined,
        requiredFields: ['title', 'author', 'price'],
        customValidators: {
          title: [Validators.maxLength(200)],
          price: [Validators.min(0)],
        },
      },
    );

    super(group.controls);
  }

  toDto(): CreateBookDto {
    const raw = this.getRawValue();
    return {
      ...raw,
      genres: this.getGenres().value,
    };
  }

  getGenres(): FormArray {
    return this.get('genres') as FormArray;
  }

  addGenre(): void {
    this.getGenres().push(new FormControl(''));
  }
}
