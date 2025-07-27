export interface CreateMovieDto {
  title: string;
  genres: string[];
  details: string;
  releaseDate: string;
  isFavorite: boolean;
  comments: string[];
  startDate: string;
  endDate: string;
}
