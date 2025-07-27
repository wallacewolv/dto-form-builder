import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { MovieForm } from '../../domain/movie/form/movie.form';

@Component({
  selector: 'app-movie',
  standalone: true,
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatCheckboxModule,
  ],
})
export class MovieComponent implements OnInit {
  form!: MovieForm;
  genres = MovieForm.GENRES;

  ngOnInit(): void {
    this.form = new MovieForm({}, 'create');
    // Garante que genres sempre é array
    if (!this.form.get('genres')?.value) {
      this.form.get('genres')?.setValue([]);
    }
  }

  get comments() {
    return this.form.getComments();
  }

  onSubmit(): void {
    if (this.form.valid) {
      const dto = this.form.toDto();
      dto.genres = this.form.getSelectedGenres();
      // eslint-disable-next-line no-console
      console.log(dto);
    } else {
      this.form.markAllAsTouched();
    }
  }

  addComment(): void {
    this.form.addComment();
  }

  onGenreChange(event: any, genre: string) {
    // Garante que sempre existe um array
    const genres: string[] = this.form.get('genres')?.value || [];
    if (event.checked) {
      if (!genres.includes(genre)) {
        genres.push(genre);
      }
    } else {
      const idx = genres.indexOf(genre);
      if (idx > -1) {
        genres.splice(idx, 1);
      }
    }
    this.form.get('genres')?.setValue([...genres]); // força nova referência
    this.form.get('genres')?.markAsTouched();
  }
}
