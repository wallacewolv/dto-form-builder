import { BookForm } from './book.form';

describe('BookForm', () => {
  it('should create the form', () => {
    const form = new BookForm();
    expect(form).toBeTruthy();
  });

  it('should initialize with default values', () => {
    const form = new BookForm();
    expect(form.value.title).toBe('');
    expect(form.value.author).toBe('');
    expect(form.value.price).toBe(0);
    expect(form.value.publishedDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(form.value.genres).toEqual([]);
    expect(form.value.available).toBeTrue();
  });

  it('should initialize with provided data', () => {
    const form = new BookForm({
      title: 'Test Book',
      author: 'Author',
      price: 10,
      publishedDate: '2023-01-01',
      genres: ['Fiction'],
      available: false,
    });
    expect(form.value.title).toBe('Test Book');
    expect(form.value.author).toBe('Author');
    expect(form.value.price).toBe(10);
    expect(form.value.publishedDate).toBe('2023-01-01');
    expect(form.value.genres).toEqual(['Fiction']);
    expect(form.value.available).toBeFalse();
  });

  it('should validate required fields', () => {
    const form = new BookForm({});
    form.get('title')?.setValue('');
    form.get('author')?.setValue('');
    form.get('price')?.setValue(null);
    expect(form.get('title')?.valid).toBeFalse();
    expect(form.get('author')?.valid).toBeFalse();
    expect(form.get('price')?.valid).toBeFalse();
  });

  it('should apply custom validators', () => {
    const form = new BookForm();
    form.get('title')?.setValue('a'.repeat(201));
    expect(form.get('title')?.valid).toBeFalse();
    form.get('price')?.setValue(-5);
    expect(form.get('price')?.valid).toBeFalse();
  });

  it('should return correct dto from toDto()', () => {
    const data = {
      title: 'Book',
      author: 'Author',
      price: 15,
      publishedDate: '2023-01-01',
      genres: ['Drama'],
      available: true,
    };
    const form = new BookForm(data);
    expect(form.toDto()).toEqual(data);
  });

  it('should get genres as FormArray', () => {
    const form = new BookForm({ genres: ['A', 'B'] });
    const genres = form.getGenres();
    expect(genres.length).toBe(2);
    expect(genres.at(0).value).toBe('A');
    expect(genres.at(1).value).toBe('B');
  });

  it('should add a genre', () => {
    const form = new BookForm();
    expect(form.getGenres().length).toBe(0);
    form.addGenre();
    expect(form.getGenres().length).toBe(1);
    expect(form.getGenres().at(0).value).toBe('');
  });
});
