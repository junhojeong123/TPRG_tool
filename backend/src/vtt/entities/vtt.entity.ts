import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { VttCue } from './vtt-cue.entity';

export enum VttStatus {
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

@Entity('vtts')
export class Vtt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  originalFileName: string;

  @Column({
    type: 'enum',
    enum: VttStatus,
    default: VttStatus.PROCESSING,
  })
  status: VttStatus;

  @Column({ type: 'varchar', length: 10, nullable: true })
  language: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Vtt 엔티티가 로드될 때 VttCue는 기본적으로 로드되지 않도록 lazy 로딩을 설정합니다.
  // Eager 로딩은 성능 문제를 유발할 수 있으므로, 필요할 때 명시적으로 JOIN하여 가져옵니다.
  @OneToMany(() => VttCue, (cue) => cue.vtt, {
    cascade: true, // Vtt가 저장될 때 관련된 VttCue들도 함께 저장됩니다.
    lazy: true,
  })
  cues: Promise<VttCue>;
}