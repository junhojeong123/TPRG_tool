import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsPositive,
  IsOptional,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { GridSettings } from '../entities/scene.entity';

export class CreateSceneDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @IsPositive()
  width: number;

  @IsInt()
  @IsPositive()
  height: number;

  @IsOptional()
  @IsUUID()
  backgroundAssetId?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => Object) // 실제 프로젝트에서는 GridSettingsDto를 만들어 사용하는 것이 더 좋습니다.
  gridSettings?: GridSettings;
}