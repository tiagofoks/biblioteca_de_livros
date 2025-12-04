import axios from 'axios';
import { Book, BookApiDto } from '@/types/Book';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {

  async getBooks(search?: string): Promise<Book[]> {
    const params = search ? { search } : {};
    try {
    
      const response = await api.get<Book[]>('/books', { params });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar livros:", error);
      throw error;
    }
  },

  async createBook(data: BookApiDto): Promise<Book> {
    const response = await api.post<Book>('/books', data);
    return response.data;
  },

  async softDeleteBook(id: string): Promise<void> {
    await api.delete(`/books/${id}`);
  },

  async getBookById(id: string): Promise<Book> {
    const response = await api.get<Book>(`/books/${id}`);
    return response.data;
  },

  async updateBook(id: string, data: Partial<BookApiDto>): Promise<Book> {
    const response = await api.patch<Book>(`/books/${id}`, data);
    return response.data;
  },
  

};

export default api;
