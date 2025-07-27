import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'books',
    loadComponent: () =>
      import('./views/book/book.component').then((m) => m.BookComponent),
  },
  {
    path: 'movies',
    loadComponent() {
      return import('./views/movie/movie.component').then(
        (m) => m.MovieComponent,
      );
    },
  },
  { path: '', redirectTo: 'books', pathMatch: 'full' },
];
