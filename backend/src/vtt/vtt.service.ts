import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { VttRepository } from './vtt.repository';
import { Vtt, VttStatus } from './entities/vtt.entity';
import { VttCue } from './entities/vtt-cue.entity';
import * as webvtt from 'node-webvtt'; // VTT 파싱 라이브러리

@Injectable()
export class VttService {
  constructor(
    private readonly vttRepository: VttRepository,
    @InjectQueue('vtt-parsing') private readonly vttParsingQueue: Queue,
  ) {}

  /**
   * VTT 파일 업로드를 받아 비동기 처리 작업을 생성하고 큐에 추가합니다.
   * @param file Express.Multer.File 객체
   * @returns 생성된 작업의 정보
   */
  async createVttJob(file: Express.Multer.File): Promise<{ jobId: string | number; vttId: string }> {
    // 1. 데이터베이스에 VTT 레코드를 'PROCESSING' 상태로 먼저 생성합니다.
    // 이는 작업이 큐에 추가되기 전에 실패하더라도 추적할 수 있는 근거를 남깁니다.
    const vtt = await this.vttRepository.createVtt(file.originalname);

    // 2. 파일 내용과 VTT ID를 포함하는 작업을 큐에 추가합니다.
    const job = await this.vttParsingQueue.add('parse-vtt', {
      vttId: vtt.id,
      fileContent: file.buffer.toString('utf-8'),
    });

    return { jobId: job.id, vttId: vtt.id };
  }

  /**
   * 큐 워커에 의해 호출되는 실제 VTT 파일 처리 로직입니다.
   * @param vttId 처리할 VTT의 ID
   * @param fileContent VTT 파일의 문자열 내용
   */
  async processVttFile(vttId: string, fileContent: string): Promise<void> {
    try {
      // 1. VTT 파일 내용을 파싱합니다.
      const parsedVtt = webvtt.parse(fileContent, { strict: false });
      if (!parsedVtt.valid) {
        throw new Error('Invalid VTT file format');
      }

      // 2. 파싱된 큐 데이터를 데이터베이스에 저장할 형태로 변환합니다.
      const cuesToSave: Partial<VttCue>[] = parsedVtt.cues.map((cue) => ({
        identifier: cue.identifier,
        startTime: cue.start,
        endTime: cue.end,
        text: cue.text,
      }));

      // 3. 언어 메타데이터를 추출합니다. (예: 파일 헤더 또는 별도 로직)
      const language = this.extractLanguage(fileContent) || 'en';

      // 4. 리포지토리를 통해 트랜잭션 내에서 큐 데이터를 저장하고 VTT 상태를 업데이트합니다.
      await this.vttRepository.saveProcessedVtt(vttId, cuesToSave, language);
    } catch (error) {
      // 5. 처리 중 오류 발생 시, VTT 상태를 'FAILED'로 업데이트합니다.
      await this.vttRepository.updateVttStatus(vttId, VttStatus.FAILED);
      // 에러를 다시 던져 Bull이 작업을 실패 처리하도록 합니다.
      throw error;
    }
  }

  /**
   * ID로 VTT 정보와 모든 큐를 함께 조회합니다.
   * @param id 조회할 VTT의 ID
   * @returns Vtt 엔티티 (큐 포함)
   */
  async getVttById(id: string): Promise<Vtt> {
    const vtt = await this.vttRepository.findVttByIdWithCues(id);
    if (!vtt) {
      throw new NotFoundException(`VTT with ID "${id}" not found`);
    }
    return vtt;
  }

  // 간단한 언어 추출 로직 예시
  private extractLanguage(content: string): string | null {
    const match = content.match(/Language: (\w+)/);
    return match ? match[1] : null;
  }
}