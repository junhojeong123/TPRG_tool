import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { VttService } from './vtt.service';
import { Logger } from '@nestjs/common';

// 'vtt-parsing' 큐를 처리하는 프로세서임을 명시합니다.
@Processor('vtt-parsing')
export class VttProcessor {
  private readonly logger = new Logger(VttProcessor.name);

  // VttService는 실제 비즈니스 로직을 담고 있으므로,
  // 프로세서는 작업을 받아 서비스에 전달하는 역할에 집중합니다.
  constructor(private readonly vttService: VttService) {}

  // 'parse-vtt'라는 이름의 작업을 처리하는 핸들러입니다.
  // 이 이름은 VttService에서 `queue.add()`를 호출할 때 지정한 이름과 일치해야 합니다.
  @Process('parse-vtt')
  async handleVttParsing(job: Job<{ vttId: string; fileContent: string }>) {
    this.logger.log(`[Job ${job.id}] VTT parsing started for VTT ID: ${job.data.vttId}`);

    try {
      await this.vttService.processVttFile(
        job.data.vttId,
        job.data.fileContent,
      );
      this.logger.log(`[Job ${job.id}] VTT parsing completed successfully.`);
    } catch (error) {
      this.logger.error(`[Job ${job.id}] VTT parsing failed.`, error.stack);
      // 에러를 다시 던져 Bull이 작업을 실패로 처리하고, 설정된 재시도 정책에 따라
      // 재시도하도록 합니다.
      throw error;
    }
  }
}