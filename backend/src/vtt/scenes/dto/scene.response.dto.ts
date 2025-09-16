import { Expose, Type } from 'class-transformer';
import { GridSettings } from '../entities/scene.entity';

// 씬 응답에 포함될 에셋 정보 DTO
class AssetInfoInSceneDto {
  @Expose()
  id: string;

  @Expose()
  url: string;
}

export class SceneResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  width: number;

  @Expose()
  height: number;

  @Expose()
  @Type(() => AssetInfoInSceneDto)
  backgroundAsset: AssetInfoInSceneDto | null;

  @Expose()
  gridSettings: GridSettings;

  @Expose()
  createdAt: Date;
}