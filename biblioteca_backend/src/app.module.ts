// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { BooksModule } from './books/books.module';
// import { Book } from './books/book.entity';

// @Module({
//   imports: [
//     TypeOrmModule.forRoot({
//       type: 'postgres',
//       host: process.env.DATABASE_HOST,
//       port: parseInt(process.env.DATABASE_PORT || '5432'),
//       username: process.env.DATABASE_USER,
//       password: process.env.DATABASE_PASSWORD,
//       database: process.env.DATABASE_NAME,
//       entities: [Book],
//       synchronize: true,
//       autoLoadEntities: true,
//     }),
//     BooksModule,
//   ],
//   controllers: [],
//   providers: [],
// })
// export class AppModule {}




import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BooksModule } from './books/books.module';
import { Book } from './books/book.entity';
import { RedisCacheModule } from './cache/cache.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',

        host: configService.get<string>('DATABASE_HOST'),

        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),

        entities: [Book],
        synchronize: true,
        autoLoadEntities: true,
      }),
    }),

    BooksModule,
    RedisCacheModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
