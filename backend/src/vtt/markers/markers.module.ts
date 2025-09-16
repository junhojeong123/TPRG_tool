import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { Marker } from './entities/marker.entity';
import { MarkersGateway } from './markers.gateway';
import { IMarkerRepository } from './repositories/imarker.repository';
import { MarkerRepository } from './repositories/marker.repository';
import { MoveMarkerHandler } from './commands/handlers/move-marker.handler';
import { GetMarkersBySceneHandler } from './queries/handlers/get-markers-by-scene.handler';
import { WsAuthGuard } from '../../auth/ws-auth.guard';

export const CommandHandlers = [MoveMarkerHandler];
export const QueryHandlers =;

@Module({
  imports:), CqrsModule],
  providers:,
})
export class MarkersModule {}