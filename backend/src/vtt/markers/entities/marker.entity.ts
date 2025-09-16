import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('markers')
export class Marker {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index() // 특정 씬의 마커들을 빠르게 조회하기 위한 인덱스
  @Column({ type: 'uuid' })
  sceneId: string;

  @Column({ type: 'uuid' })
  assetId: string; // 마커의 이미지로 사용될 에셋의 ID

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'jsonb' })
  position: { x: number; y: number };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}