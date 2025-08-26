import {
  FormGroup,
  Validators,
  FormControl,
  FormArray,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';

import { createFormGroupFromDto } from '../../../core/utils/generators/form.generator';
import { CreateMovieDto } from '../dto/movie.dto';

export class MovieForm extends FormGroup {
  static readonly GENRES = [
    'Ação',
    'Comédia',
    'Drama',
    'Ficção Científica',
    'Romance',
    'Terror',
    'Animação',
    'Documentário',
  ];

  constructor(
    data: Partial<CreateMovieDto> = {},
    mode: 'create' | 'edit' = 'create',
  ) {
    const defaults: CreateMovieDto = {
      title: '',
      genres: [],
      details: '',
      releaseDate: new Date().toISOString().substring(0, 10),
      isFavorite: false,
      comments: [],
      startDate: '',
      endDate: '',
    };

    const editableFields: (keyof CreateMovieDto)[] = [
      'title',
      'genres',
      'details',
      'releaseDate',
      'isFavorite',
      'comments',
    ];

    const group = createFormGroupFromDto<any>(
      { ...defaults, ...data },
      {
        editableFields: mode === 'edit' ? editableFields : undefined,
        requiredFields: [
          'title',
          'genres',
          'details',
          'releaseDate',
          'startDate',
          'endDate',
        ],
        customValidators: {
          title: [Validators.maxLength(150)],
        },
      },
    );

    group.setControl(
      'genres',
      new FormArray(
        MovieForm.GENRES.map(
          (genre) => new FormControl((data.genres || []).includes(genre)),
        ),
        [atLeastOneGenreValidator],
      ),
    );

    super(group.controls, { validators: [dateRangeValidator()] });
  }

  toDto(): CreateMovieDto {
    const raw = this.getRawValue();
    return {
      ...raw,
      genres: this.getSelectedGenres(),
    };
  }

  getSelectedGenres(): string[] {
    return MovieForm.GENRES.filter(
      (_, index) => (this.get('genres') as FormArray).at(index).value,
    );
  }

  getComments(): FormArray {
    return this.get('comments') as FormArray;
  }

  addComment(): void {
    this.getComments().push(new FormControl(''));
  }
}

export function atLeastOneGenreValidator(formArray: AbstractControl) {
  return (formArray as FormArray).controls.some((control) => control.value)
    ? null
    : { required: true };
}

export function dateRangeValidator(): ValidatorFn {
  return (group: AbstractControl) => {
    const start = group.get('startDate')?.value;
    const end = group.get('endDate')?.value;
    if (start && end && start > end) {
      return { dateRange: true };
    }
    return null;
  };
}
