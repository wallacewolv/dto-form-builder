import { FormArray } from '@angular/forms';

import { MovieForm } from './movie.form';

describe('MovieForm', () => {
  it('should create the form', () => {
    const form = new MovieForm();
    expect(form).toBeTruthy();
  });

  describe('MovieForm', () => {
    it('should create an instance with default values', () => {
      const form = new MovieForm();
      expect(form).toBeTruthy();
      expect(form.value.title).toBe('');
      expect(form.value.genres.length).toBe(MovieForm.GENRES.length);
      expect(form.value.details).toBe('');
      expect(form.value.isFavorite).toBe(false);
      expect(form.value.comments).toEqual([]);
    });

    it('should initialize with provided data', () => {
      const data = {
        title: 'Test Movie',
        genres: ['Ação', 'Drama'],
        details: 'Some details',
        releaseDate: '2024-01-01',
        isFavorite: true,
        comments: ['Great!'],
        startDate: '2024-01-01',
        endDate: '2024-01-02',
      };
      const form = new MovieForm(data);
      expect(form.value.title).toBe('Test Movie');
      expect(form.getSelectedGenres()).toEqual(['Ação', 'Drama']);
      expect(form.value.details).toBe('Some details');
      expect(form.value.isFavorite).toBe(true);
      expect(form.value.comments).toEqual(['Great!']);
    });

    it('should validate at least one genre is selected', () => {
      const form = new MovieForm();
      const genresArray = form.get('genres') as FormArray;
      genresArray.controls.forEach((ctrl) => ctrl.setValue(false));
      expect(genresArray.valid).toBeFalse();
      genresArray.at(0).setValue(true);
      expect(genresArray.valid).toBeTrue();
    });

    it('should validate date range', () => {
      const form = new MovieForm();
      form.get('startDate')?.setValue('2024-01-02');
      form.get('endDate')?.setValue('2024-01-03');
      expect(form.get('startDate')?.valid).toBeTrue();
      expect(form.get('endDate')?.valid).toBeTrue();
    });

    it('should return correct DTO from toDto()', () => {
      const data = {
        title: 'Movie',
        genres: ['Comédia'],
        details: 'Details',
        releaseDate: '2024-01-01',
        isFavorite: false,
        comments: ['Nice'],
        startDate: '2024-01-01',
        endDate: '2024-01-02',
      };
      const form = new MovieForm(data);
      expect(form.toDto()).toEqual(data);
    });

    it('should add a comment using addComment()', () => {
      const form = new MovieForm();
      expect(form.getComments().length).toBe(0);
      form.addComment();
      expect(form.getComments().length).toBe(1);
      expect(form.getComments().at(0).value).toBe('');
    });

    it('getSelectedGenres should return selected genres', () => {
      const form = new MovieForm({ genres: ['Ação', 'Terror'] });
      expect(form.getSelectedGenres()).toEqual(['Ação', 'Terror']);
    });
  });
});
