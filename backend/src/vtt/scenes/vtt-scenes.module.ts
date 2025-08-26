import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VttScene } from './vtt-scene.entity';
import { MapController } from './vtt-scenes.controller';
import { VttScenesService } from './vtt-scenes.service';

@Module({
  imports: [TypeOrmModule.forFeature([Map])],
  controllers: [MapController],
  providers: [VttScenesService],
  exports: [VttScenesService],
})
export class MapModule {}
