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

  // 1. CREATE (Cadastrar um novo livro)
  async create(createBookDto: CreateBookDto): Promise<Book> {
    const newBook = this.booksRepository.create(createBookDto);
    return this.booksRepository.save(newBook);
  }

  // 2. READ ALL (Consultar todos os livros VÍSIVEIS)
  async findAll(search?: string): Promise<Book[]> {
    // Busca livros que não foram deletados (isDeleted: false)
    const findOptions: any = {
      where: { isDeleted: false },
    };

    if (search) {
      // Se houver um termo de busca, aplica o filtro OR em Título, Autor e ISBN.
      findOptions.where = [
        { isDeleted: false, title: ILike(`%${search}%`) },
        { isDeleted: false, author: ILike(`%${search}%`) },
        { isDeleted: false, isbn: ILike(`%${search}%`) },
      ];
    }

    return this.booksRepository.find(findOptions);
  }

  // 3. READ ONE (Consultar detalhes de um livro VÍSIVEL)
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

  // 4. UPDATE (Alterar informações de um livro VÍSIVEL)
  async update(id: string, updateBookDto: UpdateBookDto): Promise<Book> {
    // Verifica se o livro existe e está visível antes de atualizar
    const book = await this.findOne(id);

    // O TypeORM mescla o DTO com a entidade existente
    const updatedBook = this.booksRepository.merge(book, updateBookDto);
    return this.booksRepository.save(updatedBook);
  }

  // 5. DELETE (Exclusão LÓGICA - Soft Delete)
  async remove(id: string): Promise<{ message: string }> {
    // 1. Verifica se o livro existe e está visível
    const book = await this.findOne(id);

    // 2. Aciona a flag isDeleted para TRUE
    book.isDeleted = true;
    await this.booksRepository.save(book);

    return {
      message: `Livro com ID "${id}" marcado como excluído (soft deleted).`,
    };
  }
}
