import { Expose } from 'class-transformer';
import { AssetType } from '../entities/asset.entity';

export class AssetResponseDto {
  @Expose()
  id: string;

  @Expose()
  originalFileName: string;

  @Expose()
  url: string;

  @Expose()
  mimeType: string;

  @Expose()
  size: number;

  @Expose()
  type: AssetType;

  @Expose()
  createdAt: Date;
}