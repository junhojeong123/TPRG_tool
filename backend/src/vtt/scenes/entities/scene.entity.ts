import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Asset } from '../../assets/entities/asset.entity';

// 그리드 설정을 위한 인터페이스 (JSONB 타입에 해당)
export interface GridSettings {
  type: 'square' | 'hex';
  size: number;
  color: string;
  alpha: number;
}

@Entity('scenes')
export class Scene {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'int' })
  width: number; // 씬의 너비 (픽셀 단위)

  @Column({ type: 'int' })
  height: number; // 씬의 높이 (픽셀 단위)

  // 배경 이미지로 사용될 에셋의 ID (Nullable)
  @Column({ type: 'uuid', nullable: true })
  backgroundAssetId: string | null;

  // Asset 엔티티와의 관계 설정
  @ManyToOne(() => Asset, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'backgroundAssetId' })
  backgroundAsset: Asset;

  @Column({
    type: 'jsonb',
    default: () => `'{"type": "square", "size": 70, "color": "#FFFFFF", "alpha": 0.5}'`,
  })
  gridSettings: GridSettings;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
