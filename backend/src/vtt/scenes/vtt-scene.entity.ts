// src/vtt/scenes/vtt-scene.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Marker } from '../markers/marker.entity';

@Entity('vtt_scenes')
export class VttScene {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'integer', default: 1000 })
  width: number;

  @Column({ type: 'integer', default: 800 })
  height: number;

  //  배경 이미지 ID (Image 엔티티와 연결) 
  @Column({ type: 'integer', nullable: true })
  backgroundImageId: number;

  // 배경 이미지 URL
  @Column({ type: 'text', nullable: true })
  backgroundImage: string; 

  @Column({ type: 'integer' })  // 기존 roomId
  roomId: number;

  @Column({ type: 'boolean', default: false })
  isActive: boolean;

  @Column({ type: 'jsonb', nullable: true })
  properties: any;

  @OneToMany(() => Marker, marker => marker.scene)
  markers: Marker[];
  
  @Column({ type: 'integer', nullable: true })
  userId: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}