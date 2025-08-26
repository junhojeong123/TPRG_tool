
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @Column()
  filename: string;

  @Column()
  originalname: string;

  @Column({ type: 'text', nullable: true }) 
  fileData: string;

  @Column({ nullable: true }) 
  mimetype: string;

  // userId 필드 추가 (업로드한 사용자 ID)
  @Column({ type: 'integer', nullable: true })
  userId: number;

  // 파일 크기 필드 추가
  @Column({ type: 'integer', nullable: true })
  size: number;

  // 우선도(순서) 필드 추가
  @Column({ type: 'integer', default: 0 })
  priority: number;

  // Z-index (CSS 레이어 순서)
  @Column({ type: 'integer', default: 0 })
  zIndex: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  uploadedAt: Date;
}