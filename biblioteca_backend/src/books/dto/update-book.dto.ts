import { PartialType } from '@nestjs/mapped-types';
import { CreateBookDto } from './create-book.dto';

// PartialType torna todos os campos de CreateBookDto opcionais
export class UpdateBookDto extends PartialType(CreateBookDto) {}
