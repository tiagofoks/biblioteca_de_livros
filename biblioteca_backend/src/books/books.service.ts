import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Book } from './book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(createBookDto: CreateBookDto): Promise<Book> {
    const newBook = this.booksRepository.create(createBookDto);
    const book = await this.booksRepository.save(newBook);

    await this.cacheManager.del('all_books');

    return book;
  }

  async findAll(search?: string): Promise<Book[]> {
    if (!search) {
      const cachedBooks = await this.cacheManager.get<Book[]>('all_books');
      if (cachedBooks) {
        console.log('Dados de todos os livros recuperados do cache (Redis)');
        return cachedBooks;
      }
    }

    const books = await this.booksRepository.find();

    if (!search) {
      await this.cacheManager.set('all_books', books);
      console.log(
        'Dados de todos os livros recuperados do banco e cacheados (PostgreSQL)',
      );
    } else {
      console.log('Busca específica, sem cache.');
    }

    return books;
  }

  async findOne(id: number): Promise<Book> {
    const cacheKey = `book_${id}`;

    const cachedBook = await this.cacheManager.get<Book>(cacheKey);
    if (cachedBook) {
      console.log(`Livro ID ${id} encontrado no cache (Redis)`);
      return cachedBook;
    }

    const whereCondition: FindOptionsWhere<Book> = { id: id.toString() };
    const book = await this.booksRepository.findOne({ where: whereCondition });

    if (!book) {
      throw new NotFoundException(`Livro com ID ${id} não encontrado`);
    }

    await this.cacheManager.set(cacheKey, book);

    console.log(`Livro ID ${id} recuperado do banco (PostgreSQL)`);
    return book;
  }

  async update(id: number, updateBookDto: UpdateBookDto): Promise<Book> {
    const whereCondition: FindOptionsWhere<Book> = { id: id.toString() };
    const book = await this.booksRepository.findOne({ where: whereCondition });

    if (!book) {
      throw new NotFoundException(`Livro com ID ${id} não encontrado`);
    }

    await this.booksRepository.update(id, updateBookDto);

    const updatedBook = await this.booksRepository.findOne({
      where: whereCondition,
    });

    await this.cacheManager.del(`book_${id}`);
    await this.cacheManager.del('all_books');

    if (!updatedBook) {
      throw new NotFoundException(
        `Livro com ID ${id} não encontrado após atualização`,
      );
    }

    return updatedBook;
  }

  async remove(id: number): Promise<void> {
    const result = await this.booksRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Livro com ID ${id} não encontrado`);
    }

    await this.cacheManager.del(`book_${id}`);
    await this.cacheManager.del('all_books');
  }
}
