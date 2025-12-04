import {
  IsNotEmpty,
  IsString,
  IsInt,
  Min,
  Max,
  IsOptional,
} from 'class-validator';

export class CreateBookDto {
  @IsNotEmpty({ message: 'O título é obrigatório.' })
  @IsString()
  title: string;

  @IsNotEmpty({ message: 'O autor é obrigatório.' })
  @IsString()
  author: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty({ message: 'O ISBN é obrigatório.' })
  @IsString()
  isbn: string;

  @IsNotEmpty({ message: 'O ano de publicação é obrigatório.' })
  @IsInt()
  @Min(1000)
  @Max(new Date().getFullYear())
  publication_year: number;
}
