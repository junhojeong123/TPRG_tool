import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Scene } from './entities/scene.entity';
import { Asset } from '../assets/entities/asset.entity';
import { ScenesController } from './scenes.controller';
import { ScenesService } from './scenes.service';
import { ISceneRepository } from './repositories/iscene.repository';
import { SceneRepository } from './repositories/scene.repository';

@Module({
  imports:),
  controllers:,
  providers:,
})
export class ScenesModule {}