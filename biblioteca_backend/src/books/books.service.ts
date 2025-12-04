import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Book } from './book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
  ) {}

  async create(createBookDto: CreateBookDto): Promise<Book> {
    const newBook = this.booksRepository.create(createBookDto);
    return this.booksRepository.save(newBook);
  }

  async findAll(search?: string): Promise<Book[]> {
    const findOptions: any = {
      where: { isDeleted: false },
    };

    if (search) {
      findOptions.where = [
        { isDeleted: false, title: ILike(`%${search}%`) },
        { isDeleted: false, author: ILike(`%${search}%`) },
        { isDeleted: false, isbn: ILike(`%${search}%`) },
      ];
    }

    return this.booksRepository.find(findOptions);
  }

  async findOne(id: string): Promise<Book> {
    const book = await this.booksRepository.findOne({
      where: { id, isDeleted: false },
    });

    if (!book) {
      throw new NotFoundException(
        `Livro com ID "${id}" não encontrado ou excluído.`,
      );
    }
    return book;
  }

  async update(id: string, updateBookDto: UpdateBookDto): Promise<Book> {
    const book = await this.findOne(id);

    const updatedBook = this.booksRepository.merge(book, updateBookDto);
    return this.booksRepository.save(updatedBook);
  }

  async remove(id: string): Promise<{ message: string }> {
    const book = await this.findOne(id);

    book.isDeleted = true;
    await this.booksRepository.save(book);

    return {
      message: `Livro com ID "${id}" marcado como excluído (soft deleted).`,
    };
  }
}
