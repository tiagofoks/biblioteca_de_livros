import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,

        host: configService.get<string>('REDIS_HOST'),

        port: configService.get<number>('REDIS_PORT'),

        ttl: 60 * 5,
      }),
    }),
  ],

  exports: [CacheModule],
})
export class RedisCacheModule {}
