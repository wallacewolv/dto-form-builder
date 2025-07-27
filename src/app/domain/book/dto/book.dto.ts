export interface CreateBookDto {
  title: string;
  author: string;
  price: number;
  publishedDate: string;
  genres: string[];
  available: boolean;
}
