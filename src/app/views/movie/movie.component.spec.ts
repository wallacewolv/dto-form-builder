import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { MovieComponent } from './movie.component';

describe('MovieComponent', () => {
  let component: MovieComponent;
  let fixture: ComponentFixture<MovieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(MovieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component and form', () => {
    expect(component).toBeTruthy();
    expect(component.form).toBeTruthy();
  });

  it('should initialize genres and genres form control as array', () => {
    expect(component.genres.length).toBeGreaterThan(0);
    expect(Array.isArray(component.form.get('genres')?.value)).toBeTrue();
  });

  it('comments getter should return FormArray', () => {
    const comments = component.comments;
    expect(comments).toBeTruthy();
    expect(typeof comments.length).toBe('number');
  });

  describe('onSubmit', () => {
    it('should log DTO and not mark touched if form valid', () => {
      spyOn(console, 'log');
      spyOn(component.form, 'markAllAsTouched').and.callThrough();

      component.form.get('title')?.setValue('Test');

      const bools = new Array(component.genres.length).fill(false);
      bools[component.genres.indexOf('Ação')] = true;
      component.form.get('genres')?.setValue(bools);

      component.form.get('details')?.setValue('details');
      component.form.get('releaseDate')?.setValue('2024-01-01');
      component.form.get('startDate')?.setValue('2024-01-01');
      component.form.get('endDate')?.setValue('2024-01-02');

      component.onSubmit();

      expect(component.form.markAllAsTouched).not.toHaveBeenCalled();
    });

    it('should mark all controls as touched if form invalid', () => {
      spyOn(component.form, 'markAllAsTouched').and.callThrough();

      component.form.get('title')?.setValue('');
      const bools = new Array(component.genres.length).fill(false);
      component.form.get('genres')?.setValue(bools);
      component.form.get('details')?.setValue('');
      component.form.get('releaseDate')?.setValue('');
      component.form.get('startDate')?.setValue('');
      component.form.get('endDate')?.setValue('');

      component.onSubmit();

      expect(component.form.markAllAsTouched).toHaveBeenCalled();
    });
  });

  it('should add a new comment on addComment()', () => {
    const initialCount = component.comments.length;
    component.addComment();
    expect(component.comments.length).toBe(initialCount + 1);
    expect(component.comments.at(component.comments.length - 1).value).toBe('');
  });

  describe('onGenreChange', () => {
    it('should add genre to form genres array when checked', () => {
      const genresArray = component.form.get('genres') as FormArray;
      const bools = new Array(component.genres.length).fill(false);
      genresArray.setValue(bools);

      component.onGenreChange({ checked: true }, 'Ação');

      expect(genresArray.at(component.genres.indexOf('Ação')).value).toBeTrue();
    });

    it('should remove genre from form genres array when unchecked', () => {
      const genresArray = component.form.get('genres') as FormArray;
      const bools = new Array(component.genres.length).fill(false);
      bools[component.genres.indexOf('Ação')] = true;
      bools[component.genres.indexOf('Drama')] = true;
      genresArray.setValue(bools);

      component.onGenreChange({ checked: false }, 'Ação');

      expect(
        genresArray.at(component.genres.indexOf('Ação')).value,
      ).toBeFalse();
      expect(
        genresArray.at(component.genres.indexOf('Drama')).value,
      ).toBeTrue();
    });

    it('should not add duplicate genres', () => {
      const genresArray = component.form.get('genres') as FormArray;
      const bools = new Array(component.genres.length).fill(false);
      bools[component.genres.indexOf('Drama')] = true;
      genresArray.setValue(bools);

      component.onGenreChange({ checked: true }, 'Drama');

      const genresValue = genresArray.value.filter((v: any) => v === true);
      expect(genresValue.length).toBe(1);
    });
  });
});
