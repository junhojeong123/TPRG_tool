import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { VttController } from './vtt.controller';
import { VttService } from './vtt.service';
import { VttRepository } from './vtt.repository';
import { Vtt } from './entities/vtt.entity';
import { VttCue } from './entities/vtt-cue.entity';
import { VttProcessor } from './vtt.processor';

@Module({
  imports:),
    // 'vtt-parsing'이라는 이름의 큐를 등록합니다.
    // 이 이름은 서비스에서 큐를 주입받을 때와 프로세서에서 작업을 수신할 때 사용됩니다.
    BullModule.registerQueue({
      name: 'vtt-parsing',
    }),
  ],
  controllers: [VttController],
  // VttService, VttRepository, VttProcessor를 이 모듈의 프로바이더로 등록하여
  // NestJS의 의존성 주입(DI) 컨테이너가 관리하도록 합니다.
  providers:,
})
export class VttModule {}