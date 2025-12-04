import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  title: string;

  @Column({ length: 255 })
  author: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ unique: true, length: 20 })
  isbn: string;

  @Column({ type: 'int' })
  publication_year: number;

  // Campo para exclusão lógica (Soft Delete)
  @Column({ type: 'boolean', default: false, name: 'is_deleted' })
  isDeleted: boolean;
}
