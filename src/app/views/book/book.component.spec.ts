import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { BookForm } from '../../domain/book/form/book.form';
import { BookComponent } from './book.component';

describe('BookComponent', () => {
  let component: BookComponent;
  let fixture: ComponentFixture<BookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(BookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form as BookForm instance', () => {
    expect(component.form).toBeTruthy();
    expect(component.form instanceof BookForm).toBeTrue();
  });

  it('getter genres should return FormArray from form', () => {
    const genres = component.genres;
    expect(genres).toBeTruthy();
    expect(genres.length).toBe(component.form.getGenres().length);
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      spyOn(console, 'log');
      spyOn(component.form, 'markAllAsTouched');
    });

    it('should log dto when form is valid', () => {
      spyOnProperty(component.form, 'valid', 'get').and.returnValue(true);
      component.onSubmit();
      expect(component.form.markAllAsTouched).not.toHaveBeenCalled();
    });

    it('should mark all as touched when form is invalid', () => {
      spyOnProperty(component.form, 'valid', 'get').and.returnValue(false);
      component.onSubmit();
      expect(component.form.markAllAsTouched).toHaveBeenCalled();
    });
  });

  it('addGenre should add a genre control to the form', () => {
    const initialLength = component.genres.length;
    component.addGenre();
    expect(component.genres.length).toBe(initialLength + 1);
    expect(component.genres.at(component.genres.length - 1).value).toBe('');
  });
});
