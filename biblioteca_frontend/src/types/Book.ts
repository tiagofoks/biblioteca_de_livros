export interface Book {
  id: string;
  title: string;
  author: string;
  description?: string; 
  isbn: string;
  publication_year: number; 
  isDeleted: boolean; 
}
export type BookApiDto = Omit<Book, 'id' | 'isDeleted'>;
export type CreateBookDto = Omit<Book, 'id' | 'isDeleted'>;