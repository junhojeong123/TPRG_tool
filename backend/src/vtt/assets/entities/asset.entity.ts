import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Index,
} from 'typeorm';

export enum AssetType {
  IMAGE = 'IMAGE',
  AUDIO = 'AUDIO',
  VIDEO = 'VIDEO',
  UNKNOWN = 'UNKNOWN',
}

@Entity('assets')
export class Asset {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // 어떤 사용자가 업로드했는지 추적하기 위한 ID
  @Index()
  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'varchar', length: 255 })
  originalFileName: string;

  // 서버에 저장된 실제 파일 경로 (내부용)
  @Column({ type: 'varchar', length: 512 })
  filePath: string;

  // 클라이언트가 접근할 수 있는 공개 URL
  @Column({ type: 'varchar', length: 512 })
  url: string;

  // 파일의 MIME 타입 (e.g., 'image/webp', 'audio/ogg')
  @Column({ type: 'varchar', length: 100 })
  mimeType: string;

  // 파일 크기 (bytes)
  @Column({ type: 'int' })
  size: number;

  @Column({
    type: 'enum',
    enum: AssetType,
    default: AssetType.UNKNOWN,
  })
  type: AssetType;

  @CreateDateColumn()
  createdAt: Date;
}