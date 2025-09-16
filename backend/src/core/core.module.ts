import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import configuration from './config/config';
import { validationSchema } from './config/config.schema';

@Module({
  imports:, // 커스텀 설정 파일 로드
      validationSchema, // Joi를 사용한 환경 변수 유효성 검사
    }),

    // 2. 데이터베이스 연결 (TypeORM)
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject:,
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.database'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'], // 엔티티 자동 로드
        synchronize: true, // 개발용: true, 프로덕션에서는 false로 하고 마이그레이션 사용
      }),
    }),

    // 3. 비동기 큐 연결 (Bull)
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject:,
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('redis.host'),
          port: configService.get<number>('redis.port'),
        },
      }),
    }),
  ],
})
export class CoreModule {}