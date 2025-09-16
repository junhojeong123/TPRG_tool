import { Injectable } from '@nestjs/common';
import { DataSource, Repository, QueryRunner } from 'typeorm';
import { Vtt, VttStatus } from './entities/vtt.entity';
import { VttCue } from './entities/vtt-cue.entity';

@Injectable()
export class VttRepository extends Repository<Vtt> {
  constructor(private dataSource: DataSource) {
    super(Vtt, dataSource.createEntityManager());
  }

  // VTT 레코드를 생성하고 초기 상태로 저장합니다.
  async createVtt(originalFileName: string): Promise<Vtt> {
    const vtt = this.create({
      originalFileName,
      status: VttStatus.PROCESSING,
    });
    return this.save(vtt);
  }

  // ID로 VTT를 조회하되, 관련된 모든 큐를 함께 로드(Eager Loading)합니다.
  // leftJoinAndSelect를 사용하여 N+1 문제를 방지합니다.
  async findVttByIdWithCues(id: string): Promise<Vtt | null> {
    return this.createQueryBuilder('vtt')
     .leftJoinAndSelect('vtt.cues', 'cues')
     .where('vtt.id = :id', { id })
     .orderBy('cues.startTime', 'ASC') // 큐를 시작 시간 순으로 정렬
     .getOne();
  }

  // VTT의 상태와 언어 정보를 업데이트합니다.
  async updateVttStatus(
    id: string,
    status: VttStatus,
    language?: string,
  ): Promise<void> {
    const updatePayload: Partial<Vtt> = { status };
    if (language) {
      updatePayload.language = language;
    }
    await this.update(id, updatePayload);
  }

  // VTT 처리 완료 시, 큐 데이터를 벌크로 삽입하고 VTT 상태를 업데이트합니다.
  // 트랜잭션 내에서 실행되어야 데이터 정합성을 보장합니다.
  async saveProcessedVtt(
    vttId: string,
    cues: Partial<VttCue>[],  // 수정: 단일 객체 → 객체 배열
    language: string,
  ): Promise<void> {
    // TypeORM의 QueryRunner를 사용하여 트랜잭션을 직접 제어합니다.
    // 이는 서비스 계층에서 트랜잭션 데코레이터를 사용하는 것보다 더 명시적인 제어를 제공합니다.
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 큐 데이터를 벌크 삽입합니다.
      // 수천 개의 큐를 하나씩 save()하는 것보다 훨씬 효율적입니다.
      await queryRunner.manager.getRepository(VttCue).save(
        cues.map((cue) => ({ ...cue, vttId })),
      );

      // VTT의 상태를 COMPLETED로 업데이트합니다.
      await queryRunner.manager.update(Vtt, vttId, {
        status: VttStatus.COMPLETED,
        language,
      });

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err; // 에러를 상위 서비스 계층으로 전파하여 처리하도록 합니다.
    } finally {
      await queryRunner.release();
    }
  }
}