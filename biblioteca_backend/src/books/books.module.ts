import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { Book } from './book.entity';
import { RedisCacheModule } from '../cache/cache.module';

@Module({
  imports: [TypeOrmModule.forFeature([Book]), RedisCacheModule],
  controllers: [BooksController],
  providers: [BooksService],
  exports: [BooksService],
})
export class BooksModule {}
