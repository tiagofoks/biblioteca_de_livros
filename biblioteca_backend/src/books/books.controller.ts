import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  // POST /books -> Cadastrar um novo livro
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto);
  }

  // GET /books -> Listar todos os livros VÍSIVEIS
  @Get()
  findAll(@Query('search') search?: string) {
    return this.booksService.findAll(search);
  }

  // GET /books/:id -> Consultar detalhes de um livro VÍSIVEL
  @Get(':id')
  findOne(@Param('id') id: string) {
    // Esta rota implementará a 'Página de detalhes' (descrição)
    return this.booksService.findOne(id);
  }

  // PATCH /books/:id -> Alterar informações
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    // O front-end usará esta rota para a opção 'Edição' na Página de Detalhes
    return this.booksService.update(id, updateBookDto);
  }

  // DELETE /books/:id -> Excluir LÓGICAMENTE
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    // O front-end usará esta rota para a opção 'Exclusão' na Página de Detalhes
    return this.booksService.remove(id);
  }
}
