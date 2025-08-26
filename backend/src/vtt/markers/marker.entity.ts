
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Image } from '../images/image.entity';
import { VttScene } from '../scenes/vtt-scene.entity';

@Entity('vtt_markers')
export class Marker {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  x: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  y: number;

  @Column({ type: 'integer', default: 0 })
  rotation: number;

  @Column({ type: 'integer', default: 100 })
  width: number;

  @Column({ type: 'integer', default: 100 })
  height: number;

  @Column({ type: 'integer', default: 0 })
  zIndex: number;

  @Column({ type: 'jsonb', nullable: true })
  stats: any;

  @Column({ type: 'jsonb', nullable: true })
  properties: any;

  // 토큰 이미지 ID (Image 엔티티와 연결) 
  @Column({ type: 'integer', nullable: true })
  imageId: number;

  // 이미지와 연결
  @ManyToOne(() => Image, { eager: true, nullable: true })
  @JoinColumn()
  image: Image;

  // 씬과 연결
  @ManyToOne(() => VttScene, scene => scene.markers, { onDelete: 'CASCADE' })
  @JoinColumn()
  scene: VttScene;

  // (선택) 외래키 컬럼 명시
  @Column({ type: 'integer', nullable: true })
  sceneId: number;

  @Column({ type: 'integer', nullable: true })
  userId: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}