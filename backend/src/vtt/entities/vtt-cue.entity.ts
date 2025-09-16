import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Index,
} from 'typeorm';
import { Vtt } from './vtt.entity';

@Entity('vtt_cues')
@Index() // 특정 VTT 파일 내에서 시간순 조회를 최적화하기 위한 인덱스
export class VttCue {
  @PrimaryGeneratedColumn()
  id: number;

  // VTT 파일 내에서 큐를 식별하는 ID (선택적)
  @Column({ type: 'varchar', length: 255, nullable: true })
  identifier: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 3 })
  startTime: number;

  @Column({ type: 'decimal', precision: 10, scale: 3 })
  endTime: number;

  @Column({ type: 'text' })
  text: string;

  @Column({ type: 'uuid' })
  vttId: string;

  @ManyToOne(() => Vtt, (vtt) => vtt.cues, {
    onDelete: 'CASCADE', // 부모 Vtt가 삭제되면 관련된 모든 VttCue도 함께 삭제됩니다.
  })
  vtt: Vtt;
}