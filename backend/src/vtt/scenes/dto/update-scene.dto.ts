import { PartialType } from '@nestjs/swagger';
import { CreateSceneDto } from './create-scene.dto';

// CreateSceneDto의 모든 필드를 선택적으로 만듭니다.
export class UpdateSceneDto extends PartialType(CreateSceneDto) {}