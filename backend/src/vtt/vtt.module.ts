// backend/src/vtt/vtt.module.ts  (예시 경로)
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
  imports: [
    // TypeORM에 엔티티 등록 (Repository 주입/사용을 위해)
    TypeOrmModule.forFeature([Vtt, VttCue]),

    // Bull 큐 등록 — 'vtt-parsing' 이름을 서비스/프로세서에서 사용합니다.
    BullModule.registerQueue({
      name: 'vtt-parsing',
    }),
  ],
  controllers: [VttController],
  providers: [
    VttService,
    VttRepository,
    VttProcessor,
  ],
  exports: [VttService], // 필요시 export
})
export class VttModule {}
